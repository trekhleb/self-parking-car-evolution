import { userCarUUID } from '../types/car';

export const generateStaticCarUUID = (carIndex: number): userCarUUID => {
  return `car-static-${carIndex}`;
};
