import { HowToLD, HowToSectionLD, RecipeLD } from "@/types";
import he from "he";
import { useState } from "react";

type Props = {
  instructions: RecipeLD["recipeInstructions"];
  onAddTimer: (stepNumber: number, txt: string) => void;
};

const regexValue =
  /\b(\d+(?:\.\d+)?)(?:\s*)(min|mins|minute|minutes|hours|hour|days|day|weeks|week)\b/gm;

function formatDecodedText(
  text: string,
  matches: RegExpMatchArray | null,
): string | (string | JSX.Element)[] {
  if (!matches || matches.length === 0) {
    return text;
  }

  let output = [];
  let rightText = text;
  for (const m of matches) {
    if (rightText.includes(m)) {
      const [left, right] = rightText.split(m);

      output.push(left);
      output.push(<strong>{m}</strong>);
      rightText = right;
    }
  }

  if (rightText.length) {
    output.push(rightText);
  }

  return output;
}

function InstructionBlock({
  value,
  step,
  onAddTimer,
}: {
  value: string;
  step: number;
  onAddTimer: (stepNumber: number, txt: string) => void;
}) {
  const [isCompleted, setIsCompleted] = useState(false);
  const handleIsCompleted = () => {
    setIsCompleted((prev) => !prev);
  };

  const decodedText = he.decode(value as string);

  const matches = decodedText.match(regexValue);
  return (
    <>
      <li
        className={`cs-step rounded hover:bg-base-300 ${isCompleted && "opacity-30"} cursor-pointer`}
        onClick={handleIsCompleted}
      >
        <span>{formatDecodedText(decodedText, matches)}</span>
      </li>
      {matches && matches?.length > 0 && (
        <div className="ml-12 flex flex-row flex-wrap gap-2">
          {matches?.map((match, index) => (
            <span
              key={match + index}
              className="badge-base-300 badge cursor-pointer shadow"
              onClick={() => onAddTimer(step, match)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-4 w-4"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M11 8h2v6h-2zm4-7H9v2h6zm-3 19c-3.87 0-7-3.13-7-7s3.13-7 7-7s7 3.13 7 7c.7 0 1.36.13 2 .35V13c0-2.12-.74-4.07-1.97-5.61l1.42-1.42c-.45-.51-.9-.97-1.41-1.41L17.62 6c-1.55-1.26-3.5-2-5.62-2a9 9 0 0 0 0 18c.59 0 1.16-.06 1.71-.17c-.31-.58-.53-1.23-.63-1.92c-.36.05-.71.09-1.08.09m8-2v-3h-2v3h-3v2h3v3h2v-3h3v-2z"
                />
              </svg>
              {match
                .replace("minutes", "m")
                .replace("minute", "m")
                .replace("weeks", "w")
                .replace("week", "w")
                .replace("days", "d")
                .replace("day", "d")
                .replace("hours", "h")
                .replace("hour", "h")}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

export default function RecipeInstructions({
  instructions,
  onAddTimer,
}: Props) {
  if (!instructions || instructions.length === 0) {
    return null;
  }

  if (typeof instructions[0] === "string") {
    return (
      <ul className="cs-steps-vertical not-prose steps gap-2 md:gap-4">
        {instructions.map((rI, index) => (
          <InstructionBlock
            key={index}
            value={rI as string}
            step={index}
            onAddTimer={onAddTimer}
          />
        ))}
      </ul>
    );
  }

  if (instructions[0]["@type"] === "HowToStep") {
    return (
      <ul className="cs-steps-vertical not-prose steps gap-2 md:gap-4">
        {instructions.map((rI, index) => (
          <InstructionBlock
            key={index}
            value={(rI as HowToLD).text}
            step={index}
            onAddTimer={onAddTimer}
          />
        ))}
      </ul>
    );
  }

  return (instructions as HowToSectionLD[]).map((section: HowToSectionLD) => (
    <div key={section.name} className="card glass card-bordered bg-base-200">
      <div className="card-body">
        <h6 className="card-title pb-4">{section.name}</h6>
        <RecipeInstructions
          instructions={section.itemListElement}
          onAddTimer={onAddTimer}
        />
      </div>
    </div>
  ));
}
