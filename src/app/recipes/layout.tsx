"use client";
import SideNav from "@/app/recipes/side-nav";
import useRecipeImport from "@/hooks/useRecipeImport";
import AddModal from "../../components/add-modal";
import { useRecipeListStore } from "../../store/localStore";
import { StoredRecipe } from "../../types";
import TopBar from "./top-bar";

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

  const [handleRecipeImport, loading] = useRecipeImport(addRecipe);

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
        <TopBar onAdd={handleAddRecipe} />
        {children}
        <AddModal onImport={handleRecipeImport} loading={loading} />
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
