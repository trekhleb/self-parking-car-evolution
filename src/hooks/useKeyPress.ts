import { useCallback, useEffect, useState } from 'react';

export function useKeyPress(target: string[]): boolean {
  const [keyPressed, setKeyPressed] = useState(false)

  const downHandler = ({ key }: KeyboardEvent) => {
    if (target.includes(key)) {
      setKeyPressed(true);
    }
  };

  const downHandlerCallback = useCallback(downHandler, [target]);

  const upHandler = ({ key }: KeyboardEvent) => {
    if (target.includes(key)) {
      setKeyPressed(false);
    }
  };

  const upHandlerCallback = useCallback(upHandler, [target]);

  useEffect(() => {
    window.addEventListener('keydown', downHandlerCallback)
    window.addEventListener('keyup', upHandlerCallback)
    return () => {
      window.removeEventListener('keydown', downHandlerCallback)
      window.removeEventListener('keyup', upHandlerCallback)
    }
  }, [upHandlerCallback, downHandlerCallback]);

  return keyPressed;
}
