import he from "he";
import { Duration } from "luxon";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { RecipeLD } from "../lib/types";
import {
  parseBrandLogo,
  parseBrandName,
  parseRecipeImage,
  round5,
} from "../lib/utils";
import Clock from "./recipe-components/clock";
import Ingredient from "./recipe-components/ingredient";
import RecipeInstructions from "./recipe-components/instructions";
import Ratings from "./recipe-components/ratings";

type Props = {
  data: RecipeLD;
  onDelete: (recipe: RecipeLD) => void;
};

type RecipeTimer = {
  name: string;
  start: number;
  end: number;
};

export default function Recipe({ data, onDelete }: Props) {
  const [multiplier, setMultiplier] = useState(1);
  const [showStepper, setShowStepper] = useState(false);
  const [timers, setTimers] = useState<RecipeTimer[]>([]);
  const recipeYield = +(data.recipeYield.toString().match(/\d+/) ?? "1");

  const handleShowStepper = () => {
    setShowStepper((prev) => !prev);
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
    setMultiplier(+e.target.value / recipeYield);
  };

  const handleAddTimer = () => {
    setTimers((prev) => [
      ...prev,
      { name: "New Timer", start: Date.now(), end: Date.now() + 1000 * 2 * 60 },
    ]);
  };

  const handleAddTimerFromInstruction = (
    stepNumber: number,
    matchedValue: string
  ) => {
    // TODO - quick and dirty, we should process this better
    const duration = +(matchedValue.match(/\d+/) ?? "0");
    let unit = 1000;
    if (matchedValue.includes("minute")) {
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

  const prepDuration = Duration.fromISO(data.prepTime);
  const cookDuration = Duration.fromISO(data.cookTime);
  const totalDuration = Duration.fromISO(data.totalTime);
  const includeTotalDuration =
    totalDuration.toMillis() !=
    prepDuration.toMillis() + cookDuration.toMillis();

  const cuisines = Array.isArray(data.recipeCuisine)
    ? data.recipeCuisine
    : data.recipeCuisine
    ? [data.recipeCuisine]
    : [];

  const categories = Array.isArray(data.recipeCategory)
    ? data.recipeCategory
    : data.recipeCategory
    ? [data.recipeCategory]
    : [];

  const ratingValue = round5(
    +data.aggregateRating.ratingValue * 10
  ); /* value between 0 and 50, with 5 increment*/

  const imageUrl = parseRecipeImage(data.image);

  const recipeIngredient = Array.isArray(data.recipeIngredient)
    ? data.recipeIngredient
    : data.recipeIngredient?.split(", ") ?? [];

  const brandName = parseBrandName(
    data.publisher?.brand ?? data.publisher?.name,
    data.url
  );

  const brandLogo = parseBrandLogo(data.publisher);

  return (
    <div className="container flex flex-col gap-8 py-12 max-w-4xl  px-4 lg:px-0">
      <img
        className="rounded-3xl max-h-96 object-cover"
        src={imageUrl}
        alt="cover image"
      />

      <div className="flex flex-col md:flex-row gap-12 md:justify-between">
        <div className="card bg-base-100  mx-4 sm:mx-0">
          <div className="card-body">
            <h2 className="card-title text-5xl text-primary">{data.name}</h2>
            <Ratings
              ratingValue={ratingValue}
              ratingCount={`${
                data.aggregateRating.ratingCount ??
                data.aggregateRating.reviewCount ??
                ""
              }`}
            />

            {!!data.description && <>{he.decode(data.description)}</>}
            <div className="flex flex-row gap-2 *:cursor-pointer my-2">
              {categories.map((cat) => (
                <div key={cat} className="badge badge-ghost hover:scale-105">
                  {cat}
                </div>
              ))}
              {cuisines.map((cuis) => (
                <div key={cuis} className="badge badge-ghost hover:scale-105">
                  {cuis}
                </div>
              ))}
            </div>
            <a href={data.url}>
              <div className="flex gap-4 items-center badge shadow hover:scale-105 cursor-pointer pointer-events-auto">
                {brandLogo && (
                  <div className="avatar">
                    <div className="w-4 rounded-full object-cover">
                      <img src={brandLogo} alt="brand logo" />
                    </div>
                  </div>
                )}
                <span>{brandName}</span>
              </div>
            </a>
          </div>
        </div>

        <div className="card bg-base-00 mx-4 sm:mx-0 card-bordered">
          <div className="card-body">
            <div className="stats stats-vertical">
              {includeTotalDuration && totalDuration.isValid && (
                <div className="stat">
                  <div className="stat-title">Total Time</div>
                  <div className="stat-value">
                    {totalDuration
                      .normalize()
                      .rescale()
                      .toHuman({ unitDisplay: "short" })}
                  </div>
                </div>
              )}

              {prepDuration.isValid && prepDuration.toMillis() !== 0 && (
                <div className="stat">
                  <div className="stat-title">Prep Time</div>
                  <div className="stat-value">
                    {prepDuration
                      .normalize()
                      .rescale()
                      .toHuman({ unitDisplay: "short" })}
                  </div>
                </div>
              )}

              {cookDuration.isValid && cookDuration.toMillis() !== 0 && (
                <div className="stat">
                  <div className="stat-title">Cook Time</div>
                  <div className="stat-value">
                    {cookDuration
                      .normalize()
                      .rescale()
                      .toHuman({ unitDisplay: "short" })}
                  </div>
                </div>
              )}

              <div className="stat">
                <div className="stat-title">Yield</div>
                <div className="stat-value">
                  {showStepper ? (
                    <input
                      type="number"
                      min={1}
                      placeholder={`${recipeYield}`}
                      className="input w-full max-w-xs"
                      onKeyDown={handleKeyDown}
                      onChange={handleMultiplierChange}
                    />
                  ) : (
                    <span>{recipeYield * multiplier}</span>
                  )}
                </div>
                <div
                  className="stat-figure text-primary cursor-pointer"
                  onClick={handleShowStepper}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
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
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 align-center">
        <div className="card bg-base-200 mx-4 lg:mx-auto prose  sm:basis-2/5">
          <div className="card-body ">
            <h2 className="card-title not-prose">Ingredients</h2>
            <div className="divider" />
            <div>
              <ul>
                {recipeIngredient.map((rI, index) => (
                  <li key={index + 1}>
                    <Ingredient ig={rI} multiplier={multiplier} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="card  bg-base-200  sm:basis-3/5 mx-4 lg:mx-auto prose">
          <div className="card-body">
            <h2 className="card-title not-prose">Steps</h2>
            <div className="divider" />
            {data.recipeInstructions && (
              <RecipeInstructions
                instructions={data.recipeInstructions}
                onAddTimer={handleAddTimerFromInstruction}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="card bg-base-200 xl:basis-1/3 mx-4 lg:mx-auto prose">
          <div className="card-body">
            <h2 className="card-title not-prose">Nutritions</h2>
            <div className="divider" />
            {data.nutrition && (
              <div className="overflow-x-auto">
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Calories</th>
                      <td>{data.nutrition.calories ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Carbs</th>
                      <td>{data.nutrition.carbohydrateContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Cholesterol</th>
                      <td>{data.nutrition.cholesterolContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Fiber</th>
                      <td>{data.nutrition.fiberContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Protein</th>
                      <td>{data.nutrition.proteinContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Sodium</th>
                      <td>{data.nutrition.sodiumContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Sugar</th>
                      <td>{data.nutrition.sugarContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Fat</th>
                      <td>{data.nutrition.fatContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Saturated Fat</th>
                      <td>{data.nutrition.saturatedFatContent ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>Unsaturated Fat</th>
                      <td>{data.nutrition.unsaturatedFatContent ?? "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card  bg-base-100  basis-2/3 mx-4 sm:mx-0">
          <div className="card-body">
            <h2 className="card-title">Clocks</h2>
            <div className="divider" />

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
            <button className="btn btn-secondary" onClick={handleAddTimer}>
              Add Timer
            </button>
          </div>
        </div>
      </div>

      <button
        className="btn btn-outline btn-error"
        onClick={() => onDelete(data)}
      >
        Delete
      </button>

      <details className="collapse bg-base-200">
        <summary className="collapse-title text-xl font-medium">Debug</summary>
        <div className="collapse-content">
          <p>{JSON.stringify(data)}</p>
        </div>
      </details>
    </div>
  );
}
