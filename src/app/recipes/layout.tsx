"use client";
import Link from "next/link";
import { useState } from "react";
import fetchUrl from "../lib/fetchUrl";
import { useRecipeListStore } from "../lib/localStore";
import parseHtmlString from "../lib/parseHtmlString";
import { StoredRecipe } from "../lib/types";
import AddModal from "../ui/add-modal";

export default function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id?: string };
}>) {
  const { importedRecipes, addRecipe, removeRecipe } = useRecipeListStore(
    (state) => state
  );

  const [loading, setLoading] = useState(false);

  const handleRecipeImport = async (url: string) => {
    setLoading(true);
    const htmlString = await fetchUrl(url);
    const recipe = parseHtmlString(htmlString);
    if (recipe) {
      // add to list
      addRecipe(recipe, url);
    }
    setLoading(false);
  };

  const handleRemoveRecipe = (
    rcp: StoredRecipe,
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();
    removeRecipe(rcp);
  };

  console.log("params", params);

  return (
    <div className="drawer xl:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col items-center justify-center">
        <div className="navbar bg-base-100">
          <label
            aria-label="Open menu"
            htmlFor="my-drawer-2"
            className="btn btn-square btn-ghost drawer-button xl:hidden "
          >
            <svg
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>

          <div className="flex-1">
            <a className="btn btn-ghost text-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M7.253 4.255a5.25 5.25 0 0 1 9.494 0A5.75 5.75 0 0 1 19.75 15.05v3.002c0 .899 0 1.648-.08 2.242c-.084.628-.27 1.195-.726 1.65c-.455.456-1.022.642-1.65.726c-.594.08-1.344.08-2.242.08H8.948c-.898 0-1.648 0-2.242-.08c-.628-.084-1.195-.27-1.65-.726c-.456-.455-.642-1.022-.726-1.65c-.08-.594-.08-1.343-.08-2.242v-3.001A5.75 5.75 0 0 1 7.253 4.256m-.45 1.5A4.25 4.25 0 0 0 5.3 13.897a.75.75 0 0 1 .45.687V18c0 .964.002 1.612.067 2.095c.062.461.169.659.3.789c.13.13.327.237.788.3c.483.064 1.131.066 2.095.066h6c.964 0 1.612-.002 2.095-.067c.461-.062.659-.169.789-.3c.13-.13.237-.327.3-.788c.064-.483.066-1.131.066-2.095v-3.416a.75.75 0 0 1 .45-.687a4.251 4.251 0 0 0-1.503-8.142c.035.243.053.492.053.745V7a.75.75 0 0 1-1.5 0v-.5A3.746 3.746 0 0 0 12 2.75A3.752 3.752 0 0 0 8.25 6.5V7a.75.75 0 0 1-1.5 0v-.5c0-.253.018-.502.053-.745M8.25 18a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75"
                  clipRule="evenodd"
                />
              </svg>
              EasyRecipe
            </a>
          </div>
          <div className="flex-none gap-2">
            {/* <div className="form-control">
              <input
                type="text"
                placeholder="Search"
                className="input input-bordered w-24 md:w-auto"
              />
            </div> */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn m-1">
                Theme
                <svg
                  width="12px"
                  height="12px"
                  className="h-2 w-2 fill-current opacity-60 inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 2048 2048"
                >
                  <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52"
              >
                <li>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Default"
                    value="default"
                  />
                </li>
                <li>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Retro"
                    value="retro"
                  />
                </li>
                <li>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Cyberpunk"
                    value="cyberpunk"
                  />
                </li>
                <li>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Valentine"
                    value="valentine"
                  />
                </li>
                <li>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Aqua"
                    value="aqua"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
        {children}
        <AddModal onImport={handleRecipeImport} />
      </div>

      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <div className="flex justify-center w-full bg-base-200">
            <button
              className="btn btn-primary btn-wide"
              onClick={() =>
                (
                  document.getElementById("add-modal") as HTMLDialogElement
                ).showModal()
              }
            >
              Add new Recipe
            </button>
          </div>

          <ul className="mt-4">
            {/* Sidebar content here */}

            {loading && <li>Importing...</li>}

            <li>
              <Link
                href={`/recipes/`}
                className="flex flex-row justify-between"
              >
                All Recipes
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 stroke-current rotate-90"
                  strokeWidth={6}
                >
                  <path
                    d="M52 46.1836L41.591 35.7746C40.7123 34.8959 39.2877 34.8959 38.409 35.7746L28 46.1836"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>

            {importedRecipes.map((rcp) => (
              <li key={rcp.id}>
                <Link
                  href={`/recipes/${rcp.id}`}
                  className={`flex flex-row justify-between ${
                    rcp.id === params.id ? "active" : ""
                  }`}
                >
                  {rcp.recipe.name}

                  <svg
                    onClick={(e) => handleRemoveRecipe(rcp, e)}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="h-4 w-4"
                  >
                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
