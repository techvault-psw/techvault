import { DadosClienteDialog } from '@/components/dialogs/dados-cliente-dialog';
import { ArrowRightIcon } from '@/components/icons/arrow-right-icon';
import { FilterIcon } from "@/components/icons/filter-icon";
import { SlidersIcon } from "@/components/icons/sliders-icon";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { Table } from "@/components/ui/table";
import { clientes } from '@/consts/clientes';

export default function ClientesPage() {
  return (
    <div className="flex flex-col h-full"> 
      <PageContainer.List>
        <PageTitle>Lista de Clientes</PageTitle>

        <div className="flex items-center gap-4 flex-shrink-0">
          <Button className="w-40 md:w-52" variant="secondary" size="sm">
            <FilterIcon className="size-4.5" />
            Filtros
          </Button>
          <Button className="w-40 md:w-52" variant="secondary" size="sm">
            <SlidersIcon className="size-4.5" />
            Ordenar por
          </Button>
        </div>
        
        <Separator />

        <section className="w-full flex flex-col items-center gap-4 scrollbar md:grid md:grid-cols-2 xl:grid-cols-3 lg:hidden">
          {clientes.map((cliente) => (
            <DadosClienteDialog cliente={cliente} key={cliente.id}>
              <Card.Container>
                <Card.TextContainer>
                  <Card.Title>{cliente.name}</Card.Title>
                  <Card.Description className='truncate leading-[120%]'>
                    <span className="font-medium">E-mail: </span>{cliente.email}
                  </Card.Description>
                  <Card.Description className='truncate leading-[120%]'>
                    <span className="font-medium">Telefone: </span>{cliente.phone}
                  </Card.Description>
                </Card.TextContainer>
              </Card.Container>
            </DadosClienteDialog>
          ))}
        </section>

        <div className="hidden lg:block w-full scrollbar">
          <Table.Container className="w-full table-fixed">
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-4/16 ">Nome</Table.Head>
                <Table.Head className="w-4/16 ">E-mail</Table.Head>
                <Table.Head className="w-4/16 ">Telefone</Table.Head>
                <Table.Head className="w-3/16 ">Data de cadastro</Table.Head>
                <Table.Head className="w-1/16 text-right"></Table.Head> 
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {clientes.map((cliente) => (
                <DadosClienteDialog cliente={cliente} key={cliente.id}>
                  <Table.Row>
                    <Table.Cell className="text-white font-medium">{cliente.name}</Table.Cell>
                    <Table.Cell>{cliente.email}</Table.Cell>
                    <Table.Cell>{cliente.phone}</Table.Cell>
                    <Table.Cell>{cliente.registrationDate}</Table.Cell>
                    <Table.Cell className="text-right">
                      <ArrowRightIcon className="size-6" />
                    </Table.Cell>
                  </Table.Row>
                </DadosClienteDialog>
              ))}
            </Table.Body>
          </Table.Container>
        </div>
      </PageContainer.List>
    </div>
  );
}