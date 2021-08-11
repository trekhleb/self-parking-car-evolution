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

type MateOptions = {
  mutationProbability?: Probability,
};

// Performs Uniform Crossover: each bit is chosen from either parent with equal probability.
// @see: https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)
function mate(father: Genome, mother: Genome, options?: MateOptions): [Genome, Genome] {
  const {
    mutationProbability = 0.2
  } = options || {};

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
  options?: MateOptions,
) {
  const newGeneration: Generation = [];

  const sortedGeneration = [...generation];
  // First one - the fittest one.
  sortedGeneration.sort((genomeA: Genome, genomeB: Genome): number => {
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

  const fitnessPerGenome: number[] = generation.map((genome: Genome) => fitness(genome));
  const father: Genome = weightedRandom<Genome>(generation, fitnessPerGenome);
  const mother: Genome = weightedRandom<Genome>(generation, fitnessPerGenome);

  return [...generation];

  // @TODO: Mate best genomes. Preserve two best genomes.
  // return newGeneration;
}
