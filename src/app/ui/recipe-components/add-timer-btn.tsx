import { Duration } from "luxon";
import { useState } from "react";

type Props = {
  onClick: (timerName: string, durationInMS: number) => void;
};

export default function AddTimerButton({ onClick }: Props) {
  const [timerName, setTimerName] = useState("");
  const [duration, setDuration] = useState("00:00");

  const isValid = timerName !== "" && Duration.fromISOTime(duration).isValid;

  const handleOnClick = () => {
    if (isValid) {
      onClick(timerName, Duration.fromISOTime(duration).toMillis());
      setTimerName("");
      setDuration("00:00");
    }
  };

  return (
    <div className="join join-vertical md:join-horizontal">
      <input
        className="input input-bordered join-item "
        placeholder="Timer name"
        type="text"
        value={timerName}
        onChange={(e) => setTimerName(e.target.value)}
      />
      <input
        className="input input-bordered join-item w-auto "
        type="text"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <button
        className="btn btn-secondary join-item"
        onClick={handleOnClick}
        disabled={!isValid}
      >
        Add Timer
      </button>
    </div>
  );
}
