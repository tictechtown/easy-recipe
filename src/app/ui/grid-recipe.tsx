import { StoredRecipe } from "../lib/types";
import { parseRecipeImage } from "../lib/utils";

type Props = {
  data: StoredRecipe;
};

export default function GridRecipe(props: Props) {
  const { recipe } = props.data;
  const imageUrl = parseRecipeImage(recipe.image);

  return (
    <div className="card card-side card-compact h-full flex-row bg-base-200 sm:flex-col sm:rounded-t-md">
      <figure>
        <img
          src={imageUrl}
          alt="Album"
          className="h-20 w-20 object-cover sm:h-48 sm:w-full"
        />
      </figure>
      <div className="prose card-body flex flex-1 justify-center sm:justify-normal">
        <h6 className="card-title text-sm">{recipe.name}</h6>
      </div>
    </div>
  );
}
