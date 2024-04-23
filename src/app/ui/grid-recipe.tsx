import { StoredRecipe } from "../lib/types";
import { parseRecipeImage } from "../lib/utils";

type Props = {
  data: StoredRecipe;
};

export default function GridRecipe(props: Props) {
  const { recipe } = props.data;
  const imageUrl = parseRecipeImage(recipe.image);

  return (
    <div className="card card-compact h-full bg-base-200">
      <figure>
        <img src={imageUrl} alt="Album" className="object-cover w-full h-48" />
      </figure>
      <div className="card-body prose">
        <h2 className="card-title ">{recipe.name}</h2>
      </div>
    </div>
  );
}
