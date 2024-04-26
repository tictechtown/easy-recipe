"use client";
import { sortRecipeByNameAsc, sortRecipeByNameDesc } from "@/lib/utils";
import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import EmptyCollection from "../../components/empty-collection";
import GridRecipe from "../../components/grid-recipe";
import fetchUrl from "../../lib/fetchUrl";
import parseHtmlString from "../../lib/parseHtmlString";
import { useRecipeListStore } from "../../store/localStore";

enum SortOption {
  LAST_ADDED = "Newest",
  NAME_AZ = "Name: A to Z",
  NAME_ZA = "Name: Z to A",
}

function convertToArrayIfNeeded<T>(value: T | T[]): T[] {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}

export default function Page() {
  const { importedRecipes, addRecipe } = useRecipeListStore((state) => state);
  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.LAST_ADDED,
  );
  const [keywordOption, setKeywordOption] = useState<string | null>(null);
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

  const handleSortMenuClicked = (sortOption: SortOption) => {
    setSortOption(sortOption);
    document.getElementById("sort-menu")?.removeAttribute("open");
  };

  const handleSortMenuBlur = () => {
    // TODO - blurring the nav menu breaks clicking on the options
    // requestAnimationFrame(() => {
    //   document.getElementById("sort-menu")?.removeAttribute("open");
    // });
  };

  const handleKeywordToggle = (word: string) => {
    setKeywordOption((prev) => (prev === word ? null : word));
  };

  const keywords: { word: string; count: number }[] = useMemo(() => {
    const keywordObject: Record<string, { word: string; count: number }> = {};

    importedRecipes.forEach((rcp) => {
      const cats = convertToArrayIfNeeded(rcp.recipe.recipeCategory);
      const cuis = convertToArrayIfNeeded(rcp.recipe.recipeCuisine);

      cats.forEach((ct) => {
        if (!keywordObject[ct]) {
          keywordObject[ct] = { word: ct, count: 1 };
        } else {
          keywordObject[ct].count += 1;
        }
      });

      cuis.forEach((ct) => {
        if (!keywordObject[ct]) {
          keywordObject[ct] = { word: ct, count: 1 };
        } else {
          keywordObject[ct].count += 1;
        }
      });
    });

    return Object.values(keywordObject).sort((itemA, itemB) =>
      itemA.word < itemB.word ? -1 : 1,
    );
  }, [importedRecipes]);

  const sortedRecipes = useMemo(() => {
    switch (sortOption) {
      case SortOption.LAST_ADDED:
        return importedRecipes;
      case SortOption.NAME_AZ:
        return [...importedRecipes].sort(sortRecipeByNameAsc);
      case SortOption.NAME_ZA:
        return [...importedRecipes].sort(sortRecipeByNameDesc);
      default:
        return importedRecipes;
    }
  }, [importedRecipes, sortOption]);

  const filteredRecipes = useMemo(() => {
    let searchFilterRecipes = sortedRecipes;

    if (searchText.length > 0) {
      const normalizedText = searchText
        .toLocaleLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/, "");

      searchFilterRecipes = sortedRecipes.filter((rcp) =>
        rcp.recipe.name
          .toLocaleLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/, "")
          .includes(normalizedText),
      );
    }

    if (keywordOption === null) {
      return searchFilterRecipes;
    }

    return searchFilterRecipes.filter(
      (rcp) =>
        rcp.recipe.recipeCategory?.includes(keywordOption) ||
        rcp.recipe.recipeCuisine?.includes(keywordOption),
    );

    return sortedRecipes;
  }, [sortedRecipes, searchText, keywordOption]);

  const [isHydrated, setIsHydrated] = useState(false);

  // Wait till Next.js rehydration completes
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <></>;
  }

  if (isHydrated && importedRecipes.length === 0) {
    return (
      <div className="align-center container prose flex h-screen max-w-4xl flex-col gap-8 px-4 py-12 lg:px-0">
        <EmptyCollection onImport={handleRecipeImport} />
      </div>
    );
  }

  return (
    <div className="container flex max-w-4xl flex-1 flex-col px-4 py-12 lg:px-0">
      <div>
        <div className="w-100 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end sm:gap-0">
          <h1 className="text-4xl font-bold">My Recipes</h1>
          <div className="flex-0 flex w-full flex-row items-end justify-between sm:w-auto">
            <label className="input input-bordered flex w-full items-center gap-2 sm:w-auto">
              <input
                type="text"
                className="grow "
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

            <div className="flex-none">
              <ul className="bg-ghost menu menu-horizontal">
                <li>
                  <details id="sort-menu" onBlur={handleSortMenuBlur}>
                    <summary className="w-40 text-end">
                      {sortOption.toString()}
                    </summary>
                    <ul className="z-10">
                      <li
                        className={`${sortOption !== SortOption.LAST_ADDED && "opacity-60"}`}
                        onClick={() =>
                          handleSortMenuClicked(SortOption.LAST_ADDED)
                        }
                      >
                        <a>{SortOption.LAST_ADDED.toString()}</a>
                      </li>
                      <li
                        className={`${sortOption !== SortOption.NAME_AZ && "opacity-60"}`}
                        onClick={() =>
                          handleSortMenuClicked(SortOption.NAME_AZ)
                        }
                      >
                        <a>{SortOption.NAME_AZ.toString()}</a>
                      </li>
                      <li
                        className={`${sortOption !== SortOption.NAME_ZA && "opacity-60"}`}
                        onClick={() =>
                          handleSortMenuClicked(SortOption.NAME_ZA)
                        }
                      >
                        <a>{SortOption.NAME_ZA.toString()}</a>
                      </li>
                    </ul>
                  </details>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="divider" />
      </div>

      <div>
        <div className="mb-8 flex flex-row gap-2 overflow-x-auto pb-2">
          {keywords.map((kw) => (
            <div
              key={kw.word}
              className={`btn  btn-xs ${kw.word === keywordOption && "btn-primary"}`}
              onClick={(e) => handleKeywordToggle(kw.word)}
            >
              {kw.word}
              <div className="badge badge-xs text-xs">{kw.count}</div>
            </div>
          ))}
        </div>
      </div>
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
