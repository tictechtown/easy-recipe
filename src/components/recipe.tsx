import he from "he";
import { Duration } from "luxon";
import Link from "next/link";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import {
  convertToArrayIfNeeded,
  parseBrandLogo,
  parseBrandName,
  parseRecipeImage,
  parseRecipeYield,
  round5,
} from "../lib/utils";
import { RecipeLD, StoredRecipe } from "../types";
import AddTimerButton from "./recipes/add-timer-btn";
import Clock from "./recipes/clock";
import IngredientCard from "./recipes/ingredient-card";
import RecipeInstructions from "./recipes/instructions";
import Ratings from "./recipes/ratings";

type Props = {
  data: StoredRecipe;
  onRemove: (recipe: RecipeLD) => void;
  onUpdateMultiplier: (recipe: StoredRecipe, multiplier: number) => void;
};

type RecipeTimer = {
  name: string;
  start: number;
  end: number;
};

export default function Recipe({ data, onRemove, onUpdateMultiplier }: Props) {
  const { recipe } = data;
  const [multiplier, setMultiplier] = useState(data.multiplier ?? 1);
  const [showStepper, setShowStepper] = useState(false);
  const [timers, setTimers] = useState<RecipeTimer[]>([]);
  const recipeYield = parseRecipeYield(recipe.recipeYield);

  const handleShowStepper = () => {
    setShowStepper((prev) => !prev);
  };

  const handleForceShowStepper = () => {
    if (!showStepper) {
      setShowStepper(() => true);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<any>) => {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    switch (event.key) {
      case "Enter":
        // Do something for "enter" or "return" key press.
        setShowStepper(false);
        break;
      case "Escape":
        // Do something for "esc" key press.
        setShowStepper(false);
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  };

  const handleMultiplierChange = (e: ChangeEvent<any>) => {
    onUpdateMultiplier(data, +e.target.value / recipeYield); // this update the saved value
    setMultiplier(+e.target.value / recipeYield);
  };

  const handleMultiplierBlur = () => {
    setShowStepper(false);
  };

  const handleAddTimer = (stepName: string, durationInMS: number) => {
    setTimers((prev) => [
      ...prev,
      { name: stepName, start: Date.now(), end: Date.now() + durationInMS },
    ]);
  };

  const handleAddTimerFromInstruction = (
    stepNumber: number,
    matchedValue: string,
  ) => {
    // TODO - quick and dirty, we should process this better
    const duration = +(matchedValue.match(/\d+/) ?? "0");
    let unit = 1000;
    if (matchedValue.includes("min")) {
      unit = 1000 * 60;
    }
    if (matchedValue.includes("hour")) {
      unit = 1000 * 60 * 60;
    }

    setTimers((prev) => [
      ...prev,
      {
        name: `Step ${stepNumber + 1} (${matchedValue})`,
        start: Date.now(),
        end: Date.now() + unit * duration,
      },
    ]);
  };

  const handleReset = () => {
    onUpdateMultiplier(data, 1); // this update the saved value
    setMultiplier(1);
  };

  const recipeIngredient = Array.isArray(recipe.recipeIngredient)
    ? recipe.recipeIngredient
    : recipe.recipeIngredient?.split(", ") ?? [];

  const prepDuration = Duration.fromISO(recipe.prepTime);
  const cookDuration = Duration.fromISO(recipe.cookTime);
  const totalDuration = Duration.fromISO(recipe.totalTime);
  const includeTotalDuration =
    totalDuration.toMillis() !=
    prepDuration.toMillis() + cookDuration.toMillis();

  const cuisines = convertToArrayIfNeeded(recipe.recipeCuisine);
  const categories = convertToArrayIfNeeded(recipe.recipeCategory);

  const ratingValue = !recipe.aggregateRating
    ? 0
    : round5(
        +recipe.aggregateRating.ratingValue * 10,
      ); /* value between 0 and 50, with 5 increment*/

  const imageUrl = parseRecipeImage(recipe.image);

  const brandName = parseBrandName(
    recipe.publisher?.brand ?? recipe.publisher?.name,
    recipe.url,
  );

  const brandLogo = parseBrandLogo(recipe.publisher);

  return (
    <div className="container flex max-w-4xl animate-fade-in-move-down flex-col gap-4 pb-4 md:gap-8 md:pb-8">
      <div className="flex flex-none">
        <Link href={`/recipes/`}>
          <div className="flex flex-none flex-row content-center gap-2 hover:underline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-4"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
            Back
          </div>
        </Link>
      </div>

      <img
        className="max-h-96 rounded-3xl object-cover  px-2 lg:px-0"
        src={imageUrl}
        alt="cover image"
      />

      <div className="flex flex-col gap-0 md:flex-row md:justify-between md:gap-12">
        <div className="card card-compact bg-base-100 md:basis-2/3">
          <div className="card-body">
            <hgroup>
              <h2 className="card-title text-2xl text-primary sm:text-4xl md:text-5xl">
                {recipe.name}
              </h2>
              {recipe.aggregateRating && (
                <Ratings
                  ratingValue={ratingValue}
                  ratingCount={`${
                    recipe.aggregateRating?.ratingCount ??
                    recipe.aggregateRating?.reviewCount ??
                    "0"
                  }`}
                />
              )}
            </hgroup>

            <div className="py-2">
              {!!recipe.description && <>{he.decode(recipe.description)}</>}
              <div className="my-1 flex flex-row flex-wrap gap-2 *:cursor-pointer">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className="badge bg-base-300 shadow hover:scale-105"
                  >
                    {cat}
                  </div>
                ))}
                {cuisines.map((cuis) => (
                  <div
                    key={cuis}
                    className="badge bg-base-300 shadow hover:scale-105"
                  >
                    {cuis}
                  </div>
                ))}
              </div>
            </div>
            <div className="card-actions">
              <a
                href={recipe.url}
                className="btn btn-outline btn-sm"
                target="_blank"
              >
                <div className="flex items-center gap-4">
                  {brandLogo && (
                    <div className="avatar">
                      <div className="w-4 rounded-full object-cover">
                        <img src={brandLogo} alt="brand logo" />
                      </div>
                    </div>
                  )}
                  <span>{brandName}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path
                        id="Vector"
                        d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
                        stroke="currentcolor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="stats card-bordered stats-horizontal mx-4 overflow-hidden md:stats-vertical">
          {includeTotalDuration && totalDuration.isValid && (
            <div className="stat">
              <div className="md:text-md stat-title text-sm">Total Time</div>
              <div className="stat-value text-2xl md:text-3xl">
                {totalDuration
                  .normalize()
                  .rescale()
                  .toHuman({ unitDisplay: "short" })}
              </div>
            </div>
          )}

          {prepDuration.isValid && prepDuration.toMillis() !== 0 && (
            <div className="stat">
              <div className="md:text-md stat-title text-sm">Prep Time</div>
              <div className="stat-value text-2xl md:text-3xl">
                {prepDuration
                  .normalize()
                  .rescale()
                  .toHuman({ unitDisplay: "short" })}
              </div>
            </div>
          )}

          {cookDuration.isValid && cookDuration.toMillis() !== 0 && (
            <div className="stat">
              <div className="md:text-md stat-title text-sm">Cook Time</div>
              <div className="stat-value text-2xl md:text-3xl">
                {cookDuration
                  .normalize()
                  .rescale()
                  .toHuman({ unitDisplay: "short" })}
              </div>
            </div>
          )}

          <div className="stat overflow-hidden">
            <div className="md:text-md stat-title text-sm">Yield</div>
            <div
              className="stat-value text-2xl md:text-3xl"
              onClick={handleForceShowStepper}
            >
              {showStepper ? (
                <input
                  type="number"
                  min={1}
                  placeholder={`${recipeYield}`}
                  className="focus-ring input w-16"
                  onKeyDown={handleKeyDown}
                  onChange={handleMultiplierChange}
                  onBlur={handleMultiplierBlur}
                />
              ) : (
                <span>{recipeYield * multiplier}</span>
              )}
            </div>
            <div
              className="stat-figure cursor-pointer text-primary"
              onClick={handleShowStepper}
            >
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
            <div className="">
              {multiplier !== 1.0 && (
                <button className="btn btn-link" onClick={handleReset}>
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:gap-2 lg:gap-12	">
        <IngredientCard
          ingredients={recipeIngredient}
          multiplier={multiplier}
        />

        <div className="prose card card-compact mx-4  bg-base-200 sm:card-normal sm:basis-3/5 lg:mx-auto">
          <div className="card-body">
            <h2 className="not-prose card-title">Steps</h2>
            {recipe.recipeInstructions && (
              <RecipeInstructions
                instructions={recipe.recipeInstructions}
                onAddTimer={handleAddTimerFromInstruction}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="prose card card-compact mx-4 bg-base-200 sm:card-normal lg:mx-0 xl:basis-1/3">
          <div className="card-body">
            <h2 className="not-prose card-title">Nutritions</h2>
            {recipe.nutrition && (
              <div className="overflow-x-auto">
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Calories</th>
                      <td>{recipe.nutrition.calories ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Carbs</th>
                      <td>{recipe.nutrition.carbohydrateContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Cholesterol</th>
                      <td>{recipe.nutrition.cholesterolContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Fiber</th>
                      <td>{recipe.nutrition.fiberContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Protein</th>
                      <td>{recipe.nutrition.proteinContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Sodium</th>
                      <td>{recipe.nutrition.sodiumContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Sugar</th>
                      <td>{recipe.nutrition.sugarContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Fat</th>
                      <td>{recipe.nutrition.fatContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Saturated Fat</th>
                      <td>{recipe.nutrition.saturatedFatContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Unsaturated Fat</th>
                      <td>{recipe.nutrition.unsaturatedFatContent ?? "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card card-bordered card-compact mx-4  border-neutral  bg-base-100 sm:card-normal md:basis-2/3 lg:mx-0">
          <div className="card-body">
            <h2 className="card-title">Timers</h2>
            <div className="flex flex-col gap-6">
              {timers.map((timer) => {
                return (
                  <Clock
                    key={timer.name}
                    name={timer.name}
                    startTimerTimestamp={timer.start}
                    endTimerTimestamp={timer.end}
                  />
                );
              })}
              <AddTimerButton onClick={handleAddTimer} />
            </div>
          </div>
        </div>
      </div>

      <button
        className="btn btn-outline btn-error btn-error mx-4 mt-16 lg:mx-0"
        onClick={() => onRemove(recipe)}
      >
        Delete
      </button>
      {process.env.NODE_ENV === "development" && (
        <details className="collapse bg-base-200">
          <summary className="collapse-title text-xl font-medium">
            Debug
          </summary>
          <div className="collapse-content">
            <p>{JSON.stringify(data)}</p>
          </div>
        </details>
      )}
    </div>
  );
}
