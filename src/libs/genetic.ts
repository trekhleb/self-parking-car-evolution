import { weightedRandom } from './math/probability';

export type Gene = 0 | 1;

export type Genome = Gene[];

export type Generation = Genome[];

export type GenerationParams = {
  generationSize: number,
  genomeLength: number,
};

function createGenome(length: number): Genome {
  return new Array(length)
    .fill(null)
    .map(() => (Math.random() < 0.5 ? 0 : 1));
}

export function createGeneration(params: GenerationParams): Generation {
  const { generationSize, genomeLength } = params;
  return new Array(generationSize)
    .fill(null)
    .map(() => createGenome(genomeLength));
}

// The number between 0 and 1.
export type Probability = number;

// The number between 0 and 100.
export type Percentage = number;

// @see: https://en.wikipedia.org/wiki/Mutation_(genetic_algorithm)
function mutate(genome: Genome, mutationProbability: Probability): Genome {
  // Conceive children.
  for (let geneIndex = 0; geneIndex < genome.length; geneIndex += 1) {
    const gene: Gene = genome[geneIndex];
    const mutatedGene: Gene = gene === 0 ? 1 : 0;
    genome[geneIndex] = Math.random() < mutationProbability ? mutatedGene : gene;
  }
  return genome;
}

type SelectionOptions = {
  mutationProbability: Probability,
  longLivingChampionsPercentage: Percentage,
};

// Performs Uniform Crossover: each bit is chosen from either parent with equal probability.
// @see: https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)
function mate(
  father: Genome,
  mother: Genome,
  mutationProbability: Probability,
): [Genome, Genome] {
  if (father.length !== mother.length) {
    throw new Error('Cannot mate different species');
  }

  const firstChild: Genome = [];
  const secondChild: Genome = [];

  // Conceive children.
  for (let geneIndex = 0; geneIndex < father.length; geneIndex += 1) {
    firstChild.push(
      Math.random() < 0.5 ? father[geneIndex] : mother[geneIndex]
    );
    secondChild.push(
      Math.random() < 0.5 ? father[geneIndex] : mother[geneIndex]
    );
  }

  return [
    mutate(firstChild, mutationProbability),
    mutate(secondChild, mutationProbability),
  ];
}

export type FitnessFunction = (genome: Genome) => number;

// @see: https://en.wikipedia.org/wiki/Selection_(genetic_algorithm)
export function select(
  generation: Generation,
  fitness: FitnessFunction,
  options: SelectionOptions,
) {
  const {
    mutationProbability,
    longLivingChampionsPercentage,
  } = options;

  const newGeneration: Generation = [];

  const oldGeneration = [...generation];
  // First one - the fittest one.
  oldGeneration.sort((genomeA: Genome, genomeB: Genome): number => {
    const fitnessA = fitness(genomeA);
    const fitnessB = fitness(genomeB);
    if (fitnessA < fitnessB) {
      return 1;
    }
    if (fitnessA > fitnessB) {
      return -1;
    }
    return 0;
  });

  // Let long-liver champions continue living in the new generation.
  const longLiversCount = Math.floor(longLivingChampionsPercentage * oldGeneration.length / 100);
  if (longLiversCount) {
    oldGeneration.slice(0, longLiversCount).forEach((longLivingGenome: Genome) => {
      newGeneration.push(longLivingGenome);
    });
  }

  // Get the data about he fitness of each individuum.
  const fitnessPerOldGenome: number[] = oldGeneration.map((genome: Genome) => fitness(genome));

  // Populate the next generation until it becomes the same size as a old generation.
  while (newGeneration.length < generation.length) {
    // Select random father and mother from the population.
    // The fittest individuums have higher chances to be selected.
    let father: Genome | null = null;
    let fatherGenomeIndex: number | null = null;
    let mother: Genome | null = null;
    let matherGenomeIndex: number | null = null;

    // To produce children the father and mother need each other.
    // It must be two different individuums.
    while (!father || !mother || fatherGenomeIndex === matherGenomeIndex) {
      const {
        item: randomFather,
        index: randomFatherGenomeIndex,
      } = weightedRandom<Genome>(generation, fitnessPerOldGenome);

      const {
        item: randomMother,
        index: randomMotherGenomeIndex,
      } = weightedRandom<Genome>(generation, fitnessPerOldGenome);

      father = randomFather;
      fatherGenomeIndex = randomFatherGenomeIndex;

      mother = randomMother;
      matherGenomeIndex = randomMotherGenomeIndex;
    }

    // Let father and mother produce two children.
    const [firstChild, secondChild] = mate(father, mother, mutationProbability);

    newGeneration.push(firstChild);

    // Depending on the number of long-living champions it is possible that
    // there will be the place for only one child, sorry.
    if (newGeneration.length < generation.length) {
      newGeneration.push(secondChild);
    }
  }

  return newGeneration;
}
