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

