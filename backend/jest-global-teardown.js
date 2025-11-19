const fs = require('fs');
const path = require('path');

const globalConfigPath = path.join(__dirname, 'jest-mongodb-config.json');

module.exports = async () => {
  const mongoServer = globalThis.__MONGOMS__;

  if (mongoServer) {
    await mongoServer.stop();
  }

  if (fs.existsSync(globalConfigPath)) {
    fs.unlinkSync(globalConfigPath);
  }
};

