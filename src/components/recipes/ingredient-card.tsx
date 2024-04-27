import { useState } from "react";
import Ingredient from "./ingredient";

type Props = {
  ingredients: string[];
  multiplier: number;
};
export default function IngredientCard({ ingredients, multiplier }: Props) {
  const [selectedIngredients, setSelectedIngredients] = useState(
    ingredients.map((ig) => ({ ig: ig, selected: false })),
  );

  const selectedCount = selectedIngredients.filter((s) => s.selected).length;

  const handleExportIngredients = () => {
    navigator.share({
      text:
        "- " +
        selectedIngredients
          .filter((s) => !s.selected)
          .map((s) => s.ig)
          .join("\n - "),
    });
  };

  const handleSelectedIngredient = (ingredient: {
    ig: string;
    selected: boolean;
  }) => {
    setSelectedIngredients((prev) => {
      const dup = [...prev];
      const index = dup.findIndex(
        (selectedIngredient) => selectedIngredient.ig === ingredient.ig,
      );
      if (index > -1) {
        dup[index] = { ...dup[index], selected: !dup[index].selected };
      }
      return dup;
    });
  };

  const navigatorCanShare =
    !!navigator.share && navigator.canShare({ text: "" });

  return (
    <div className="prose card card-compact mx-4 bg-base-200 sm:card-normal md:basis-2/5 lg:mx-auto">
      <div className="card-body ">
        <h2 className="not-prose card-title">Ingredients</h2>

        <ul className="my-0 sm:my-1">
          {selectedIngredients.map((selectedIngredient, index) => (
            <li
              key={index + 1}
              className={`rounded hover:bg-base-300 ${selectedIngredient.selected && "opacity-30"} cursor-pointer`}
              onClick={() => handleSelectedIngredient(selectedIngredient)}
            >
              <Ingredient ig={selectedIngredient.ig} multiplier={multiplier} />
            </li>
          ))}
        </ul>
        {navigatorCanShare && (
          <p className="not-prose flex flex-row items-end justify-end">
            <button
              className="btn btn-link items-end justify-end"
              onClick={handleExportIngredients}
            >
              {selectedCount === 0 ? "Export" : `Export selected`}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
