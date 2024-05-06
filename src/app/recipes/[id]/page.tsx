"use client";
import Recipe from "@/components/recipe";
import useHydration from "@/hooks/useHydration";
import { useRecipeListStore } from "@/store/localStore";
import { StoredRecipe } from "@/types";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isHydrated = useHydration();
  const [isDeleted, setIsDeleted] = useState(false);

  const paramId = decodeURIComponent(params.id).replace("%3A", ":");

  const { importedRecipes, removeRecipe, updateRecipeMultiplier } =
    useRecipeListStore((state) => state);
  const storedRecipe = importedRecipes.find((rcp) => rcp.id === paramId);

  const handleRemoveRecipe = () => {
    if (storedRecipe) {
      setIsDeleted(true);
      removeRecipe(storedRecipe);
      router.replace("/recipes");
    }
  };

  const handleUpdateMultiplier = (recipe: StoredRecipe, multiplier: number) => {
    updateRecipeMultiplier(recipe, multiplier);
  };

  if (storedRecipe) {
    return (
      <Recipe
        data={storedRecipe}
        onRemove={handleRemoveRecipe}
        onUpdateMultiplier={handleUpdateMultiplier}
      />
    );
  }

  if (isDeleted) {
    return <main className="h-screen"></main>;
  }

  if (params.id && isHydrated) {
    return notFound();
  }
  return <main className="h-screen"></main>;
}
