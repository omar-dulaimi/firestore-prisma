export declare interface ProgramArgs {
  firestoreDataPath: string;
  jsonSchemaPath: string;
  prismaSchemaPath: string;
}

export interface CollectionData {
  [key: string]: any;
}

export interface Collection {
  [key: string]: CollectionData | Collection;
}

export interface FirestoreData {
  __collections__: Collection;
}

export interface JsonSchema {
  [key: string]: any;
}
