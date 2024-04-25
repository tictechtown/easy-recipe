"use client";
import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";
import EmptyCollection from "../../components/empty-collection";
import GridRecipe from "../../components/grid-recipe";
import fetchUrl from "../../lib/fetchUrl";
import parseHtmlString from "../../lib/parseHtmlString";
import { useRecipeListStore } from "../../store/localStore";

export default function Page() {
  const { importedRecipes, addRecipe } = useRecipeListStore((state) => state);

  const [searchText, setSearchText] = useState("");

  const handleRecipeImport = async (text: string) => {
    const htmlString = await fetchUrl(text);
    const recipe = parseHtmlString(htmlString);
    if (recipe) {
      // add to list
      addRecipe(recipe, text);
      return true;
    }
    return false;
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
          .includes(normalizedText),
      );
    }

    return importedRecipes;
  }, [importedRecipes, searchText]);

  if (importedRecipes.length === 0) {
    return (
      <div className="align-center container prose flex h-screen max-w-4xl flex-col gap-8 px-4 py-12 lg:px-0">
        <EmptyCollection onImport={handleRecipeImport} />
      </div>
    );
  }

  return (
    <div className="container flex max-w-4xl flex-1 flex-col gap-8 px-4 py-12 lg:px-0">
      <label className="input input-bordered m-4 flex items-center gap-2">
        <input
          type="text"
          className="focus-ring grow "
          placeholder="Search a recipe"
          value={searchText}
          onChange={handleSearch}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {filteredRecipes.map((rcp) => (
          <Link key={rcp.id} href={`/recipes/${rcp.id}`}>
            <GridRecipe data={rcp} />
          </Link>
        ))}
      </div>
    </div>
  );
}
