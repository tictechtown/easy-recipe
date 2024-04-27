"use client";
import Recipe from "@/components/recipe";
import useHydration from "@/hooks/useHydration";
import { useRecipeListStore } from "@/store/localStore";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isHydrated = useHydration();
  const [isDeleted, setIsDeleted] = useState(false);

  const { importedRecipes, removeRecipe } = useRecipeListStore(
    (state) => state,
  );
  const storedRecipe = importedRecipes.find((rcp) => rcp.id === params.id);

  const handleRemoveRecipe = () => {
    if (storedRecipe) {
      setIsDeleted(true);
      removeRecipe(storedRecipe);
      router.replace("/recipes");
    }
  };

  if (storedRecipe) {
    return <Recipe data={storedRecipe.recipe} onRemove={handleRemoveRecipe} />;
  }

  if (isDeleted) {
    return <main className="h-screen"></main>;
  }

  if (params.id && isHydrated) {
    return notFound();
  }
  return <main className="h-screen"></main>;
}
