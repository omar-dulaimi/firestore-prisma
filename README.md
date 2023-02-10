# Firestore Prisma

[![npm version](https://badge.fury.io/js/firestore-prisma.svg)](https://badge.fury.io/js/firestore-prisma)
[![npm](https://img.shields.io/npm/dt/firestore-prisma.svg)](https://www.npmjs.com/package/firestore-prisma)
[![HitCount](https://hits.dwyl.com/omar-dulaimi/firestore-prisma.svg?style=flat)](http://hits.dwyl.com/omar-dulaimi/firestore-prisma)
[![npm](https://img.shields.io/npm/l/firestore-prisma.svg)](LICENSE)

Converts Firestore data file to a Prisma schema

<p align="center">
  <a href="https://www.buymeacoffee.com/omardulaimi">
    <img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" height="41" width="174">
  </a>
</p>

## Table of Contents

- [Firestore Prisma](#firestore-prisma)
  - [Table of Contents](#table-of-contents)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
  - [With npx](#with-npx)
  - [With npm](#with-npm)
- [Available Options](#available-options)

# Prerequisites

- Make sure to have the Firestore JSON file ready. You could use something like [node-firestore-import-export
](https://github.com/jloosli/node-firestore-import-export)

# Usage

- Don't forget to star this repo 😉

## With npx

```shell
npx firestore-prisma --firestoreDataPath firestore.json
```

## With npm

1- Install the library

- npm

```bash
 npm install -g firestore-prisma
```

or

- yarn

```bash
 yarn global add firestore-prisma
```

2- Execute command

```shell
firestore-prisma -f firestore.json -j schema.prisma
```

# Available Options

- `firestoreDataPath`: string - Firestore data file path

  - alias: `f`
  - required

- `jsonSchemaPath`: string - Json schema output file path

  - alias: `j`
  - optional
  - default: `schema.json`

- `prismaSchemaPath`: string - Prisma schema output file path

  - alias: `p`
  - optional
  - default: `schema.prisma`
