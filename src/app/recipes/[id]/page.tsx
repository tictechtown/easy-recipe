"use client";
import { useRecipeListStore } from "@/app/lib/localStore";
import Recipe from "@/app/ui/recipe";
import { notFound, useRouter } from "next/navigation";

export const runtime =
  process.env.NODE_ENV === "production" ? "edge" : "nodejs";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { importedRecipes, removeRecipe } = useRecipeListStore(
    (state) => state
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
  return notFound();
}
