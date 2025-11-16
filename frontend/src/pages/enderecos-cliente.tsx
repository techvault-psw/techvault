/**
 * @fileoverview Página de listagem de endereços de um cliente específico
 * 
 * Página administrativo-gerencial que exibe todos os endereços cadastrados para um cliente.
 * Acessível apenas por gerentes e suporte. Oferece visualização em grid (mobile) e tabela (desktop),
 * com funcionalidade para editar/excluir cada endereço através de um dialog.
 * 
 * @module pages/EnderecosClientePage
 */

import { PageContainer } from "@/components/page-container";
import { PageTitle, PageTitleContainer } from "@/components/page-title";
import { Card } from "@/components/ui/card"; 
import { Table } from "@/components/ui/table";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { stringifyAddress } from "@/lib/stringify-address";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/icons/arrow-right-icon";
import useCargo from "@/hooks/useCargo";
import { useNavigate, useParams, useLocation } from "react-router";
import { DadosEnderecoDialog } from "@/components/dialogs/dados-endereco-dialog";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";
import { selectClienteById } from "@/redux/clientes/slice";
import { selectAllEnderecos, type Endereco } from "@/redux/endereco/slice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { fetchEnderecos } from "@/redux/endereco/fetch";
import { GoBackButton } from "@/components/go-back-button";

/**
 * Página de endereços do cliente
 * 
 * Exibe uma lista de todos os endereços cadastrados para um cliente específico.
 * Recursos:
 * - Verificação de permissão (apenas gerentes e suporte)
 * - Visualização em grid para mobile e tabela para desktop
 * - Integração com Redux para gerenciamento de estado
 * - Botão voltar dinâmico baseado no caminho de origem
 * - Edição e exclusão de endereços via dialog
 * 
 * @component
 * @returns {JSX.Element} Página com lista de endereços do cliente ou null se cliente não encontrado
 * 
 * @example
 * // Rota: /clientes/:id/enderecos
 * <EnderecosClientePage />
 */
export default function EnderecosClientePage() {
  const { id } = useParams<{ id: string }>();

  const cliente = useSelector((state: RootState) => selectClienteById(state, id ?? ''))

  const {isGerente, isSuporte} = useCargo()

  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { fromClientDialog?: number; returnTo?: string; fromReservaId?: number } | null

  useEffect(() => {
    if(!isGerente() && !isSuporte()) {
      navigate("/login")
    }
  }, [])

  const dispatch = useDispatch<AppDispatch>()
  const { status: statusE, error: errorE } = useSelector((rootReducer: RootState) => rootReducer.enderecosReducer) 

  useEffect(() => {
        if (['not_loaded', 'saved', 'deleted'].includes(statusE)) {
            dispatch(fetchEnderecos())
        }
    }, [statusE, dispatch])


  const enderecos = useSelector(selectAllEnderecos)
  const enderecosCliente = enderecos.filter((endereco) => endereco.cliente.id === id)

  if (!id || !cliente) {
    return
  }

  return (
    <PageContainer.List>
      <PageTitleContainer>
        <GoBackButton
          onClick={() => {
            const returnTo = state?.returnTo || "/clientes";
            navigate(returnTo, { 
              state: { 
                fromClientDialog: id,
                fromReservaId: state?.fromReservaId
              } 
            });
          }}
        />

        <PageTitle>Endereços de {cliente.name}</PageTitle>
      </PageTitleContainer>

      <Separator />

      {['loading', 'saving', 'deleting'].includes(statusE) ? (
        <p className="text-lg text-white text-center py-2 w-full">Carregando...</p>
      ) : ['failed'].includes(statusE) ? (
        <p className="text-lg text-white text-center py-2 w-full">{errorE}</p>
      ) : enderecosCliente.length === 0 ? (
        <div className="w-full text-center text-white">
          Nenhum endereço encontrado para o cliente "{cliente.name}"
        </div>
      ) : (
        <>
          <section className="w-full flex flex-col items-center gap-4 scrollbar md:grid md:grid-cols-2 xl:grid-cols-3 lg:hidden">
            {enderecosCliente.map((endereco: Endereco, i) => {
              return (
                <DadosEnderecoDialog endereco={endereco} key={i}>
                  <Card.Container className="h-full">
                    <Card.TextContainer className="h-full">
                      <Card.Title>{endereco.name}</Card.Title>
                      <Card.Description>
                        {stringifyAddress(endereco)}
                      </Card.Description>
                    </Card.TextContainer>
                  </Card.Container>
                </DadosEnderecoDialog>
              )
            })}
          </section>

          <section className="hidden lg:block w-full scrollbar">
            <Table.Container>
              <Table.Header>
                <tr>
                  <Table.Head>Nome</Table.Head>
                  <Table.Head>CEP</Table.Head>
                  <Table.Head>Estado</Table.Head>
                  <Table.Head>Cidade</Table.Head>
                  <Table.Head>Logradouro</Table.Head>
                  <Table.Head className="w-16"></Table.Head>
                </tr>
              </Table.Header>
              <Table.Body>
                {enderecosCliente.map((endereco: Endereco, i) => {
                  return (
                    <DadosEnderecoDialog endereco={endereco} key={i}>
                      <Table.Row>
                        <Table.Cell className="font-medium text-white">{endereco.name}</Table.Cell>
                        <Table.Cell>{endereco.cep}</Table.Cell>
                        <Table.Cell>{endereco.state}</Table.Cell>
                        <Table.Cell>{endereco.city}</Table.Cell>
                        <Table.Cell>{endereco.street}, {endereco.number} - {endereco.description && `${endereco.description} - `} {endereco.neighborhood}</Table.Cell>
                        <Table.Cell>
                          <ArrowRightIcon className="size-6" />
                        </Table.Cell>
                      </Table.Row>
                    </DadosEnderecoDialog>
                  )
                })}
              </Table.Body>
            </Table.Container>
          </section>
        </>
      )}
    </PageContainer.List>
  );
}
