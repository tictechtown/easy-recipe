import {
  convertRecipeLDToLocalRecipe,
  convertSupaRecipeToLocalRecipe,
} from "@/lib/utils";
import { createNanoEvents } from "nanoevents";
import slugify from "slugify";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RecipeLD, StoredRecipe, SupaRecipe } from "../types";

export interface RecipeListState {
  importedRecipes: StoredRecipe[];
  lastRefreshTimestamp: number | null;
  getRecipes: () => StoredRecipe[];
  updateRefreshTimestamp: (value: number) => void;
  syncRecipes: (recipes: SupaRecipe[], lastSync: number) => void;
  addRecipe: (recipe: RecipeLD, url: string) => void;
  removeRecipe: (recipe: StoredRecipe) => void;
  updateRecipeMultiplier: (recipe: StoredRecipe, multiplier: number) => void;
}

export const storeUpdateEmitter = createNanoEvents();

export const useRecipeListStore = create<RecipeListState>()(
  persist(
    (set, get) => ({
      importedRecipes: [],
      lastRefreshTimestamp: null,
      getRecipes: () => {
        const recipes = get().importedRecipes;
        return recipes.filter((rc) => !rc.deletedAt);
      },
      updateRefreshTimestamp: (value: number) =>
        set(() => {
          return { lastRefreshTimestamp: value };
        }),
      syncRecipes: (recipes: SupaRecipe[], lastSync: number) => {
        set((state) => {
          let importedRecipes = [...state.importedRecipes];
          for (const supaRecipe of recipes) {
            const localRecipe = convertSupaRecipeToLocalRecipe(supaRecipe);

            const isPresent = importedRecipes.findIndex(
              (rc) => rc.id === localRecipe.id,
            );

            if (isPresent > -1) {
              // TODO - make it better
              importedRecipes[isPresent] = {
                ...importedRecipes[isPresent],
                ...localRecipe,
              };
            } else {
              importedRecipes = [localRecipe, ...importedRecipes];
            }
          }
          return {
            lastRefreshTimestamp: Math.max(
              lastSync,
              state.lastRefreshTimestamp ?? 0,
            ),
            importedRecipes,
          };
        });
      },
      addRecipe: (recipe: RecipeLD, url: string) =>
        set((state) => {
          const newId = slugify(recipe.name);
          const isPresent = state.importedRecipes.find((rc) => rc.id === newId);
          if (isPresent) {
            return state;
          }

          const newRecipe = convertRecipeLDToLocalRecipe(recipe, url);
          const ts = Date.now();
          storeUpdateEmitter.emit("recipe:add", { recipe: newRecipe, ts });

          return {
            lastRefreshTimestamp: ts,
            importedRecipes: [newRecipe, ...state.importedRecipes],
          };
        }),
      removeRecipe: (recipe: StoredRecipe) =>
        set((state) => {
          const ts = Date.now();

          storeUpdateEmitter.emit("recipe:remove", {
            ts,
            recipe: {
              ...recipe,
              deletedAt: ts,
            },
          });

          return {
            lastRefreshTimestamp: ts,
            importedRecipes: state.importedRecipes.filter(
              (rc) => rc.id !== recipe.id,
            ),
          };
        }),
      updateRecipeMultiplier: (recipe: StoredRecipe, multiplier: number) =>
        set((state) => {
          const index = state.importedRecipes.findIndex(
            (rc) => rc.id === recipe.id,
          );
          if (index > -1) {
            const ts = Date.now();
            const recipes = [...state.importedRecipes];
            recipes[index] = {
              ...state.importedRecipes[index],
              multiplier,
            };

            storeUpdateEmitter.emit("recipe:update", { recipe, ts });

            return {
              lastRefreshTimestamp: ts,
              importedRecipes: recipes,
            };
          }
          return state;
        }),
    }),

    {
      name: "recipe-list",
    },
  ),
);
