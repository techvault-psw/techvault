import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Card } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { FilterIcon } from "@/components/icons/filter-icon";
import { Table } from "@/components/ui/table";
import { ArrowRightIcon } from "@/components/icons/arrow-right-icon";
import { PacoteImage } from "@/components/pacote-image";
import { pacotes } from "@/consts/pacotes";
import { formatCurrency } from "@/lib/format-currency";
import { SlidersIcon } from "@/components/icons/sliders-icon";

export default function Pacotes() {
  return (
    <PageContainer.List>
        <PageTitle>Pacotes</PageTitle>

        <div className="w-full flex flex-col items-center gap-4 md:items-start lg:items-center md:flex-row">
          <div className="flex items-center gap-4 flex-shrink-0">
            <Button className="w-40 md:w-52" variant="secondary" size="sm">
              <FilterIcon className="size-4.5" />
              Filtros
            </Button>
            <Button className="w-40 md:w-52" variant="secondary" size="sm">
              <SlidersIcon className="size-4.5" />
              Ordenar Por
            </Button>
          </div>
            <Button className="w-full max-w-52" size="sm">
              <span>Criar novo</span>
            </Button>
        </div>

        <section className="lg:hidden">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {pacotes.map((pacote, i) => (
              <Card.Container key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4 overflow-hidden">
                  <PacoteImage pacote = {pacote} className="h-20 rounded-lg border-gray/50"/>
                  <Card.TextContainer>
                    <Card.Title className="truncate font-semibold">{pacote.name}</Card.Title>
                    <Card.Description>Valor (hora): {formatCurrency(pacote.value)}</Card.Description>
                  </Card.TextContainer>
                </div>
              </Card.Container>
            ))}
          </div>
      </section>

      <section className="hidden lg:block w-full scrollbar">
        <Table.Container>
          <Table.Header>
            <Table.Row>
              <Table.Head>Foto</Table.Head>
              <Table.Head>Nome</Table.Head>
              <Table.Head>Descrição</Table.Head>
              <Table.Head>Valor (hora)</Table.Head>
              <Table.Head className="w-16"></Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {pacotes.map((pacote, i) => (
              <Table.Row key={i}>
                <Table.Cell>
                  <PacoteImage pacote = {pacote} className="w-24 rounded-lg border-gray/50"/>
                </Table.Cell>
                <Table.Cell className="font-medium text-white">{pacote.name}</Table.Cell>
                <Table.Cell className="max-w-sm truncate">{pacote.description}</Table.Cell>
                <Table.Cell>{formatCurrency(pacote.value)}</Table.Cell>
                <Table.Cell>
                  <ArrowRightIcon className="size-6" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Container>
      </section>

    </PageContainer.List>
  );
}