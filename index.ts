import { buildPrismaSchema } from './helpers.js';

export default async function index(firestoreDataText: string) {
  const outputPrismaSchema = await buildPrismaSchema(
    null,
    'memory',
    firestoreDataText,
  );
  return outputPrismaSchema;
}
