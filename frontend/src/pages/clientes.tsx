import { DadosClienteDialog } from '@/components/dialogs/dados-cliente-dialog';
import { FiltrosClientesDialog } from '@/components/dialogs/filtros-clientes-dialog';
import { OrdenarClientesDialog } from '@/components/dialogs/ordenar-clientes-dialog';
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
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";
import type { AppDispatch } from '@/redux/store';
import { fetchClientes } from '@/redux/clientes/fetch';
import { selectAllClientes } from '@/redux/clientes/slice';
import { GoBackButton } from '@/components/go-back-button';
import { format } from 'date-fns';


export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clienteToOpen, setClienteToOpen] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<any>({});
  const [ordenacao, setOrdenacao] = useState<any>({ campo: "name", ordem: "asc" });

  const dispatch = useDispatch<AppDispatch>()
    const { status: statusC, error: errorC } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)

    useEffect(() => {
        if (['not_loaded', 'saved', 'deleted'].includes(statusC)) {
            dispatch(fetchClientes())
        }
    }, [statusC, dispatch])

    const clientes = useSelector(selectAllClientes)
  const location = useLocation();

  const clientesFiltrados = useMemo(() => {
    let resultado = clientes.filter(cliente =>
      cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtros.role && filtros.role !== "Todos") {
      resultado = resultado.filter(c => c.role === filtros.role);
    }

    if (filtros.dataRegistroInicio) {
      resultado = resultado.filter(c => new Date(c.registrationDate) >= new Date(filtros.dataRegistroInicio));
    }

    if (filtros.dataRegistroFim) {
      resultado = resultado.filter(c => new Date(c.registrationDate) <= new Date(filtros.dataRegistroFim));
    }

    resultado.sort((a, b) => {
      let valorA: any, valorB: any;

      switch (ordenacao.campo) {
        case "name":
          valorA = a.name.toLowerCase();
          valorB = b.name.toLowerCase();
          break;
        case "email":
          valorA = a.email.toLowerCase();
          valorB = b.email.toLowerCase();
          break;
        case "phone":
          valorA = a.phone;
          valorB = b.phone;
          break;
        case "registrationDate":
          valorA = new Date(a.registrationDate).getTime();
          valorB = new Date(b.registrationDate).getTime();
          break;
        case "role":
          valorA = a.role;
          valorB = b.role;
          break;
        default:
          return 0;
      }

      if (ordenacao.ordem === "asc") {
        return valorA > valorB ? 1 : -1;
      } else {
        return valorA < valorB ? 1 : -1;
      }
    });

    return resultado;
  }, [clientes, searchTerm, filtros, ordenacao]);

  const { isGerente } = useCargo();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isGerente()) {
      navigate("/login")
    }
  }, [])

  useEffect(() => {
    const state = location.state as { fromClientDialog?: string };
    if (state?.fromClientDialog !== undefined) {
      setClienteToOpen(state.fromClientDialog);
    }
  }, [location])

  return (
    <div className="flex flex-col h-full"> 
      <PageContainer.List>
        <PageTitleContainer>
          <GoBackButton to='/dashboard' />
          <PageTitle> Lista de Clientes </PageTitle>
        </PageTitleContainer>

        <div className="flex items-center gap-4 flex-shrink-0">
          <FiltrosClientesDialog onApplyFilters={setFiltros}>
            <Button className="w-40 md:w-52" variant="secondary" size="sm">
              <FilterIcon className="size-4.5" />
              Filtros
            </Button>
          </FiltrosClientesDialog>
          <OrdenarClientesDialog onApplySort={setOrdenacao}>
            <Button className="w-40 md:w-52" variant="secondary" size="sm">
              <SlidersIcon className="size-4.5" />
              Ordenar por
            </Button>
          </OrdenarClientesDialog>
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

        {['loading', 'saving', 'deleting'].includes(statusC) ? (
            <p className="text-lg text-white text-center py-2 w-full">Carregando...</p>
        ) : ['failed'].includes(statusC) ? (
            <p className="text-lg text-white text-center py-2 w-full">{errorC}</p>
        ) : clientesFiltrados.length === 0 && (filtros.role || filtros.dataRegistroInicio || filtros.dataRegistroFim) ? (
          <div className="w-full text-center text-white">
            Nenhum cliente encontrado com os filtros aplicados.
          </div>
        ) : clientesFiltrados.length === 0 && searchTerm ? (
          <div className="w-full text-center text-white">
            Nenhum cliente encontrado para "{searchTerm}"
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="w-full text-center text-white">
            Nenhum cliente cadastrado ainda.
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
                      <Card.Description className='truncate leading-[120%]'>
                        <span className="font-medium">Cargo: </span>{cliente.role}
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
                    <Table.Head className="w-3/16 ">Nome</Table.Head>
                    <Table.Head className="w-4/16 ">E-mail</Table.Head>
                    <Table.Head className="w-3/16 xl:w-2/16 ">Telefone</Table.Head>
                    <Table.Head className="w-2/16 xl:w-1/16 ">Cargo</Table.Head>
                    <Table.Head className="w-3/16 xl:w-2/16 ">Data de cadastro</Table.Head>
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
                        <Table.Cell>{cliente.role}</Table.Cell>
                        <Table.Cell>{format(cliente.registrationDate, "dd/MM/yyyy")}</Table.Cell>
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
