import { buildPrismaSchema } from './helpers.js';
import { ProgramArgs } from './types.js';

export default async function main(options: ProgramArgs) {
  await buildPrismaSchema(options);
}
