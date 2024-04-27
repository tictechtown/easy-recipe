import { parseRecipeImage } from "../lib/utils";
import { StoredRecipe } from "../types";

type Props = {
  data: StoredRecipe;
  onRemove: (rcp: StoredRecipe, e: any) => void;
};

export default function GridRecipe({ data, onRemove }: Props) {
  const { recipe } = data;
  const imageUrl = parseRecipeImage(recipe.image);

  return (
    <div className="card card-side card-compact h-full flex-row bg-base-200 sm:flex-col sm:rounded-t-md">
      <figure className="sm:rounded-none sm:rounded-t-xl">
        <img
          src={imageUrl}
          alt="Album"
          className="h-20 w-20 object-cover sm:h-48 sm:w-full"
        />
      </figure>
      <div className="prose card-body flex flex-1 justify-center sm:justify-normal">
        <h6 className="card-title text-sm text-primary">{recipe.name}</h6>
      </div>
      <div
        onClick={(e) => onRemove(rcp, e)}
        className="card-actions items-center justify-center rounded-r-xl bg-base-300 px-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="h-4 w-4 fill-neutral-500 hover:scale-110 hover:fill-neutral-900 sm:hidden"
        >
          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
        </svg>
      </div>
    </div>
  );
}
