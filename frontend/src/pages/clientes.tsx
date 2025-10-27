import { DadosClienteDialog } from '@/components/dialogs/dados-cliente-dialog';
import { ArrowRightIcon } from '@/components/icons/arrow-right-icon';
import { FilterIcon } from "@/components/icons/filter-icon";
import { SearchIcon } from '@/components/icons/search-icon';
import { SlidersIcon } from "@/components/icons/sliders-icon";
import { PageContainer } from "@/components/page-container";
import { PageTitle, PageTitleContainer } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from '@/components/ui/separator';
import { Table } from "@/components/ui/table";
import useCargo from '@/hooks/useCargo';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";
import type { AppDispatch } from '@/redux/store';
import { fetchClientes } from '@/redux/clientes/fetch';
import { selectAllClientes } from '@/redux/clientes/slice';
import { GoBackButton } from '@/components/go-back-button';


export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clienteToOpen, setClienteToOpen] = useState<number | null>(null);

  const dispatch = useDispatch<AppDispatch>()
    const { status: statusC, error: errorC } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)

    useEffect(() => {
        if (['not_loaded', 'saved', 'deleted'].includes(statusC)) {
            dispatch(fetchClientes())
        }
    }, [statusC, dispatch])

    const clientes = useSelector(selectAllClientes)
  const location = useLocation();

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { isGerente } = useCargo();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isGerente()) {
      navigate("/login")
    }
  }, [])

  useEffect(() => {
    const state = location.state as { fromClientDialog?: number };
    if (state?.fromClientDialog !== undefined) {
      setClienteToOpen(state.fromClientDialog);
    }
  }, [location])

  return (
    <div className="flex flex-col h-full"> 
      <PageContainer.List>
        <PageTitleContainer>
          <GoBackButton />
          <PageTitle> Lista de Clientes </PageTitle>
        </PageTitleContainer>

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

        <div className="relative flex-shrink-0 w-full">
          <Input
            placeholder="Pesquisar por nome, e-mail ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />

          <SearchIcon
            className='absolute left-3 top-1/2 transform -translate-y-1/2 stroke-gray rotate-y-180 size-5'
          />
        </div>
        
        <Separator />

        {['loading', 'saving', 'deleting'].includes(status) ? (
            <p className="text-lg text-white text-center py-2 w-full">Carregando...</p>
        ) : ['failed'].includes(status) ? (
            <p className="text-lg text-white text-center py-2 w-full">{errorC}</p>
        ) : clientesFiltrados.length === 0 && searchTerm ? (
          <div className="w-full text-center text-white">
            Nenhum cliente encontrado para "{searchTerm}"
          </div>
        ) : clientesFiltrados.length !== 0 && (
          <>
            <section className="w-full flex flex-col items-center gap-4 scrollbar md:grid md:grid-cols-2 xl:grid-cols-3 lg:hidden">
              {clientesFiltrados.map((cliente) => (
                <DadosClienteDialog 
                  cliente={cliente} 
                  key={cliente.id}
                  open={clienteToOpen === cliente.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setClienteToOpen(null);
                    } else {
                      setClienteToOpen(cliente.id);
                    }
                  }}
                >
                  <Card.Container>
                    <Card.TextContainer className="truncate">
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
                    <Table.Head className="w-5/16 ">E-mail</Table.Head>
                    <Table.Head className="w-3/16 ">Telefone</Table.Head>
                    <Table.Head className="w-3/16 ">Data de cadastro</Table.Head>
                    <Table.Head className="w-1/16 text-right"></Table.Head> 
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {clientesFiltrados.map((cliente) => (
                    <DadosClienteDialog 
                      cliente={cliente} 
                      key={cliente.id}
                      open={clienteToOpen === cliente.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setClienteToOpen(null);
                        } else {
                          setClienteToOpen(cliente.id);
                        }
                      }}
                    >
                      <Table.Row>
                        <Table.Cell className="text-white font-medium truncate">{cliente.name}</Table.Cell>
                        <Table.Cell className="truncate">{cliente.email}</Table.Cell>
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
          </>
        )}
      </PageContainer.List>
    </div>
  );
}
