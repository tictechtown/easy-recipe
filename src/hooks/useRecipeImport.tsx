import fetchUrl from "@/lib/fetchUrl";
import parseHtmlString from "@/lib/parseHtmlString";
import { RecipeLD } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";

export default function useRecipeImport(
  addRecipe: (recipe: RecipeLD, url: string) => void,
): [
  (url: string) => Promise<boolean>,
  boolean,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleRecipeImport = async (url: string) => {
    setLoading(true);
    setError(false);
    try {
      const htmlString = await fetchUrl(url);
      const recipe = parseHtmlString(htmlString);
      if (recipe) {
        // add to list
        addRecipe(recipe, url);
      } else {
        setError(true);
      }
      setLoading(false);
      return !!recipe;
    } catch {
      setLoading(false);
      setError(true);
      return false;
    }
  };

  return [handleRecipeImport, loading, error, setError];
}
