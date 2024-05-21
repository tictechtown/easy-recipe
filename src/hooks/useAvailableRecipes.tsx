import { useRecipeListStore } from "@/store/localStore";

export default function useAvailableRecipes() {
  const importedRecipes = useRecipeListStore((state) => state.importedRecipes);

  return importedRecipes.filter((rc) => !rc.deletedAt);
}
