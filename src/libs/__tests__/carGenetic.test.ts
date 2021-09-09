import { SENSOR_DISTANCE_FALLBACK } from '../../components/world/car/constants';
import { decodeGenome, engineFormula, FormulaResult, SensorValues } from '../carGenetic';
import { Genome } from '../genetic';
import { genomeStringToGenome } from './../../components/evolution/utils/evolution';

describe('carGenetic', () => {
  it('should try to move forward when the rear car is close', () => {
    const rearSensorIndex = 4;

    // Rear (#4) sensor says the car is close.
    const na = SENSOR_DISTANCE_FALLBACK;
    const sensors: SensorValues = [
      na, na, na, na, na, na, na, na,
    ];
    sensors[rearSensorIndex] = 2.4

    const genome: Genome = genomeStringToGenome(
    // 0                   1                   2                   3                   4                   5
      '1 0 1 1 1 1 0 1 0 0 1 1 0 1 1 1 1 0 0 0 1 1 1 1 1 1 0 0 0 0 1 0 1 1 1 0 0 1 1 1 0 1 1 1 1 1 0 1 0 0 1 1 0 1 0 0 1 1 0 0 0 1 1 1 0 1 0 1 0 0 1 0 1 1 1 1 0 0 0 1 1 1 0 0 0 0 0 0 1 1 0 0 1 1 1 0 1 1 1 1 1 0 0 0 1 0 0 1 1 0 1 1 0 1 0 1 0 1 0 0 1 0 0 1 0 1 1 0 1 1 1 1 0 0 0 0 1 1 0 1 0 1 0 0 0 0 0 0 0 0 1 0 0 1 1 1 1 0 1 1 0 1 0 1 0 0 1 0 0 0 0 0 0 1 0 0 0 0 1 1'
    );

    const {engineFormulaCoefficients} = decodeGenome(genome);

    expect(engineFormulaCoefficients[rearSensorIndex]).toBe(416);

    const engineMode: FormulaResult = engineFormula(genome, sensors);

    // Move forward, away from the rear car.
    expect(engineMode).toBe(1);
  });
});

export {};
