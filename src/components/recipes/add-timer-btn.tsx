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
    <div className="join join-horizontal">
      <input
        className="focus-ring w-100 input join-item input-bordered"
        placeholder="Timer name"
        type="text"
        value={timerName}
        onChange={(e) => setTimerName(e.target.value)}
      />
      <input
        className="focus-ring input join-item input-bordered w-24 font-mono"
        type="text"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <button
        className="btn btn-primary join-item"
        onClick={handleOnClick}
        disabled={!isValid}
      >
        Add Timer
      </button>
    </div>
  );
}
