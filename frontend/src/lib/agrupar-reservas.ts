import type { ReservaComTipo } from "@/pages/reservas";
import type { Reserva } from "@/redux/reservas/slice";
import { startOfDay } from "date-fns";

interface ReservasPorData {
  date: Date;
  reservas: ReservaComTipo[];
}

export function agruparReservasPorData(reservas: Reserva[]): ReservasPorData[] {
  const reservasComTipo: ReservaComTipo[] = []

  reservas.forEach(reserva => {
    if (!reserva.dataEntrega) {
      reservasComTipo.push({
        reserva,
        tipo: 'Entrega',
        hora: new Date(reserva.dataInicio)
      });
    }

    if (!reserva.dataColeta) {
      reservasComTipo.push({
        reserva,
        tipo: 'Coleta',
        hora: new Date(reserva.dataTermino)
      });
    }
  });

  const grupos = new Map<string, ReservaComTipo[]>();

  reservasComTipo.forEach(item => {
    const dataKey = startOfDay(item.hora).toISOString();
    if (!grupos.has(dataKey)) {
      grupos.set(dataKey, []);
    }
    grupos.get(dataKey)!.push(item);
  });

  const reservasPorData: ReservasPorData[] = Array.from(grupos.entries())
    .map(([dateKey, reservasGrupo]) => ({
      date: new Date(dateKey),
      reservas: reservasGrupo.sort((a, b) => a.hora.getTime() - b.hora.getTime())
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return reservasPorData;
}