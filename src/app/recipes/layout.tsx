"use client";
import SideNav from "@/components/side-nav";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AddModal from "../../components/add-modal";
import fetchUrl from "../../lib/fetchUrl";
import parseHtmlString from "../../lib/parseHtmlString";
import { useRecipeListStore } from "../../store/localStore";
import { StoredRecipe } from "../../types";

export default function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id?: string };
}>) {
  const { importedRecipes, addRecipe, removeRecipe } = useRecipeListStore(
    (state) => state,
  );
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);

  const handleRecipeImport = async (url: string) => {
    setLoading(true);
    try {
      const htmlString = await fetchUrl(url);
      const recipe = parseHtmlString(htmlString);
      if (recipe) {
        // add to list
        addRecipe(recipe, url);
      }
      setLoading(false);
      return !!recipe;
    } catch {
      setLoading(false);
      return false;
    }
  };

  const handleRemoveRecipe = (
    rcp: StoredRecipe,
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
  ) => {
    e.preventDefault();
    removeRecipe(rcp);
  };

  const handleAddRecipe = () => {
    (document.getElementById("add-modal") as HTMLDialogElement).showModal();
  };

  return (
    <div className="drawer xl:drawer-open">
      <input id="drawer-nav" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col items-center justify-center">
        <div className="navbar bg-base-100">
          <label
            aria-label="Open menu"
            htmlFor="drawer-nav"
            id="small-drawer-btn"
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

          <div className="flex flex-1 xl:hidden">
            <a className="btn btn-ghost text-xl" href="/recipes">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
          <div
            className="flex-0 btn btn-outline btn-primary xl:hidden"
            onClick={handleAddRecipe}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              className="h-4 w-4 fill-current"
            >
              <path d="M680-160v-120H560v-80h120v-120h80v120h120v80H760v120h-80ZM440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm560-40h-80q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480Z" />
            </svg>
            Add
          </div>
        </div>
        {children}
        <AddModal onImport={handleRecipeImport} />
      </div>

      <div className="drawer-side">
        <label
          htmlFor="drawer-nav"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="menu min-h-full w-72 bg-base-200 p-4 text-base-content">
          <SideNav
            loading={loading}
            onAdd={handleAddRecipe}
            recipesHistory={importedRecipes}
            onRemove={handleRemoveRecipe}
          />
        </div>
      </div>
    </div>
  );
}
