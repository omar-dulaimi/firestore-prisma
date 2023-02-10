#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import { Command } from 'commander';
import figlet from 'figlet';
import process from 'process';
import main from '../main.js';
import packageJson from '../package.json' assert { type: 'json' };
import { ProgramArgs } from '../types.js';

clear();
console.log(
  chalk.blue(
    figlet.textSync('firestore-prisma', {
      horizontalLayout: 'full',
      width: 120,
    }),
  ),
);

const program = new Command();

program
  .version(packageJson.version, '-v, --version')
  .description('Converts Firestore data file to a Prisma schema')
  .requiredOption('-f, --firestoreDataPath <value>', 'Firestore data file path')
  .option(
    '-j, --jsonSchemaPath <value>',
    'Json schema output file path',
    'schema.json',
  )
  .option(
    '-p, --prismaSchemaPath <value>',
    'Prisma schema output file path',
    'schema.prisma',
  )
  .parse(process.argv);

const options: ProgramArgs = program.opts();

main(options).catch((error) => {
  console.log('\n\n\r', chalk.red('Failed') + error + '\n\n');
});
