import { weightedRandom } from '../probability';

describe('weightedRandom', () => {
  it('should correctly do random selection based on wights', () => {
    expect(weightedRandom([1, 2, 3], [10, 0, 0])).toEqual({index: 0, item: 1});
    expect(weightedRandom([1, 2, 3], [0, 10, 0])).toEqual({index: 1, item: 2});
    expect(weightedRandom([1, 2, 3], [0, 0, 10])).toEqual({index: 2, item: 3});
    expect(weightedRandom([1, 2, 3], [0, 10, 10])).not.toEqual({index: 0, item: 1});
    expect(weightedRandom([1, 2, 3], [10, 0, 10])).not.toEqual({index: 1, item: 2});

    const counter1: number[] = [];
    for (let i = 0; i < 1000; i += 1) {
      const randomItem = weightedRandom([0, 1, 2], [10, 30, 60]);
      if (!counter1[randomItem.index]) {
        counter1[randomItem.index] = 1;
      } else {
        counter1[randomItem.index] += 1;
      }
    }

    expect(counter1[0]).toBeGreaterThan(50);
    expect(counter1[0]).toBeLessThan(150);

    expect(counter1[1]).toBeGreaterThan(250);
    expect(counter1[1]).toBeLessThan(350);

    expect(counter1[2]).toBeGreaterThan(550);
    expect(counter1[2]).toBeLessThan(650);
  });
});

export {};
