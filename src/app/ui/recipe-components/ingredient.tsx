"use client";
import { formatIngredient } from "../../lib/utils";

export default function Ingredient(props: { ig: string; multiplier: number }) {
  const parsedIngredient = formatIngredient(props.ig);

  const firstItem = parsedIngredient[0];

  const boldText = [
    firstItem.quantity
      ? +(firstItem.quantity * props.multiplier).toFixed(2)
      : null,
    firstItem.unitOfMeasure,
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
