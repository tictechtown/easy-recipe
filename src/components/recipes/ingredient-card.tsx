import { useState } from "react";
import Ingredient from "./ingredient";

type Props = {
  ingredients: string[];
  multiplier: number;
  onShowStepper: () => void;
};
export default function IngredientCard({
  ingredients,
  multiplier,
  onShowStepper,
}: Props) {
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
        <div className="flex flex-row justify-between">
          <h2 className="not-prose card-title">Ingredients</h2>

          <div className="cursor-pointer text-primary" onClick={onShowStepper}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              ></path>
            </svg>
          </div>
        </div>

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
