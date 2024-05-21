"use client";
import SideNav from "@/app/recipes/side-nav";
import useAvailableRecipes from "@/hooks/useAvailableRecipes";
import useRecipeImport from "@/hooks/useRecipeImport";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();

  const { addRecipe, removeRecipe } = useRecipeListStore((state) => state);

  const recipes = useAvailableRecipes();

  const [handleRecipeImport, loading] = useRecipeImport(addRecipe);

  const handleRemoveRecipe = (
    rcp: StoredRecipe,
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (pathname === `/recipes/${rcp.id}`) {
      router.replace("/recipes");
    }
    setTimeout(() => {
      removeRecipe(rcp);
    }, 100);
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
            recipesHistory={recipes}
            onRemove={handleRemoveRecipe}
          />
        </div>
      </div>
    </div>
  );
}
