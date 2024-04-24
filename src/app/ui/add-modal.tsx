import { useState } from "react";

type Props = {
  onImport: (url: string) => Promise<boolean>;
};

export default function AddModal(props: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleRecipeImport = async () => {
    setLoading(true);
    setShowError(false);
    try {
      const res = await props.onImport(text);
      if (res) {
        (document.getElementById("add-modal") as HTMLDialogElement)?.close();
      } else {
        setShowError(true);
      }
      setLoading(false);
      setText("");
    } catch (e) {
      // error
      setLoading(false);
      setText("");
      setShowError(true);
    }
  };

  const handleClose = () => {
    setText("");
    setLoading(false);
    setShowError(false);
  };

  return (
    <dialog id="add-modal" className="modal prose" onClose={handleClose}>
      <div className="modal-box w-100 max-w-xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Add a recipe URL</h3>
        <div className="join flex flex-row w-full">
          <input
            type="text"
            value={text}
            placeholder="https://"
            className={`join-item input input-bordered basis-4/5 ${
              showError && "input-error"
            }`}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            disabled={!text}
            className="join-item btn btn-primary basis-1/5"
            onClick={handleRecipeImport}
          >
            {loading && <span className="loading loading-spinner"></span>}
            Add
          </button>
        </div>
        {showError && (
          <span className="font-bold text-sm text-error">
            Error importing the recipe
          </span>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
