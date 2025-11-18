import 'dotenv/config'
import bcrypt from "bcrypt";
import mongoose from 'mongoose';
import { clientes, enderecos, pacotes, reservas, feedbacks } from '../consts/db-mock';

import { clientes as ClienteModel } from '../models/cliente';
import { enderecos as EnderecoModel } from '../models/endereco';
import { pacotes as PacoteModel } from '../models/pacote';
import { reservas as ReservaModel } from '../models/reserva';
import { feedbacks as FeedbackModel } from '../models/feedback';

async function seed() {
  try {
    await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/techvault');
    console.log('🔗 Conectado ao MongoDB');

    await ClienteModel.collection.drop().catch(() => {});
    await EnderecoModel.collection.drop().catch(() => {});
    await PacoteModel.collection.drop().catch(() => {});
    await ReservaModel.collection.drop().catch(() => {});
    await FeedbackModel.collection.drop().catch(() => {});

    const clienteDocs = await Promise.all(clientes.map(async ({ id, password, ...cliente }) => {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      return {
        _id: id,
        password: passwordHash,
        ...cliente,
      }
    }))
    await ClienteModel.insertMany(clienteDocs);
    console.log('👥 Clientes inseridos');

    const enderecoDocs = enderecos.map(({ id, ...endereco }) => ({
      _id: id,
      ...endereco,
    }));
    await EnderecoModel.insertMany(enderecoDocs);
    console.log('🏠 Enderecos inseridos');

    const pacoteDocs = pacotes.map(({ id, ...pacote }) => ({
      _id: id,
      ...pacote,
    }));
     await PacoteModel.insertMany(pacoteDocs);
     console.log('📦 Pacotes inseridos');

    const reservaDocs = reservas.map(({ id, ...reserva }) => ({
      _id: id,
      ...reserva,
    }));
    await ReservaModel.insertMany(reservaDocs);
    console.log('📅 Reservas inseridas');

    const feedbackDocs = feedbacks.map(({ id, ...feedback }) => ({
      _id: id,
      ...feedback,
    }));
    await FeedbackModel.insertMany(feedbackDocs);
    console.log('💬 Feedbacks inseridos');

    console.log('🌱 Seed no banco de dados completo!');
  } catch (error) {
    console.error('❌ Erro na seed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('💨 Desconectado do MongoDB');
  }
}

seed();
