import { CriarPacoteDialog } from "@/components/dialogs/criar-pacote-dialog";
import { DadosPacoteDialog } from "@/components/dialogs/dados-pacote-dialog";
import { ArrowRightIcon } from "@/components/icons/arrow-right-icon";
import { FilterIcon } from "@/components/icons/filter-icon";
import { PlusIcon } from "@/components/icons/plus-icon";
import { SearchIcon } from "@/components/icons/search-icon";
import { SlidersIcon } from "@/components/icons/sliders-icon";
import { PacoteImage } from "@/components/pacote-image";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table } from "@/components/ui/table";
import useCargo from "@/hooks/useCargo";
import { formatCurrency } from "@/lib/format-currency";
import { fetchPacotes } from "@/redux/pacotes/fetch";
import type { Pacote } from "@/redux/pacotes/slice";
import { selectAllPacotes } from "@/redux/pacotes/slice";
import type { RootState } from "@/redux/root-reducer";
import { type AppDispatch } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function Pacotes() {
  const { isGerente } = useCargo()

  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>()
  const { status: statusP, error: errorP } = useSelector((rootReducer: RootState) => rootReducer.pacotesReducer)

  useEffect(() => {
    if (['not_loaded', 'saved', 'deleted'].includes(statusP)) {
      dispatch(fetchPacotes())
    }
  }, [statusP, dispatch])

  const pacotes = useSelector(selectAllPacotes)

  useEffect(() => {
    if (!isGerente()) {
      navigate("/login")
    }
  }, [])

  const [searchTerm, setSearchTerm] = useState('')

  const pacotesFiltrados = pacotes.filter(pacote =>
    pacote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pacote.description.some((paragraph) => paragraph.toLocaleLowerCase().includes(searchTerm.toLowerCase())) ||
    pacote.value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  )

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

        <CriarPacoteDialog>
          <Button className="w-full max-w-52" size="sm">
            <PlusIcon className="size-4.5 stroke-white" />
            Criar novo
          </Button>
        </CriarPacoteDialog>
      </div>

      <div className="relative flex-shrink-0 w-full">
        <Input
          placeholder="Pesquisar por nome, descrição e valor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />

        <SearchIcon
          className='absolute left-3 top-1/2 transform -translate-y-1/2 stroke-gray rotate-y-180 size-5'
        />
      </div>

      <Separator />

      {['loading', 'saving', 'deleting'].includes(statusP) ? (
          <p className="text-lg text-white text-center py-2 w-full">Carregando...</p>
      ) : ['failed'].includes(statusP) ? (
          <p className="text-lg text-white text-center py-2 w-full">{errorP}</p>
      ) : pacotesFiltrados.length === 0 ? (
        <div className="w-full text-center text-white py-4">
          {searchTerm
            ? `Nenhum pacote encontrado para "${searchTerm}"`
            : "Nenhum pacote cadastrado ainda."
          }
        </div>
      ) : (
          <>
            <div className="w-full flex flex-col gap-5 scrollbar md:grid min-[900px]:grid-cols-2 xl:grid-cols-3 lg:hidden">
              {pacotesFiltrados.map((pacote: Pacote, i) => (
                <DadosPacoteDialog pacote={pacote} key={i}>
                  <Card.Container className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <PacoteImage pacote={pacote} className="h-20 rounded-lg border-gray/50"/>
                      <Card.TextContainer className="truncate">
                        <Card.Title className="truncate font-semibold leading-[110%]">{pacote.name}</Card.Title>
                        <Card.Description className="leading-[110%]">Valor (hora): {formatCurrency(pacote.value)}</Card.Description>
                        <Card.Description className="leading-[110%]">Quantidade: {pacote.quantity}</Card.Description>
                      </Card.TextContainer>
                    </div>
                  </Card.Container>
                </DadosPacoteDialog>
              ))}
            </div>

            <section className="hidden lg:block w-full scrollbar">
              <Table.Container>
                <Table.Header>
                  <tr>
                    <Table.Head>Foto</Table.Head>
                    <Table.Head>Nome</Table.Head>
                    <Table.Head>Descrição</Table.Head>
                    <Table.Head>Valor (hora)</Table.Head>
                    <Table.Head>Quantidade</Table.Head>
                    <Table.Head className="w-16"></Table.Head>
                  </tr>
                </Table.Header>
                <Table.Body>
                  {pacotesFiltrados.map((pacote: Pacote, i) => (
                    <DadosPacoteDialog pacote={pacote} key={i}>
                      <Table.Row>
                        <Table.Cell>
                          <PacoteImage pacote={pacote} className="w-24 rounded-lg border-gray/50"/>
                        </Table.Cell>
                        <Table.Cell className="font-medium text-white" title={pacote.name}>{pacote.name}</Table.Cell>
                        <Table.Cell className="max-w-sm truncate" title={pacote.description[0]}>{pacote.description[0]}</Table.Cell>
                        <Table.Cell>{formatCurrency(pacote.value)}</Table.Cell>
                        <Table.Cell>{pacote.quantity}</Table.Cell>
                        <Table.Cell>
                          <ArrowRightIcon className="size-6" />
                        </Table.Cell>
                      </Table.Row>
                    </DadosPacoteDialog>
                  ))}
                </Table.Body>
              </Table.Container>
            </section>
          </>
      )}
    </PageContainer.List>
  );
}