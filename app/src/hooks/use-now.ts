import * as React from "react";

const useNow = (interval = 1000): [Date] => {
  const [time, setTime] = React.useState<Date>(new Date());
  const updateTime = (): void => setTime(new Date());

  React.useEffect(() => {
    const _timer = setInterval(updateTime, interval);
    return (): void => clearInterval(_timer);
  }, [interval]);

  return [time];
};

export { useNow };
