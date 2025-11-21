import mongoose from 'mongoose';

let isConnected = false;

export const connectDatabase = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.DB_URL!);
    isConnected = conn.connections[0].readyState === 1;
    console.log("🎲 Conectado ao banco!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao Mongo:", err);
    if (process.env.NODE_ENV === 'test') {
      throw err;
    }
    process.exit(1);
  }
}
