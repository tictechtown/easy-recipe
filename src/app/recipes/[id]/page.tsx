"use client";
import Recipe from "@/components/recipe";
import useHydration from "@/hooks/useHydration";
import { useRecipeListStore } from "@/store/localStore";
import { notFound, useRouter } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isHydrated = useHydration();

  const { importedRecipes, removeRecipe } = useRecipeListStore(
    (state) => state,
  );
  const storedRecipe = importedRecipes.find((rcp) => rcp.id === params.id);

  const handleRemoveRecipe = () => {
    if (storedRecipe) {
      router.replace("/recipes");
      removeRecipe(storedRecipe);
    }
  };

  if (storedRecipe) {
    return <Recipe data={storedRecipe.recipe} onDelete={handleRemoveRecipe} />;
  }

  if (params.id && isHydrated) {
    return notFound();
  }
  return <main className="h-screen"></main>;
}
