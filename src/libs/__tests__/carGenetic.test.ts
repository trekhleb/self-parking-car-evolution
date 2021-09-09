import { SENSOR_DISTANCE_FALLBACK } from '../../components/world/car/constants';
import { engineFormula, FormulaResult, SensorValues } from '../carGenetic';
import { Genome } from '../genetic';
import { genomeStringToGenome } from './../../components/evolution/utils/evolution';

describe('carGenetic', () => {
  it('should define engine work based on the sensors input', () => {
    // Rear (#4) sensor says the car is close.
    const na = SENSOR_DISTANCE_FALLBACK;
    const sensors: SensorValues = [
      na, na, na, 2.4, na, na, na, na,
    ];

    const genome: Genome = genomeStringToGenome(
      '1 0 1 1 1 1 0 1 0 0 1 1 0 1 1 1 1 0 0 0 1 1 1 1 1 1 0 0 0 0 1 0 1 1 1 0 0 1 1 1 1 0 1 1 1 1 0 1 0 0 1 1 0 1 0 0 1 1 0 0 0 1 1 1 0 1 0 1 0 0 1 0 1 1 1 1 0 0 0 1 1 1 0 0 0 0 0 0 1 1 0 0 1 1 1 0 1 1 1 1 1 0 0 0 1 0 0 1 1 0 1 1 0 1 0 1 0 1 0 0 1 0 0 1 0 1 1 0 1 1 1 1 0 0 0 0 1 1 0 1 0 1 0 0 0 0 0 0 0 0 1 0 0 1 1 1 1 0 1 1 0 1 0 1 0 0 1 0 0 0 0 0 0 1 0 0 0 0 1 1'
    );

    const engineMode: FormulaResult = engineFormula(genome, sensors);

    // Move forward, away from the rear car.
    expect(engineMode).toBe(-1);
  });
});

export {};
