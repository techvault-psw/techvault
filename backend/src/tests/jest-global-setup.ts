import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';

const globalConfigPath = path.join(__dirname, 'jest-mongodb-config.json');

export default async () => {
  const instanceOptions: any = {};
  const storageEngine = process.env.MONGOMS_STORAGE_ENGINE;

  if (storageEngine) {
    instanceOptions.storageEngine = storageEngine;
  }

  const options = Object.keys(instanceOptions).length ? { instance: instanceOptions } : {};

  const mongoServer = await MongoMemoryServer.create(options);

  const mongoUri = mongoServer.getUri();
  const config = {
    mongoUri,
    tmpDir: mongoServer.instanceInfo?.dbPath,
  };

  fs.writeFileSync(globalConfigPath, JSON.stringify(config));

  (globalThis as any).__MONGOMS__ = mongoServer;
};
