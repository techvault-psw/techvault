import { EmitirRelatorioReservasDialog } from "@/components/dialogs/emitir-relatorio-reservas-dialog";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ComponentType, ReactNode } from "react";
import { Link } from "react-router";

type DashboardCard = {
  title: string
  description: string
  url?: string
  dialog?: ComponentType<{ children: ReactNode }>
  role?: 'gerente' | 'suporte'
}

const dashboardCards: Record<string, DashboardCard[]> = {
  "Páginas Públicas": [
    {
      url: '/',
      title: 'Home',
      description: 'Visualizar a página principal do sistema',
    },
    {
      url: '/pacotes-disponiveis',
      title: 'Pacotes Disponíveis',
      description: 'Visualizar todos os pacotes atualmente disponíveis para reserva',
    },
    {
      url: '/feedbacks',
      title: 'Feedbacks',
      description: 'Visualizar todos os feedbacks enviados pelos clientes',
    },
  ],
  "Painel de Controle": [
    {
      url: '/reservas',
      title: 'Gerenciar Reservas',
      description: 'Gerenciar reservas atualmente vigentes e passadas',
    },
    {
      url: '/pacotes',
      title: 'Gerenciar Pacotes',
      description: 'Gerenciar os pacotes oferecidos pelo negócio',
      role: 'gerente',
    },
    {
      url: '/clientes',
      title: 'Gerenciar Clientes',
      description: 'Gerenciar todos os clientes atualmente cadastrados no sistema',
      role: 'gerente',
    },
  ],
  "Relatórios ": [
    {
      dialog: EmitirRelatorioReservasDialog,
      title: 'Emitir relatório de reservas',
      description:
        'Emitir e visualizar um relatório com todas as reservas feitas em determinado período',
      role: 'gerente',
    },
    {
      dialog: undefined, // por enquanto
      title: 'Emitir relatório financeiro',
      description:
        'Emitir e visualizar um relatório financeiro de um determinado período',
      role: 'gerente',
    },
  ],
}

export default function DashboardPage() {
  return (
    <PageContainer.Card>
      <PageTitle>Dashboard</PageTitle>

      <Separator />

      <section className="flex flex-col gap-5 scrollbar">
        {Object.entries(dashboardCards).map(([section, cards]) => (
          <>
            <h3 className="text-white text-xl font-semibold">{section}</h3>

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 text-white">
              {cards.map((card) => {
                const cardContent = (
                  <Card.Container className="lg:!py-3 h-full">
                    <Card.TextContainer className="lg:h-full">
                      <Card.Title className="lg:font-semibold lg:text-xl">{card.title}</Card.Title>
                      <Card.Description className="hidden lg:block font-normal tracking-tight">
                        {card.description}
                      </Card.Description>
                    </Card.TextContainer>
                  </Card.Container>
                );

                if (card.url) {
                  return (
                    <Link to={card.url} className="h-full">
                      {cardContent}
                    </Link>
                  );
                }

                const Dialog = card.dialog;
                return Dialog ? <Dialog>{cardContent}</Dialog> : cardContent;
              })}
            </div>
          </>
        ))}
      </section>
    </PageContainer.Card>
  );
}