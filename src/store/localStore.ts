import slugify from "slugify";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RecipeLD, StoredRecipe } from "../types";

interface RecipeListState {
  importedRecipes: StoredRecipe[];
  addRecipe: (recipe: RecipeLD, url: string) => void;
  removeRecipe: (recipe: StoredRecipe) => void;
  updateRecipeMultiplier: (recipe: StoredRecipe, multiplier: number) => void;
}

export const useRecipeListStore = create<RecipeListState>()(
  persist(
    (set) => ({
      importedRecipes: [],
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
