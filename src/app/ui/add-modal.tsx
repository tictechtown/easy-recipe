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
    <dialog id="add-modal" className="prose modal" onClose={handleClose}>
      <div className="w-100 modal-box max-w-xl">
        <form method="dialog">
          <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="text-lg font-bold">Add a recipe URL</h3>
        <div className="join flex w-full flex-row">
          <input
            type="text"
            value={text}
            placeholder="https://"
            className={`input join-item input-bordered basis-4/5 ${
              showError && "input-error"
            }`}
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
        {showError && (
          <span className="text-sm font-bold text-error">
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
