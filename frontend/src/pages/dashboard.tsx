/**
 * @fileoverview Página Dashboard - Painel administrativo
 * 
 * Esta página serve como hub central de acesso para gerentes e suporte,
 * oferecendo atalhos para páginas públicas, ferramentas de gerenciamento
 * e geração de relatórios, organizados por categoria e permissão de cargo.
 * 
 * @module pages/DashboardPage
 */

import { EmitirRelatorioFinanceiroDialog } from "@/components/dialogs/emitir-relatorio-financeiro-dialog";
import { EmitirRelatorioReservasDialog } from "@/components/dialogs/emitir-relatorio-reservas-dialog";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useCargo from "@/hooks/useCargo";
import { fetchReservas } from "@/redux/reservas/fetch";
import type { RootState } from "@/redux/root-reducer";
import type { AppDispatch } from "@/redux/store";
import { useEffect, type ComponentType, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

import { useNavigate } from 'react-router'

/**
 * Tipo para definição de cards do dashboard
 * 
 * @typedef {Object} DashboardCard
 * @property {string} title - Título do card
 * @property {string} description - Descrição da funcionalidade
 * @property {string} [url] - URL de destino (para links)
 * @property {ComponentType} [dialog] - Componente de dialog (para modais)
 * @property {'gerente' | 'suporte'} [role] - Cargo mínimo requerido
 */
type DashboardCard = {
  title: string
  description: string
  url?: string
  dialog?: ComponentType<{ children: ReactNode }>
  role?: 'gerente' | 'suporte'
}

/**
 * Configuração de cards do dashboard organizados por seção
 * 
 * @constant
 * @type {Record<string, DashboardCard[]>}
 */
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
      dialog: EmitirRelatorioFinanceiroDialog,
      title: 'Emitir relatório financeiro',
      description:
        'Emitir e visualizar um relatório financeiro de um determinado período',
      role: 'gerente',
    },
  ],
}

/**
 * Componente da página Dashboard
 * 
 * Painel administrativo que oferece:
 * - Acesso rápido a páginas públicas (Home, Pacotes, Feedbacks)
 * - Ferramentas de gerenciamento (Reservas, Pacotes, Clientes)
 * - Emissão de relatórios (Reservas e Financeiro - apenas Gerente)
 * 
 * Cards são exibidos conforme permissões:
 * - Suporte: vê todas as páginas públicas e gerenciamento de reservas
 * - Gerente: acesso total incluindo gerenciamento de pacotes/clientes e relatórios
 * 
 * Requer cargo de Gerente ou Suporte - redireciona para /login se não autorizado.
 * 
 * @component
 * @returns {JSX.Element} Página dashboard
 * 
 * @example
 * // Uso no roteamento
 * <Route path="/dashboard" element={<DashboardPage />} />
 */
export default function DashboardPage() {
  const { isGerente, isSuporte } = useCargo()
  const navigate = useNavigate()

  useEffect(() => {
    if(!isGerente() && !isSuporte()) {
      navigate("/login")
    }
  }, [])

  const dispatch = useDispatch<AppDispatch>();
  const { status: statusR } = useSelector((rootReducer: RootState) => rootReducer.reservasReducer)

  useEffect(() => {
    if (['not_loaded', 'saved', 'deleted'].includes(statusR)) {
      dispatch(fetchReservas())
    }
  }, [statusR, dispatch])

  return (
    <PageContainer.Card>
      <PageTitle>Dashboard</PageTitle>

      <Separator />

     <section className="flex flex-col gap-5 scrollbar">
      {Object.entries(dashboardCards).map(([section, cards]) => {

        const visibleCards = cards.filter((card) => {
          return (
            !(card.role == "gerente" && !isGerente()) && 
            !(card.role == "suporte" && !isSuporte())
          )
        });

        if (visibleCards.length == 0) return null;

        return (
          <div key={section} className="flex flex-col gap-5">
            <h3 className="text-white text-xl font-semibold">{section}</h3>

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 text-white">
              {cards.map((card) => {
                if(card.role == "gerente" && !isGerente()) {
                  return null
                }

                const cardContent = (
                  <Card.Container className="lg:!py-3 h-full">
                    <Card.TextContainer className="justify-center lg:justify-start">
                      <Card.Title className="lg:font-semibold lg:text-xl">{card.title}</Card.Title>
                      <Card.Description className="hidden lg:block font-normal tracking-tight">
                        {card.description}
                      </Card.Description>
                    </Card.TextContainer>
                  </Card.Container>
                );

                if (card.url) {
                  return (
                    <Link key={card.url} to={card.url} className="h-full">
                      {cardContent}
                    </Link>
                  );
                }

                const Dialog = card.dialog;
                return Dialog ? (
                  <Dialog key={card.title}>{cardContent}</Dialog>
                ) : (
                  <div key={card.title}>{cardContent}</div>
                )
              })}
            </div>
          </div>
        )
      })}
    </section>

    </PageContainer.Card>
  );
}