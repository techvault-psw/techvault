import { existsSync, readFileSync } from 'fs';
import path from 'path';
import mongoose from 'mongoose';

let mongoUri: string;
let dbName: string;

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }

  const globalConfigPath = path.join(__dirname, '..', '..', 'jest-mongodb-config.json')
  if (!existsSync(globalConfigPath)) {
    throw new Error('MongoMemoryServer global config not found. Did globalSetup run?')
  }

  const configRaw = readFileSync(globalConfigPath, 'utf-8')
  const config = JSON.parse(configRaw) as { mongoUri: string }

  const workerId = process.env.JEST_WORKER_ID ?? '1'
  dbName = `test_${workerId}`

  const uri = new URL(config.mongoUri)
  uri.pathname = `/${dbName}`

  mongoUri = uri.toString()

  process.env.DB_URL = mongoUri

  await mongoose.connect(mongoUri, {
    dbName,
  })
}, 30000)

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
}, 30000)

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})
