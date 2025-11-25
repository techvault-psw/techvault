import fs from 'fs';
import path from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';

const globalConfigPath = path.join(__dirname, 'jest-mongodb-config.json');

export default async () => {
  const mongoServer = (globalThis as any).__MONGOMS__ as MongoMemoryServer;

  if (mongoServer) {
    await mongoServer.stop();
  }

  if (fs.existsSync(globalConfigPath)) {
    fs.unlinkSync(globalConfigPath);
  }
};
