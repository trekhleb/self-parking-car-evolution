import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Label1 } from 'baseui/typography';
import { Block } from 'baseui/block';

import './Timer.css';

type TimeMs = number;

type TimerProps = {
  timout?: TimeMs,
  interval?: TimeMs,
  version?: string,
}

function Timer(props: TimerProps) {
  const {timout = null, interval = 1000, version = ''} = props;

  const [timePassed, setTimePassed] = useState<number>(0);
  const timePassedRef = useRef<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const onInterval = () => {
    timePassedRef.current += interval;
    setTimePassed(timePassedRef.current);
  };

  const onIntervalCallback = useCallback(onInterval, [timout, interval]);

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

  const formattedTime = timout !== null
    ? formatTime(timout - timePassed)
    : formatTime(timePassed);

  return (
    <Block display="flex" flexDirection="row" alignItems="flex-end">
      <Block marginRight="5px">
        <div className="timer-loader" />
      </Block>
      <Label1>
        <b>{formattedTime}</b>s
      </Label1>
    </Block>
  );
}

function formatTime(timeMs: TimeMs): string {
  const timeS = Math.max(Math.floor(timeMs / 1000), 0);
  return `${timeS}`;
}

export default Timer;
