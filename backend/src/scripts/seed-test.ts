import { readFileSync } from 'fs';
import { URI_FILE, runSeed } from './dev-test';

async function seedTest() {
  try {
    let mongoUri: string;
    
    try {
      mongoUri = readFileSync(URI_FILE, 'utf-8').trim();
    } catch {
      console.error('❌ Erro: dev:test não está rodando. Execute npm run dev:test primeiro.');
      process.exit(1);
    }

    await runSeed(mongoUri);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

seedTest();
