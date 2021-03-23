import { useEffect, useState } from "react";
import dayjs from "dayjs";

const calculateTimeLeft = (originationTime?: string, votingPeriod?: number) => {
  if (votingPeriod && originationTime) {
    const current = dayjs().unix() - dayjs(originationTime).unix();
    const periodLeftPercentage = (current / votingPeriod) % 1;
    const timeLeftPercentage = votingPeriod * periodLeftPercentage;
    const time = votingPeriod - Number(timeLeftPercentage.toFixed());

    return { time: Number(time), current: Math.floor(current / votingPeriod) };
  }
};

export const useCycleInfo = (
  originationTime?: string,
  votingPeriod?: number
) => {
  const [timeLeft, setTimeLeft] = useState<{
    time: number;
    current: number;
  }>();

  useEffect(() => {
    const interval = setInterval(() => {
      const result = calculateTimeLeft(originationTime, votingPeriod);
      setTimeLeft(result);
    }, 1000);
    return () => clearInterval(interval);
  }, [originationTime, votingPeriod]);

  return timeLeft;
};
