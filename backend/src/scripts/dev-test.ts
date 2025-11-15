import { MongoMemoryServer } from 'mongodb-memory-server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);
export const URI_FILE = join(process.cwd(), '.mongo-test-uri');

export async function runSeed(mongoUri: string) {
  console.log('🌱 Executando seed...');
  await execAsync('npm run seed', { 
    cwd: process.cwd(),
    env: { ...process.env, DB_URL: mongoUri }
  });
  console.log('🎉 Seed completo!');
}

async function startDevTest() {
  let mongoServer: MongoMemoryServer | null = null;

  try {
    console.log('🚀 Iniciando MongoDB Memory Server...');
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log(`🎲 MongoDB rodando em: ${mongoUri}`);

    writeFileSync(URI_FILE, mongoUri);

    process.env.DB_URL = mongoUri;

    await runSeed(mongoUri);
    
    const nodemon = exec('npx nodemon src/server.ts', {
      cwd: process.cwd(),
      env: { ...process.env, DB_URL: mongoUri, PORT: '3000' }
    });

    nodemon.stdout?.pipe(process.stdout);
    nodemon.stderr?.pipe(process.stderr);

    process.on('SIGINT', async () => {
      console.log('\n🛑 Encerrando...');
      nodemon.kill();
      if (mongoServer) {
        await mongoServer.stop();
        console.log('💨 MongoDB Memory Server encerrado');
      }
      try {
        unlinkSync(URI_FILE);
      } catch {}
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erro:', error);
    if (mongoServer) {
      await mongoServer.stop();
    }
    process.exit(1);
  }
}

if (require.main === module) {
  startDevTest();
}
