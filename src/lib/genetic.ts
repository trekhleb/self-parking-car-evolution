export type Gene = 0 | 1;

export type Genome = Gene[];

export type Population = Genome[];

export type PopulationOptions = {
  populationSize: number,
  genomeLength: number,
};

function generateGenome(length: number): Genome {
  return new Array(length)
    .fill(null)
    .map(() => (Math.random() < 0.5 ? 0 : 1));
}

function generatePopulation(options: PopulationOptions): Population {
  const { populationSize, genomeLength } = options;
  return new Array(populationSize)
    .fill(null)
    .map(() => generateGenome(genomeLength));
}

