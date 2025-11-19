const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

const globalConfigPath = path.join(__dirname, 'jest-mongodb-config.json');

module.exports = async () => {
  const instanceOptions = {};
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

  globalThis.__MONGOMS__ = mongoServer;
};

