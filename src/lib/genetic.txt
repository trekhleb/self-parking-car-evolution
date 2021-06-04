type Gene = 0 | 1;

type Genome = Gene[];

type Population = Genome[];

function generateGenome(length: number): Genome {
  return new Array(length)
    .fill(null)
    .map(() => (Math.random() < 0.5 ? 0 : 1));
}


type PopulationOptions = {
  populationSize: number,
  genomeLength: number,
};

function generatePopulation(options: PopulationOptions): Population {
  const { populationSize, genomeLength } = options;
  return new Array(populationSize)
    .fill(null)
    .map(() => generateGenome(genomeLength));
}

