"use client";
import HomeMenu from "@/components/home-menu";
import useFilteredRecipes from "@/hooks/useFilteredRecipes";
import useHydration from "@/hooks/useHydration";
import { SortOption } from "@/types";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import EmptyCollection from "../../components/empty-collection";
import GridRecipe from "../../components/grid-recipe";
import { useRecipeListStore } from "../../store/localStore";

export default function Page() {
  const { importedRecipes } = useRecipeListStore((state) => state);
  const isHydrated = useHydration();

  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.LAST_ADDED,
  );
  const [keywordOption, setKeywordOption] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e: ChangeEvent<any>) => {
    setSearchText(e.target.value);
  };

  const handleSortMenuClicked = (sortOption: SortOption) => {
    setSortOption(sortOption);
    document.getElementById("sort-menu")?.removeAttribute("open");
  };

  const handleKeywordToggle = (word: string) => {
    setKeywordOption((prev) => (prev === word ? null : word));
  };

  const [filteredRecipes, keywords] = useFilteredRecipes(
    importedRecipes,
    sortOption,
    searchText,
    keywordOption,
  );

  if (!isHydrated) {
    return <></>;
  }

  if (isHydrated && importedRecipes.length === 0) {
    return (
      <div className="align-center container prose flex h-screen max-w-4xl flex-col gap-8 px-4 py-12 lg:px-0">
        <EmptyCollection />
      </div>
    );
  }

  return (
    <div className="container flex max-w-4xl flex-1 flex-col px-4 py-12 lg:px-0">
      <HomeMenu
        searchText={searchText}
        onSearchChange={handleSearch}
        sortOption={sortOption}
        onSortChange={handleSortMenuClicked}
      />

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
