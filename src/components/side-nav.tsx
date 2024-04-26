import { StoredRecipe } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  loading: boolean;
  onAdd: () => void;
  recipesHistory: StoredRecipe[];
  onRemove: (
    rcp: StoredRecipe,
    event: React.MouseEvent<SVGSVGElement, MouseEvent>,
  ) => void;
};

export default function SideNav({
  loading,
  onAdd,
  recipesHistory,
  onRemove,
}: Props) {
  const pathname = usePathname();

  const handleSideNavBlur = () => {
    console.log(document.getElementById("small-drawer-btn")?.style.display);
    if (document.getElementById("small-drawer-btn")?.style.display !== "none") {
      (document.getElementById("drawer-nav") as HTMLInputElement).checked =
        false;
    }
  };

  return (
    <>
      <Link className="text-xl" href="/recipes">
        <div
          className="flex flex-row items-center gap-2"
          onClick={handleSideNavBlur}
        >
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
          <strong>EasyRecipe</strong>
        </div>
      </Link>

      <ul className="mt-4">
        <li>
          <Link href={`/recipes/`}>
            <div
              className="flex w-full flex-row items-center justify-between gap-2"
              onClick={handleSideNavBlur}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                className="h-4 w-4 fill-current"
              >
                <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
              </svg>
              My Recipes
            </div>
          </Link>
        </li>
        <li onClick={onAdd}>
          <Link href={`#`} className="">
            <div
              className="flex w-full flex-row items-center justify-between gap-2"
              onClick={handleSideNavBlur}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                className="h-4 w-4 fill-current"
              >
                <path d="M680-160v-120H560v-80h120v-120h80v120h120v80H760v120h-80ZM440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm560-40h-80q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480Z" />
              </svg>
              Add new Recipe
            </div>
          </Link>
        </li>
      </ul>

      <h4 className="mt-6 text-lg font-bold">History</h4>

      <ul className="mt-2">
        {/* Sidebar content here */}

        {loading && <li>Importing...</li>}

        {recipesHistory.map((rcp) => (
          <li key={rcp.id}>
            <Link
              href={`/recipes/${rcp.id}`}
              className={`group flex ${pathname === `/${rcp.id}`}`}
            >
              <div
                className="flex w-full flex-row justify-between"
                onClick={handleSideNavBlur}
              >
                {rcp.recipe.name}

                <svg
                  onClick={(e) => onRemove(rcp, e)}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="hidden h-4 w-4 fill-neutral-500 hover:scale-110 hover:fill-neutral-900 group-hover:block"
                >
                  <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                </svg>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
