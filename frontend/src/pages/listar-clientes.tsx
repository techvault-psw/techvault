import { useState } from 'react';
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { clientsData } from "@/data/clientes";
import { ArrowRightIcon } from '@/components/icons/arrow-right-icon';
import { FilterIcon } from "@/components/icons/filter-icon";
import { SlidersIcon } from "@/components/icons/sliders-icon";
import { DetalhesClienteDialog } from '../components/dialogs/detalhes-cliente-dialog';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
}

export default function ListarClientesPage() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleOpenDialog = (cliente: Client) => {
    setSelectedClient(cliente);
    setIsModalOpen(true);
  };
  const handleViewClientDetails = (client: Client) => {
    console.log("Visualizando detalhes de:", client.name);
  };

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
        
        <hr className="w-full border-t border-white/20" />

        <div className="flex-1 min-h-0">
          <section className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            {clientsData.map((cliente) => (
              <Card.Container key={cliente.id} onClick={() => handleViewClientDetails(cliente)}>
                <Card.TextContainer>
                  <Card.Title>{cliente.name}</Card.Title>
                  <Card.Description>
                    <span className="font-medium text-gray-200">E-mail: </span>{cliente.email}
                  </Card.Description>
                  <Card.Description>
                    <span className="font-medium text-gray-200">Telefone: </span>{cliente.phone}
                  </Card.Description>
                </Card.TextContainer>
              </Card.Container>
            ))}
          </section>

          <div className="hidden lg:block w-full h-full">
            <div className="w-full h-full overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
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
                {clientsData.map((cliente) => (
                  <Table.Row key={cliente.id} onClick={() => handleViewClientDetails(cliente)}>
                    <Table.Cell className="text-white font-medium">{cliente.name}</Table.Cell>
                    <Table.Cell>{cliente.email}</Table.Cell>
                    <Table.Cell>{cliente.phone}</Table.Cell>
                    <Table.Cell>{cliente.registrationDate}</Table.Cell>
                    <Table.Cell className="text-right">
                      <button onClick={() => handleOpenDialog(cliente)}>
                        <ArrowRightIcon className="inline-block" />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Container>
            </div>
          </div>
        </div>
      </PageContainer.List>
      <DetalhesClienteDialog
        open={isModalOpen}
        setOpen={setIsModalOpen}
        client={selectedClient}
      />
    </div>
  );
}