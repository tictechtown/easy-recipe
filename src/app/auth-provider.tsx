"use client";
import useHydration from "@/hooks/useHydration";
import useAuthSession from "@/hooks/useSession";
import { pushChanges, pushLastUpdateTimestamp } from "@/lib/supabase/mutations";
import {
  pullLastUpdateTimestamp,
  pullRecipeChangesSince,
} from "@/lib/supabase/queries";
import { convertStoreRecipeToSupaRecipe } from "@/lib/utils";
import {
  RecipeListState,
  storeUpdateEmitter,
  useRecipeListStore,
} from "@/store/localStore";
import { SupaRecipe } from "@/types";
import { useRef } from "react";

async function startSyncing(userId: string, state: RecipeListState) {
  const {
    syncRecipes,
    lastRefreshTimestamp,
    importedRecipes,
    updateRefreshTimestamp,
  } = state;

  const { data, error } = await pullLastUpdateTimestamp(userId);

  if (!data || data?.length === 0) {
    const { data: inserted, error: insertedError } =
      await pushLastUpdateTimestamp(userId);
    updateRefreshTimestamp(Date.now());
  } else {
    const lastSyncTimestamp = Date.parse(data[0].updated_at);
    if (!lastRefreshTimestamp || lastSyncTimestamp !== lastRefreshTimestamp) {
      // PULL
      const { data: recipes, error: recipesError } =
        await pullRecipeChangesSince(userId, lastRefreshTimestamp);

      // MERGE
      syncRecipes(recipes as SupaRecipe[], lastSyncTimestamp);

      // PUSH
      const localUpdatedRecipes = importedRecipes.filter(
        (rc) => rc.updatedAt && rc.updatedAt > lastSyncTimestamp,
      );
      const localAddedRecipes = importedRecipes.filter((rc) => !rc.supaId);

      const syncTimestamp = Math.max(
        lastRefreshTimestamp ?? 0,
        lastSyncTimestamp,
      );

      const addedSupaRecipes = await pushChanges(
        localAddedRecipes.map((rc) =>
          convertStoreRecipeToSupaRecipe(rc, userId),
        ),
        localUpdatedRecipes.map((rc) =>
          convertStoreRecipeToSupaRecipe(rc, userId),
        ),
        userId,
        syncTimestamp === lastSyncTimestamp ? undefined : syncTimestamp,
      );

      syncRecipes(addedSupaRecipes, syncTimestamp);
    }
  }

  storeUpdateEmitter.on("recipe:add", ({ recipe, ts }) => {
    pushChanges(
      [convertStoreRecipeToSupaRecipe(recipe, userId)],
      [],
      userId,
      ts,
    );
  });
  storeUpdateEmitter.on("recipe:remove", ({ recipe, ts }) => {
    pushChanges(
      [],
      [convertStoreRecipeToSupaRecipe(recipe, userId)],
      userId,
      ts,
    );
  });
  storeUpdateEmitter.on("recipe:update", ({ recipe, ts }) => {
    pushChanges(
      [],
      [convertStoreRecipeToSupaRecipe(recipe, userId)],
      userId,
      ts,
    );
  });
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
    startSyncing(session.user.id, state);
  }
  return <>{children}</>;
}
