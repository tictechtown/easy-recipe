"use client";
import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";
import fetchUrl from "../lib/fetchUrl";
import { useRecipeListStore } from "../lib/localStore";
import parseHtmlString from "../lib/parseHtmlString";
import GridRecipe from "../ui/grid-recipe";

export default function Page() {
  const { importedRecipes, addRecipe } = useRecipeListStore((state) => state);

  const [searchText, setSearchText] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSearch = (e: ChangeEvent<any>) => {
    setSearchText(e.target.value);
  };

  const filteredRecipes = useMemo(() => {
    if (searchText.length > 0) {
      const normalizedText = searchText
        .toLocaleLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/, "");

      return importedRecipes.filter((rcp) =>
        rcp.recipe.name
          .toLocaleLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/, "")
          .includes(normalizedText)
      );
    }

    return importedRecipes;
  }, [importedRecipes, searchText]);

  if (importedRecipes.length === 0) {
    return (
      <div className="container flex flex-col gap-2  h-screen  max-w-4xl py-12 px-4 lg:px-0 ">
        <h3 className="font-bold text-lg">Add a recipe URL</h3>
        <div className="flex flex-row gap-8">
          <input
            type="text"
            value={text}
            placeholder="https://"
            className="input input-bordered basis-4/5"
            onChange={(e) => setText(e.target.value)}
          />

          {loading ? (
            <button className="btn basis-1/5">
              <span className="loading loading-spinner"></span>
              loading
            </button>
          ) : (
            <button
              disabled={!text}
              className="btn btn-primary basis-1/5"
              onClick={handleRecipeImport}
            >
              Import
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container flex flex-col gap-8  h-screen  max-w-4xl py-12 px-4 lg:px-0">
      <label className="input input-bordered flex items-center gap-2 m-4">
        <input
          type="text"
          className="grow"
          placeholder="Search a recipe"
          value={searchText}
          onChange={handleSearch}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredRecipes.map((rcp) => (
          <Link key={rcp.id} href={`/recipes/${rcp.id}`}>
            <GridRecipe data={rcp} />
          </Link>
        ))}
      </div>
    </div>
  );
}
