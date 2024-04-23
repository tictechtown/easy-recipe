"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import fetchUrl from "./lib/fetchUrl";
import { useRecipeListStore } from "./lib/localStore";
import parseHtmlString from "./lib/parseHtmlString";

export default function Home() {
  const router = useRouter();
  const { importedRecipes, addRecipe } = useRecipeListStore((state) => state);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const handleRecipeImport = async () => {
    setLoading(true);
    const htmlString = await fetchUrl(text);
    const recipe = parseHtmlString(htmlString);
    if (recipe) {
      // add to list
      addRecipe(recipe, text);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (importedRecipes.length > 0) {
      router.push("/recipes");
    }
  }, [router, importedRecipes]);

  return (
    <main className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold">Welcome to EasyRecipe</h1>
          <p className="py-6">Start by adding a recipe URL</p>
          <div>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://"
              className="input input-bordered w-full max-w-xs"
            />
            <button
              className="btn btn-primary ml-4"
              onClick={handleRecipeImport}
            >
              {loading && <span className="loading loading-spinner"></span>}
              Get Started
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
