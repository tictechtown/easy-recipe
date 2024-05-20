"use client";
import useHydration from "@/hooks/useHydration";
import useAuthSession from "@/hooks/useSession";
import supabase from "@/lib/supabase";
import { convertStoreRecipeToSupaRecipe } from "@/lib/utils";
import { RecipeListState, useRecipeListStore } from "@/store/localStore";
import { useRef } from "react";

async function startSyncing(userId: string, state: RecipeListState) {
  const {
    syncRecipes,
    updateRecipe,
    lastRefreshTimestamp,
    importedRecipes,
    updateRefreshTimestamp,
  } = state;

  const { data, error } = await supabase
    .from("Sync")
    .select()
    .eq("user_id", userId);
  // TODO, fetch local store too
  console.log("data,", data, error);

  if (!data || data?.length === 0) {
    const { data: inserted, error: insertedError } = await supabase
      .from("Sync")
      .insert({ user_id: userId })
      .select();
    console.log("insert", inserted, insertedError);
    updateRefreshTimestamp(Date.now());
  } else {
    const lastSyncTimestamp = Date.parse(data[0].updated_at);
    if (!lastRefreshTimestamp || lastSyncTimestamp > lastRefreshTimestamp) {
      // PULL

      const queryPromise = lastRefreshTimestamp
        ? supabase
            .from("Recipe")
            .select()
            .filter("updated_at", "gt", lastRefreshTimestamp)
        : supabase.from("Recipe").select();

      const { data: recipes, error: recipesError } = await queryPromise;

      syncRecipes(recipes, lastSyncTimestamp);
      updateRefreshTimestamp(lastSyncTimestamp);
    } else if (lastSyncTimestamp < lastRefreshTimestamp) {
      // PUSH
      const updatedRecipes = importedRecipes.filter(
        (rc) => rc.updatedAt && rc.updatedAt > lastSyncTimestamp,
      );
      if (updatedRecipes.length > 0) {
        console.log("updatedRecipes", updatedRecipes);
        await supabase.from("Recipe").upsert(updatedRecipes);
      }

      const addedRecipes = importedRecipes.filter((rc) => !rc.supaId);
      if (addedRecipes.length > 0) {
        console.log("added recipes", addedRecipes);
        const { data: newRecipes, error: newError } = await supabase
          .from("Recipe")
          .insert(
            addedRecipes.map((rc) =>
              convertStoreRecipeToSupaRecipe(rc, userId),
            ),
          )
          .select();
        console.log("adta added", newRecipes);
        for (let i = 0; i < addedRecipes.length; i++) {
          updateRecipe(addedRecipes[i], newRecipes[i]);
        }
      }
      console.log("updating ts", importedRecipes);
      // sync timestamp
      await supabase
        .from("Sync")
        .update({
          updated_at: new Date(lastRefreshTimestamp).toISOString(),
        })
        .eq("user_id", userId);
    }
  }
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isHydrated = useHydration();
  const state = useRecipeListStore((state) => state);
  const session = useAuthSession();
  const syncingRef = useRef(false);
  if (session && isHydrated && !syncingRef.current) {
    syncingRef.current = true;
    startSyncing(session.user.id, state).then(() => {
      syncingRef.current = false;
    });
  }
  return <>{children}</>;
}
