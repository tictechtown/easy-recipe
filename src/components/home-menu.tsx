import { SortOption } from "@/types";
import { ChangeEvent } from "react";

type Props = {
  searchText: string;
  onSearchChange: (e: ChangeEvent<any>) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
};

export default function HomeMenu({
  searchText,
  onSearchChange,
  sortOption,
  onSortChange,
}: Props) {
  const handleSortMenuBlur = () => {};

  return (
    <div>
      <div className="w-100 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end sm:gap-0">
        <h1 className="text-4xl font-bold">My Recipes</h1>
        <div className="flex-0 flex w-full  flex-col items-end justify-between sm:w-auto sm:flex-row">
          <label className="input input-bordered flex w-full items-center gap-2 sm:w-auto">
            <input
              type="text"
              className="grow "
              placeholder="Search a recipe"
              value={searchText}
              onChange={onSearchChange}
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
                  <summary className="w-auto text-end sm:w-40">
                    {sortOption.toString()}
                  </summary>
                  <ul className="z-10">
                    <li
                      className={`${sortOption !== SortOption.LAST_ADDED && "opacity-60"}`}
                      onClick={() => onSortChange(SortOption.LAST_ADDED)}
                    >
                      <a>{SortOption.LAST_ADDED.toString()}</a>
                    </li>
                    <li
                      className={`${sortOption !== SortOption.NAME_AZ && "opacity-60"}`}
                      onClick={() => onSortChange(SortOption.NAME_AZ)}
                    >
                      <a>{SortOption.NAME_AZ.toString()}</a>
                    </li>
                    <li
                      className={`${sortOption !== SortOption.NAME_ZA && "opacity-60"}`}
                      onClick={() => onSortChange(SortOption.NAME_ZA)}
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
  );
}
