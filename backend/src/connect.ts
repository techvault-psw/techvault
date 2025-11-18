import mongoose from 'mongoose';

export const connectDatabase = async () => {
  await mongoose
    .connect(process.env.DB_URL || "mongodb://localhost:27017/techvault")
    .then(() => {
      console.log("🎲 Conectado ao banco!")
    }, (err) => {
      console.error(err)
    })
}
