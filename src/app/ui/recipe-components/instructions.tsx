import { HowToLD, HowToSectionLD, RecipeLD } from "@/app/lib/types";
import he from "he";

type Props = {
  instructions: RecipeLD["recipeInstructions"];
  onAddTimer: (stepNumber: number, txt: string) => void;
};

const regexValue =
  /\b(\d+(?:\.\d+)?)(?:\s*)(min|mins|minute|minutes|hours|hour|days|day|weeks|week|months|month|years|year)\b/gm;

function InstructionBlock({
  value,
  step,
  onAddTimer,
}: {
  value: string;
  step: number;
  onAddTimer: (stepNumber: number, txt: string) => void;
}) {
  const matches = value.match(regexValue);
  return (
    <>
      <li className="cs-step">{he.decode(value as string)}</li>
      {matches && matches?.length > 0 && (
        <div className="flex flex-row gap-2 ml-12">
          {matches?.map((match, index) => (
            <span
              key={match + index}
              className="badge cursor-pointer"
              onClick={() => onAddTimer(step, match)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M11 8h2v6h-2zm4-7H9v2h6zm-3 19c-3.87 0-7-3.13-7-7s3.13-7 7-7s7 3.13 7 7c.7 0 1.36.13 2 .35V13c0-2.12-.74-4.07-1.97-5.61l1.42-1.42c-.45-.51-.9-.97-1.41-1.41L17.62 6c-1.55-1.26-3.5-2-5.62-2a9 9 0 0 0 0 18c.59 0 1.16-.06 1.71-.17c-.31-.58-.53-1.23-.63-1.92c-.36.05-.71.09-1.08.09m8-2v-3h-2v3h-3v2h3v3h2v-3h3v-2z"
                />
              </svg>
              {match}
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
      <ul className="steps cs-steps-vertical not-prose gap-2 md:gap-4">
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
      <ul className="steps cs-steps-vertical not-prose gap-2 md:gap-4">
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
    <div key={section.name} className="card bg-base-200 card-bordered glass">
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
