"use client";
import useHydration from "@/hooks/useHydration";
import useRecipeImport from "@/hooks/useRecipeImport";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecipeListStore } from "../store/localStore";

export default function Home() {
  const router = useRouter();
  const isHydrated = useHydration();
  const { importedRecipes, addRecipe } = useRecipeListStore((state) => state);
  const [text, setText] = useState("");
  const [handleRecipeImport, loading] = useRecipeImport(addRecipe);
  useEffect(() => {
    if (importedRecipes.length > 0) {
      router.push("/recipes");
    }
  }, [router, importedRecipes]);

  if (!isHydrated) {
    return <main className="hero min-h-screen bg-base-200"></main>;
  }

  return (
    <main className="hero min-h-screen bg-base-200">
      <div className="prose hero-content text-center">
        <div className="max-w-4xl">
          <div className="align-center flex animate-fade-in-move-down justify-center text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M7.253 4.255a5.25 5.25 0 0 1 9.494 0A5.75 5.75 0 0 1 19.75 15.05v3.002c0 .899 0 1.648-.08 2.242c-.084.628-.27 1.195-.726 1.65c-.455.456-1.022.642-1.65.726c-.594.08-1.344.08-2.242.08H8.948c-.898 0-1.648 0-2.242-.08c-.628-.084-1.195-.27-1.65-.726c-.456-.455-.642-1.022-.726-1.65c-.08-.594-.08-1.343-.08-2.242v-3.001A5.75 5.75 0 0 1 7.253 4.256m-.45 1.5A4.25 4.25 0 0 0 5.3 13.897a.75.75 0 0 1 .45.687V18c0 .964.002 1.612.067 2.095c.062.461.169.659.3.789c.13.13.327.237.788.3c.483.064 1.131.066 2.095.066h6c.964 0 1.612-.002 2.095-.067c.461-.062.659-.169.789-.3c.13-.13.237-.327.3-.788c.064-.483.066-1.131.066-2.095v-3.416a.75.75 0 0 1 .45-.687a4.251 4.251 0 0 0-1.503-8.142c.035.243.053.492.053.745V7a.75.75 0 0 1-1.5 0v-.5A3.746 3.746 0 0 0 12 2.75A3.752 3.752 0 0 0 8.25 6.5V7a.75.75 0 0 1-1.5 0v-.5c0-.253.018-.502.053-.745M8.25 18a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="animate-fade-in-move-down text-5xl font-bold text-primary">
            Welcome to EasyRecipe
          </h1>
          <p className="animation-mode-backward animation-delay-200 animate-fade-in-move-down">
            Start by adding a recipe URL
          </p>
          <div className="animation-mode-backward animation-delay-500 join flex w-full animate-fade-in-move-down flex-row">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://"
              className="focus-ring input join-item input-bordered flex basis-4/5 rounded-l-full"
            />
            <button
              className="btn btn-primary join-item rounded-r-full "
              onClick={() => {
                handleRecipeImport(text);
              }}
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
