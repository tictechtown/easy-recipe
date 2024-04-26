import { isTimerValid } from "@/lib/utils";
import { Duration } from "luxon";
import { useState } from "react";

type Props = {
  onClick: (timerName: string, durationInMS: number) => void;
};

export default function AddTimerButton({ onClick }: Props) {
  const [timerName, setTimerName] = useState("");
  const [duration, setDuration] = useState("00:00");

  const isValid = isTimerValid(timerName, duration);

  const handleOnClick = () => {
    if (isValid) {
      onClick(timerName, Duration.fromISOTime(duration).toMillis());
      setTimerName("");
      setDuration("00:00");
    }
  };

  return (
    <div>
      <button
        className="btn btn-link"
        onClick={() =>
          (
            document.getElementById("add_timer_modal") as HTMLDialogElement
          ).showModal()
        }
      >
        Add Timer
      </button>
      <dialog
        id="add_timer_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex flex-col gap-2">
            <label>Timer Name</label>
            <input
              className="focus-ring w-100 input  input-bordered"
              placeholder="Step 1"
              type="text"
              value={timerName}
              onChange={(e) => setTimerName(e.target.value)}
            />
            <label>Timer Duration (hh:mm)</label>
            <input
              className="focus-ring input  input-bordered w-24 font-mono"
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />

            <button
              className="btn btn-primary mt-4"
              onClick={handleOnClick}
              disabled={!isValid}
            >
              Add Timer
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
