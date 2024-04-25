"use client";
import { useRecipeListStore } from "@/app/lib/localStore";
import Recipe from "@/app/ui/recipe";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  const { importedRecipes, removeRecipe } = useRecipeListStore(
    (state) => state,
  );
  const storedRecipe = importedRecipes.find((rcp) => rcp.id === params.id);

  // Wait till Next.js rehydration completes
  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
