import { Duration } from "luxon";
import { parseIngredient } from "parse-ingredient";
import slugify from "slugify";
import { ImageLD, RecipeLD, StoredRecipe, SupaRecipe } from "../types";

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

export function isTimerValid(
  timerName: string,
  timerDuration: string,
): boolean {
  const duration = Duration.fromISOTime(timerDuration);

  return timerName !== "" && duration.isValid && duration.toMillis() > 1000;
}

export function sortRecipeByNameAsc(
  recipeA: StoredRecipe,
  recipeB: StoredRecipe,
) {
  const nameA = recipeA.recipe.name.toUpperCase(); // ignore upper and lowercase
  const nameB = recipeB.recipe.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

export function sortRecipeByNameDesc(
  recipeA: StoredRecipe,
  recipeB: StoredRecipe,
) {
  return -sortRecipeByNameAsc(recipeA, recipeB);
}

export function convertToArrayIfNeeded<T>(value: T | T[]): T[] {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  } else if (typeof value === "string") {
    return value.split(", ") as T[];
  }
  return [value];
}

export function convertStoreRecipeToSupaRecipe(
  recipe: StoredRecipe,
  userId: string,
): Partial<SupaRecipe> {
  const rcp: Partial<SupaRecipe> = {
    id: recipe.supaId ?? undefined,
    user_id: userId,
    added_at: recipe.addedAt
      ? new Date(recipe.updatedAt).toISOString()
      : undefined,
    updated_at: recipe.updatedAt
      ? new Date(recipe.updatedAt).toISOString()
      : undefined,
    deleted_at: recipe.deletedAt
      ? new Date(recipe.updatedAt).toISOString()
      : undefined,
    blob: JSON.stringify(recipe.recipe),
    multiplier: recipe.multiplier,
    favorite: recipe.favorite,
  };

  if (!rcp.id) {
    delete rcp["id"];
  }

  if (!rcp.updated_at) {
    delete rcp["updated_at"];
  }

  if (!rcp.deleted_at) {
    delete rcp["deleted_at"];
  }

  return rcp;
}

export function convertSupaRecipeToLocalRecipe(
  supaRecipe: SupaRecipe,
): StoredRecipe {
  const recipeLD = JSON.parse(supaRecipe.blob);
  const newId = slugify(recipeLD.name);
  return {
    id: newId,
    supaId: supaRecipe.id,
    recipe: recipeLD,
    updatedAt: Date.parse(supaRecipe.updated_at),
    addedAt: Date.parse(supaRecipe.added_at),
    favorite: supaRecipe.favorite ?? false,
    multiplier: supaRecipe.multiplier ? supaRecipe.multiplier : undefined,
    deletedAt: supaRecipe.deleted_at
      ? Date.parse(supaRecipe.deleted_at)
      : undefined,
  };
}

export function convertRecipeLDToLocalRecipe(
  recipeLD: RecipeLD,
  url: string,
): StoredRecipe {
  const newId = slugify(recipeLD.name);
  return {
    recipe: { ...recipeLD, url },
    id: newId,
    supaId: null,
    addedAt: Date.now(),
    updatedAt: Date.now(),
    favorite: false,
  };
}
