"use client";
import HomeMenu from "@/components/home-menu";
import SignedUserButton from "@/components/signed-user-btn";
import useFilteredRecipes from "@/hooks/useFilteredRecipes";
import useHydration from "@/hooks/useHydration";
import useAuthSession from "@/hooks/useSession";
import { SortOption, StoredRecipe } from "@/types";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import EmptyCollection from "../../components/empty-collection";
import GridRecipe from "../../components/grid-recipe";
import { useRecipeListStore } from "../../store/localStore";

export default function Page() {
  const { importedRecipes, removeRecipe } = useRecipeListStore(
    (state) => state,
  );
  const isHydrated = useHydration();

  const session = useAuthSession();

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

  const handleRemoveRecipe = (rcp: StoredRecipe) => {
    removeRecipe(rcp);
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
    <>
      {!session && (
        <div className="mx-4 max-w-4xl lg:mx-0">
          <div role="alert" className="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              Warning: you are not signed in. You are at risk of losing your
              data!
            </span>
            <SignedUserButton />
          </div>
        </div>
      )}
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
              <GridRecipe data={rcp} onRemove={handleRemoveRecipe} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
