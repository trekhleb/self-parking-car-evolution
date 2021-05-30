// @see: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent

type CarEvent = 'engineforward' | 'enginebackward' | 'engineneutral' | 'wheelsleft' | 'wheelsright' | 'wheelsstraight' | 'pressbreak' | 'releasebreak';

type CarEvents = Record<string, CarEvent>;

export const carEvents: CarEvents = {
  engineForward: 'engineforward',
  engineBackward: 'enginebackward',
  engineNeutral: 'engineneutral',
  wheelsLeft: 'wheelsleft',
  wheelsRight: 'wheelsright',
  wheelsStraight: 'wheelsstraight',
  pressBreak: 'pressbreak',
  releaseBreak: 'releasebreak',
};

export const trigger = (eventType: CarEvent, data: any = {}) => {
  const event = new CustomEvent(eventType, { detail: data });
  document.dispatchEvent(event);
};

export const on = (eventType: CarEvent, listener: (evt: Event) => void) => {
  document.addEventListener(eventType, listener);
};

export const off = (eventType: CarEvent, listener: (evt: Event) => void) => {
  document.removeEventListener(eventType, listener);
};
