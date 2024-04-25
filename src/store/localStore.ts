import slugify from "slugify";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RecipeLD, StoredRecipe } from "../types";

interface RecipeListState {
  importedRecipes: StoredRecipe[];
  addRecipe: (recipe: RecipeLD, url: string) => void;
  removeRecipe: (recipe: StoredRecipe) => void;
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
    }),
    {
      name: "recipe-list",
    },
  ),
);
