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
  endTimerTimestamp: number
) {
  const totalTime = endTimerTimestamp - startTimerTimestamp;
  return (100 * durationLeft) / totalTime;
}

export default function Clock(props: Props) {
  const { name, startTimerTimestamp, endTimerTimestamp } = props;
  const [durationLeft, setDurationLeft] = useState(
    endTimerTimestamp - Date.now()
  );

  useEffect(() => {
    const timeOutId = setInterval(() => {
      if (endTimerTimestamp - Date.now() >= 0) {
        setDurationLeft(() => endTimerTimestamp - Date.now());
      } else {
        clearInterval(timeOutId);
      }
    }, 1000);

    return () => {
      clearInterval(timeOutId);
    };
  }, [endTimerTimestamp]);

  const value = convertDurationLeftToPercentage(
    durationLeft,
    startTimerTimestamp,
    endTimerTimestamp
  );

  const displayedValue = Duration.fromMillis(durationLeft).shiftTo(
    "minutes",
    "seconds"
  );

  return (
    <div className="flex flex-row gap-4 items-center">
      <div
        className="radial-progress"
        style={{
          "--value": value,
        }}
        role="progressbar"
      >
        {displayedValue.toFormat("mm:ss")}
      </div>
      {name}
    </div>
  );
}
