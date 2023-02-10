import { createPrismaSchemaBuilder } from '@mrleebo/prisma-ast';
import chalk from 'chalk';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import { FirestoreData, JsonSchema, ProgramArgs } from './types';

const COLLECTIONS_KEY = '__collections__';
const jsonDataTypeMapping = {
  timestamp: 'DateTime',
  geopoint: 'Json',
};

const determineDataType = (value: any): string => {
  switch (typeof value) {
    case 'string':
      return 'String';
    case 'number':
      return Number.isInteger(value) ? 'Int' : 'Float';
    case 'boolean':
      return 'Boolean';
    case 'object':
      if (value === null) {
        return 'Json';
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return 'Json';
        }

        const itemTypes = new Set(value.map((item) => determineDataType(item)));

        if (itemTypes.size === 1) {
          return `${Array.from(itemTypes)[0]}[]`;
        }

        return 'Json';
      }

      //@ts-ignore
      return jsonDataTypeMapping[value.__datatype__] || 'Json';
    default:
      return 'Unknown';
  }
};

const buildJsonSchema = (data: FirestoreData, result: JsonSchema = {}): any => {
  const spinner = ora('   JSON Schema');
  spinner.color = 'yellow';
  spinner.prefixText = chalk.yellow('build');
  spinner.start();
  const { [COLLECTIONS_KEY]: collections = {} } = data;

  Object.entries(collections).forEach(([collName, collValue]) => {
    if (!result[collName]) {
      result[collName] = {};
    }
    Object.entries(collValue).forEach(([, collFieldValue]) => {
      if (!Array.isArray(collFieldValue)) {
        buildJsonSchemaForField({ collName, collFieldValue, result });
      }
    });
  });

  spinner.stopAndPersist();
  return result;
};

const buildJsonSchemaForField = ({
  collName,
  collFieldValue,
  result,
}: {
  collName: string;
  collFieldValue: any;
  result: JsonSchema;
}) => {
  for (const [key, value] of Object.entries(collFieldValue)) {
    switch (key) {
      case COLLECTIONS_KEY:
        const foundRelationsTo = Object.keys(value);
        if (foundRelationsTo.length > 0) {
          result[collName]['$relationsTo'] = foundRelationsTo;
          foundRelationsTo.forEach((item) => {
            if (!result[item]) {
              result[item] = { $relationsFrom: [] };
            }
            if (!result[item]['$relationsFrom'].includes(collName)) {
              result[item]['$relationsFrom'].push(collName);
            }
          });
        }
        // @ts-ignore
        buildJsonSchema({ [COLLECTIONS_KEY]: value }, result);
        break;
      default:
        const type = determineDataType(value);
        if (type !== 'Unknown') {
          result[collName][key] = {
            type,
          };
        }
    }
  }
};

export const buildPrismaSchema = async (options: ProgramArgs) => {
  let spinner = ora('Prisma Schema');
  spinner.color = 'green';
  spinner.prefixText = chalk.cyan('generate');
  spinner.start();
  try {
    const firestoreData: FirestoreData = JSON.parse(
      await fs.promises.readFile(
        path.join(process.cwd(), options.firestoreDataPath),
        {
          encoding: 'utf-8',
        },
      ),
    );

    const builder = createPrismaSchemaBuilder();
    builder.generator('client', 'prisma-client-js');
    builder.datasource('"postgresql"', '');
    const jsonSchema = buildJsonSchema(firestoreData);
    await fs.promises.writeFile(
      path.join(process.cwd(), options.jsonSchemaPath),
      JSON.stringify(jsonSchema, null, 2),
    );

    for (const [collName, collValue] of Object.entries(jsonSchema)) {
      builder.model(collName).field('id', 'String').attribute('id');
      for (const [collFieldKey, collFieldValue] of Object.entries(collValue)) {
        if (collFieldKey === '$relationsTo' && collFieldValue.length > 0) {
          collFieldValue.forEach((item: string) => {
            builder.model(collName).field(item, `${item}[]`);
          });
        } else if (
          collFieldKey === '$relationsFrom' &&
          collFieldValue.length > 0
        ) {
          collFieldValue.forEach((item: string) => {
            builder
              .model(collName)
              .field(item, `${item}?`)
              .attribute('relation', {
                fields: [`${item}Id`],
                references: ['id'],
              });
            builder.model(collName).field(`${item}Id`, 'String');
          });
        } else {
          builder.model(collName).field(collFieldKey, collFieldValue.type);
        }
      }
    }

    const output = builder.print();

    await fs.promises.writeFile(
      path.join(process.cwd(), options.prismaSchemaPath),
      output,
    );
  } catch (error) {
    console.error(error);
  }

  spinner.stopAndPersist();
};
