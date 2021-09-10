import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Label1 } from 'baseui/typography';
import { Block } from 'baseui/block';

import './Timer.css';

type TimeMs = number;

type TimerProps = {
  timeout?: TimeMs,
  interval?: TimeMs,
  version?: string,
}

function Timer(props: TimerProps) {
  const {timeout = null, interval = 1000, version = ''} = props;

  const [timePassed, setTimePassed] = useState<number>(0);
  const timePassedRef = useRef<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const reversedTime = timeout !== null;

  const onInterval = () => {
    timePassedRef.current += interval;
    setTimePassed(timePassedRef.current);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onIntervalCallback = useCallback(onInterval, [timeout, interval]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timePassedRef.current = 0;
    setTimePassed(0);
    timerRef.current = setInterval(onIntervalCallback, interval);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [onIntervalCallback, interval, version]);

  const formattedTime = timeout !== null
    ? formatTime(timeout - timePassed)
    : formatTime(timePassed);

  return (
    <Block display="flex" flexDirection="row" alignItems="flex-end">
      <Block marginRight="5px">
        <div className={reversedTime ? 'timer-loader-reverse' : 'timer-loader'} />
      </Block>
      <Label1>
        <b><code>{formattedTime}</code></b>
      </Label1>
    </Block>
  );
}

function formatTime(timeMs: TimeMs): string {
  let timeSec = Math.max(Math.floor(timeMs / 1000), 0);
  let secPrefix = '';
  if (timeSec < 60) {
    secPrefix = timeSec < 10 ? '0' : '';
    return `${secPrefix}${timeSec}s`;
  }
  const timeMin = Math.floor(timeSec / 60);
  timeSec = timeSec % 60;
  secPrefix = timeSec < 10 ? '0' : '';
  return `${timeMin}m${secPrefix}${timeSec}s`;
}

export default Timer;
