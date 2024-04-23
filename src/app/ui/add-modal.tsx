import { useState } from "react";

type Props = {
  onImport: (url: string) => Promise<void>;
};

export default function AddModal(props: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    await props.onImport(text);
    (document.getElementById("add-modal") as HTMLDialogElement)?.close();
    setLoading(false);
  };

  const handleClose = () => {
    setText("");
  };

  return (
    <dialog id="add-modal" className="modal" onClose={handleClose}>
      <div className="modal-box w-8/12 max-w-4xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Add a recipe URL</h3>
        <div className="pt-2 flex flex-row gap-8">
          <input
            type="text"
            value={text}
            placeholder="https://"
            className="input input-bordered basis-4/5"
            onChange={(e) => setText(e.target.value)}
          />

          {loading ? (
            <button className="btn basis-1/5">
              <span className="loading loading-spinner"></span>
              loading
            </button>
          ) : (
            <button
              disabled={!text}
              className="btn btn-primary basis-1/5"
              onClick={handleImport}
            >
              Import
            </button>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
