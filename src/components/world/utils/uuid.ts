import { userCarUUID } from '../types/car';

export const generateDynamicCarUUID = (carIndex: number): userCarUUID => {
  return `car-dynamic-${carIndex}`;
};

export const generateStaticCarUUID = (carIndex: number): userCarUUID => {
  return `car-static-${carIndex}`;
};
