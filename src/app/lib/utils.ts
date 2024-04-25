import { parseIngredient } from "parse-ingredient";
import { ImageLD, RecipeLD } from "./types";

export function round5(x: number) {
  return Math.ceil(x / 5) * 5;
}

export function formatIngredient(ingredientStr: string) {
  const ig = parseIngredient(ingredientStr, {
    allowLeadingOf: true,
    additionalUOMs: {
      cl: {
        short: "cl",
        plural: "cls",
        alternates: [],
      },
    },
  });
  return ig;
}

export function parseRecipeImage(image: RecipeLD["image"]): string {
  let toProcess = Array.isArray(image) ? image[0] : image;

  return typeof toProcess === "string" ? toProcess : toProcess.url;
}

export function parseRecipeYield(recipeYield: RecipeLD["recipeYield"]): number {
  if (!recipeYield) {
    return 1;
  }
  return +(recipeYield.toString().match(/\d+/) ?? "1");
}

export function parseBrandName(
  brandName: string | undefined,
  fullUrl: string,
): string {
  if (brandName) {
    return brandName;
  }

  return fullUrl
    .replace("http://", "")
    .replace("https://", "")
    .replace("www.", "")
    .split("/")[0];
}

export function parseBrandLogo(
  publisher: RecipeLD["publisher"],
): string | null {
  if (!publisher) {
    return null;
  }

  let logo: ImageLD | [ImageLD] | undefined;

  if (publisher.image) {
    logo = publisher.image;
  } else if (publisher.logo) {
    logo = publisher.logo;
  } else {
    return null;
  }

  if (Array.isArray(logo)) {
    return logo[0].url;
  }

  return logo?.url ?? null;
}
