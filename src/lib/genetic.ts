export type Gene = 0 | 1;

export type Genome = Gene[];

export type Population = Genome[];

export type PopulationParams = {
  populationSize: number,
  genomeLength: number,
};

function createGenome(length: number): Genome {
  return new Array(length)
    .fill(null)
    .map(() => (Math.random() < 0.5 ? 0 : 1));
}

export function createPopulation(params: PopulationParams): Population {
  const { populationSize, genomeLength } = params;
  return new Array(populationSize)
    .fill(null)
    .map(() => createGenome(genomeLength));
}

