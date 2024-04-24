import { StoredRecipe } from "../lib/types";
import { parseRecipeImage } from "../lib/utils";

type Props = {
  data: StoredRecipe;
};

export default function GridRecipe(props: Props) {
  const { recipe } = props.data;
  const imageUrl = parseRecipeImage(recipe.image);

  return (
    <div className="card card-compact card-side flex-row sm:flex-col sm:rounded-t-md h-full bg-base-200">
      <figure>
        <img
          src={imageUrl}
          alt="Album"
          className="object-cover w-20 sm:w-full h-20 sm:h-48"
        />
      </figure>
      <div className="card-body prose flex flex-1 justify-center sm:justify-normal">
        <h6 className="card-title text-sm">{recipe.name}</h6>
      </div>
    </div>
  );
}
