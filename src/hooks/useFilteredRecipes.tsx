import {
  convertToArrayIfNeeded,
  sortRecipeByNameAsc,
  sortRecipeByNameDesc,
} from "@/lib/utils";
import { SortOption, StoredRecipe } from "@/types";
import { useMemo } from "react";

export default function useFilteredRecipes(
  recipes: StoredRecipe[],
  sortOption: SortOption,
  searchText: string,
  keywordOption: string | null,
): [StoredRecipe[], { word: string; count: number }[]] {
  const keywords: { word: string; count: number }[] = useMemo(() => {
    const keywordObject: Record<string, { word: string; count: number }> = {};

    recipes.forEach((rcp) => {
      const cats = convertToArrayIfNeeded(rcp.recipe.recipeCategory);
      const cuis = convertToArrayIfNeeded(rcp.recipe.recipeCuisine);

      cats.forEach((ct) => {
        if (!keywordObject[ct]) {
          keywordObject[ct] = { word: ct, count: 1 };
        } else {
          keywordObject[ct].count += 1;
        }
      });

      cuis.forEach((ct) => {
        if (!keywordObject[ct]) {
          keywordObject[ct] = { word: ct, count: 1 };
        } else {
          keywordObject[ct].count += 1;
        }
      });
    });

    return Object.values(keywordObject).sort((itemA, itemB) =>
      itemA.word < itemB.word ? -1 : 1,
    );
  }, [recipes]);

  const sortedRecipes = useMemo(() => {
    switch (sortOption) {
      case SortOption.LAST_ADDED:
        return recipes;
      case SortOption.NAME_AZ:
        return [...recipes].sort(sortRecipeByNameAsc);
      case SortOption.NAME_ZA:
        return [...recipes].sort(sortRecipeByNameDesc);
      default:
        return recipes;
    }
  }, [recipes, sortOption]);

  const filteredRecipes = useMemo(() => {
    let searchFilterRecipes = sortedRecipes;

    if (searchText.length > 0) {
      const normalizedText = searchText
        .toLocaleLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/, "");

      searchFilterRecipes = sortedRecipes.filter((rcp) =>
        rcp.recipe.name
          .toLocaleLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/, "")
          .includes(normalizedText),
      );
    }

    if (keywordOption === null) {
      return searchFilterRecipes;
    }

    return searchFilterRecipes.filter(
      (rcp) =>
        rcp.recipe.recipeCategory?.includes(keywordOption) ||
        rcp.recipe.recipeCuisine?.includes(keywordOption),
    );
  }, [sortedRecipes, searchText, keywordOption]);

  return [filteredRecipes, keywords];
}
