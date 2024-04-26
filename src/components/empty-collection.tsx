import useRecipeImport from "@/hooks/useRecipeImport";
import { useRecipeListStore } from "@/store/localStore";
import { useState } from "react";

export default function EmptyCollection() {
  const addRecipe = useRecipeListStore((state) => state.addRecipe);

  const [text, setText] = useState("");

  const [_handleRecipeImport, loading, error, setShowError] =
    useRecipeImport(addRecipe);

  const handleRecipeImport = async () => {
    _handleRecipeImport(text);
  };

  return (
    <>
      <div>
        <p className="text-lg font-bold">Add a recipe URL</p>
        <div className="join flex w-full flex-row">
          <input
            type="text"
            value={text}
            placeholder="https://"
            className="focus-ring input join-item input-bordered basis-4/5"
            onChange={(e) => setText(e.target.value)}
          />

          <button
            disabled={!text}
            className="btn btn-primary join-item basis-1/5"
            onClick={handleRecipeImport}
          >
            {loading && <span className="loading loading-spinner"></span>}
            Add
          </button>
        </div>
      </div>
      {error && (
        <div
          role="alert"
          className="alert alert-error"
          onClick={() => {
            setShowError(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error! Couldn&apos;t import recipe.</span>
        </div>
      )}
    </>
  );
}
