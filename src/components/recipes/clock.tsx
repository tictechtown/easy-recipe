import { Duration } from "luxon";
import { useEffect, useState } from "react";

type Props = {
  name: string;
  startTimerTimestamp: number;
  endTimerTimestamp: number;
};

function convertDurationLeftToPercentage(
  durationLeft: number,
  startTimerTimestamp: number,
  endTimerTimestamp: number,
) {
  const totalTime = endTimerTimestamp - startTimerTimestamp;
  return (100 * durationLeft) / totalTime;
}

export default function Clock(props: Props) {
  const { name, startTimerTimestamp, endTimerTimestamp } = props;
  const [durationLeft, setDurationLeft] = useState(
    endTimerTimestamp - Date.now(),
  );

  useEffect(() => {
    const timeOutId = setInterval(() => {
      if (endTimerTimestamp - Date.now() >= 0) {
        setDurationLeft(endTimerTimestamp - Date.now());
      } else {
        setDurationLeft(0);
        clearInterval(timeOutId);
      }
    }, 250);

    return () => {
      clearInterval(timeOutId);
    };
  }, [endTimerTimestamp]);

  const value = convertDurationLeftToPercentage(
    durationLeft,
    startTimerTimestamp,
    endTimerTimestamp,
  );

  const displayedValue = Duration.fromMillis(durationLeft).shiftTo(
    "minutes",
    "seconds",
  );

  return (
    <div className="prose bordered flex flex-row items-center gap-4 rounded-xl bg-base-100 shadow">
      <div className="rounded-l-xl bg-base-300 p-4 font-mono text-primary">
        {displayedValue.toFormat("mm:ss")}
      </div>
      <div className="rounded-r-xl">{name}</div>
    </div>
  );
}
