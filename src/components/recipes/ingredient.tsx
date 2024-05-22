"use client";
import { formatIngredient } from "../../lib/utils";

const formattedMap: Record<string, string> = {
  ounce: "oz",
  tablespoon: "tbsp",
  teaspoon: "tsp",
  kilogram: "kg",
  gram: "g",
};

function formatUnitOfMeasure(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return formattedMap[value] ?? value;
}

export default function Ingredient(props: { ig: string; multiplier: number }) {
  const parsedIngredient = formatIngredient(props.ig);

  const firstItem = parsedIngredient[0];
  const boldText = [
    firstItem.quantity
      ? +(firstItem.quantity * props.multiplier).toFixed(2)
      : null,
    formatUnitOfMeasure(firstItem.unitOfMeasureID),
  ].filter((txt) => !!txt);

  return (
    <span>
      {boldText.length > 0 && (
        <strong className="text-primary">{boldText.join(" ")}&nbsp;</strong>
      )}
      {firstItem.description}
    </span>
  );
}
