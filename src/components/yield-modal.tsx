type Props = {
  onUpdate: (value: number) => void;
  onReset: () => void;
  value: number;
  showReset: boolean;
};

export default function YieldModal({
  value,
  onUpdate,
  showReset,
  onReset,
}: Props) {
  return (
    <dialog id="yield-modal" className="prose modal">
      <div className="w-100 modal-box max-w-xl">
        <form method="dialog">
          <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="mb-4 text-lg font-bold">Update Yield</h3>
        <div className="flex justify-end">{value}</div>
        <div className="flex w-full flex-row">
          <input
            type="range"
            min={1}
            max={100}
            value={value}
            className="range"
            onChange={(e) => onUpdate(+e.target.value)}
          />
        </div>
        <button
          className="btn btn-link mt-8"
          disabled={!showReset}
          onClick={onReset}
        >
          Reset
        </button>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </div>
    </dialog>
  );
}
