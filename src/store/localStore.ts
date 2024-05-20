import slugify from "slugify";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RecipeLD, StoredRecipe, SupaRecipe } from "../types";

export interface RecipeListState {
  importedRecipes: StoredRecipe[];
  lastRefreshTimestamp: number | null;
  updateRefreshTimestamp: (value: number) => void;
  syncRecipes: (recipes: SupaRecipe[], lastSync: number) => void;
  addRecipe: (recipe: RecipeLD, url: string) => void;
  removeRecipe: (recipe: StoredRecipe) => void;
  updateRecipe: (recipe: StoredRecipe, supaRecipe: SupaRecipe) => void;
  updateRecipeMultiplier: (recipe: StoredRecipe, multiplier: number) => void;
}

function convertSupaRecipeToLocalRecipe(supaRecipe: SupaRecipe): StoredRecipe {
  const recipeLD = JSON.parse(supaRecipe.blob);
  const newId = slugify(recipeLD.name);
  return {
    id: newId,
    supaId: supaRecipe.id,
    recipe: recipeLD,
    updatedAt: Date.parse(supaRecipe.updated_at ?? ""),
    dateAdded: new Date(),
    favorite: supaRecipe.favorite ?? false,
  };
}

export const useRecipeListStore = create<RecipeListState>()(
  persist(
    (set) => ({
      importedRecipes: [],
      lastRefreshTimestamp: null,
      updateRefreshTimestamp: (value: number) =>
        set(() => {
          return { lastRefreshTimestamp: value };
        }),
      syncRecipes: (recipes: SupaRecipe[], lastSync: number) => {
        set((state) => {
          let importedRecipes = [...state.importedRecipes];
          for (const supaRecipe of recipes) {
            const isPresent = importedRecipes.findIndex(
              (rc) => rc.supaId === supaRecipe.id,
            );
            if (isPresent > -1) {
              importedRecipes[isPresent] =
                convertSupaRecipeToLocalRecipe(supaRecipe);
            } else {
              importedRecipes = [
                convertSupaRecipeToLocalRecipe(supaRecipe),
                ...importedRecipes,
              ];
            }
          }
          return { lastRefreshTimestamp: lastSync, importedRecipes };
        });
      },
      updateRecipe: (recipe: StoredRecipe, supaRecipe: SupaRecipe) =>
        set((state) => {
          const importedRecipes = [...state.importedRecipes];

          const recipeIndex = importedRecipes.findIndex(
            (rc) => rc.id !== recipe.id,
          );
          if (recipeIndex > -1) {
            importedRecipes[recipeIndex] = {
              ...importedRecipes[recipeIndex],
              supaId: supaRecipe.id,
              updatedAt: Date.parse(supaRecipe.updated_at),
            };
          }

          return {
            importedRecipes,
          };
        }),
      addRecipe: (recipe: RecipeLD, url: string) =>
        set((state) => {
          const newId = slugify(recipe.name);
          const isPresent = state.importedRecipes.find((rc) => rc.id === newId);
          if (isPresent) {
            return state;
          }

          return {
            importedRecipes: [
              {
                recipe: { ...recipe, url },
                id: newId,
                supaId: null,
                updatedAt: null,
                dateAdded: new Date(),
                favorite: false,
              },
              ...state.importedRecipes,
            ],
          };
        }),
      removeRecipe: (recipe: StoredRecipe) =>
        set((state) => ({
          importedRecipes: state.importedRecipes.filter(
            (rc) => rc.id !== recipe.id,
          ),
        })),
      updateRecipeMultiplier: (recipe: StoredRecipe, multiplier: number) =>
        set((state) => {
          const index = state.importedRecipes.findIndex(
            (rc) => rc.id === recipe.id,
          );
          if (index > -1) {
            state.importedRecipes[index] = {
              ...state.importedRecipes[index],
              multiplier,
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
