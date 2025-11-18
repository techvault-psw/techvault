/**
 * @fileoverview Página de informações da reserva
 * 
 * Página que exibe informações detalhadas de uma reserva específica do cliente,
 * incluindo códigos de entrega/coleta e opção de cancelamento.
 * 
 * @module pages/InformacoesReservasPage
 */

import { CancelarReservaDialog } from "@/components/dialogs/cancelar-reserva-dialog"
import { GoBackButton } from "@/components/go-back-button"
import { HighlightBox } from "@/components/highlight-box"
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon"
import { PacoteImage } from "@/components/pacote-image"
import { PageContainer } from "@/components/page-container"
import { PageTitle, PageTitleContainer } from "@/components/page-title"
import { Button } from "@/components/ui/button"
import { FormItem } from "@/components/ui/form"
import { Input, Label } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/format-currency"
import { cn } from "@/lib/utils"
import { cancelReservaServer, fetchReservas } from "@/redux/reservas/fetch"
import { selectAllReservas, selectReservaById } from "@/redux/reservas/slice"
import type { RootState } from "@/redux/root-reducer"
import type { AppDispatch } from "@/redux/store"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { X } from "lucide-react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate, useParams } from "react-router"

/**
 * Componente da página de informações da reserva
 * 
 * Exibe detalhes completos de uma reserva do cliente:
 * - Imagem e nome do pacote
 * - Valor total pago
 * - Endereço de entrega
 * - Datas e horas de início e término
 * - Códigos de entrega e coleta (destacados)
 * - Datas/horas de entrega e coleta efetivas
 * - Botão de cancelamento (apenas para reservas confirmadas)
 * 
 * Requer autenticação - redireciona para /login se o usuário não estiver autenticado.
 * 
 * @component
 * @returns {JSX.Element} Página de informações da reserva
 * 
 * @example
 * // Uso no roteamento
 * <Route path="/informacoes-reserva/:id" element={<InformacoesReservasPage />} />
 */
export default function InformacoesReservasPage() {
  const reservas = useSelector(selectAllReservas)
  const { id } = useParams<{ id: string }>();

  const reserva = useSelector((state: RootState) => selectReservaById(state, id ?? ''))
  
  const pacote = reserva?.pacote
  const formattedValue = formatCurrency(reserva?.valor ?? 0) 
  const formattedStartDate = format(reserva?.dataInicio ?? new Date(), "dd/MM/yyyy HH:mm", {locale: ptBR})
  const formattedEndDate = format(reserva?.dataTermino ?? new Date(), "dd/MM/yyyy HH:mm", {locale: ptBR})
  const formattedDataEntrega = reserva?.dataEntrega ? format(reserva?.dataEntrega, "dd/MM/yyyy HH:mm", {locale: ptBR}) : undefined
  const formattedDataColeta = reserva?.dataColeta ? format(reserva?.dataColeta, "dd/MM/yyyy HH:mm", {locale: ptBR}) : undefined
  
  const navigate = useNavigate()
  const location = useLocation()
  
  const dispatch = useDispatch<AppDispatch>()

  const cancelarReserva = () => {
    navigate("/minhas-reservas")
    if (reserva) {
      dispatch(cancelReservaServer(reserva))
    }
  }

  const { token } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)
  const { status: statusR, error: errorR } = useSelector((rootReducer: RootState) => rootReducer.reservasReducer)

  useEffect(() => {
    if (!token) {
      const fullPath = location.pathname + location.search + location.hash;
      navigate(`/login?redirectTo=${encodeURIComponent(fullPath)}`)
    }
  }, [])

  useEffect(() => {
    if (['not_loaded', 'saved', 'deleted'].includes(statusR)) {
      dispatch(fetchReservas())
    }
  }, [statusR, dispatch])

  if (!id || !reserva || !pacote) {
    return
  }

  return (
    <PageContainer.Card>
      <PageTitleContainer>
        <GoBackButton />
        <PageTitle> Reserva </PageTitle>
      </PageTitleContainer>

      <Separator/>

      {/* TODO: Componentizar essa div (utilizada em 3 páginas) */}
      <div className="flex md:flex-col items-center gap-3">
        <PacoteImage
          pacote={pacote}
          className="h-22 md:h-66 xl:h-77 rounded-lg md:rounded-xl"
        />

        <span className="text-white text-lg md:text-xl font-semibold">{pacote.name}</span>
      </div>

      <Separator/>

      {['loading', 'saving', 'deleting'].includes(statusR) ? (
        <p className="text-lg text-white text-center py-2 w-full">Carregando...</p>
      ) : ['failed'].includes(statusR) ? (
        <p className="text-lg text-white text-center py-2 w-full">{errorR}</p>
      ) : (
        <>
          <div className="flex flex-col gap-5 custom-scrollbar-ver">
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-white text-lg leading-none">Informações:</h3>

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                <FormItem>
                  <Label htmlFor="value">
                    Valor total pago:
                  </Label>

                  <Input
                    disabled
                    id="value"
                    type="text"
                    value={formattedValue}
                  />
                </FormItem>

                <FormItem>
                  <Label htmlFor="endereco">
                    Endereço de Entrega:
                  </Label>

                  <Input
                    disabled
                    id="endereco"
                    type="text"
                    value={reserva.endereco.name}
                  />
                </FormItem>

                <FormItem>
                  <Label htmlFor="inicio">
                    Data e Hora de Início:
                  </Label>

                  <Input
                    disabled
                    id="inicio"
                    type="text"
                    value={formattedStartDate}
                  />
                </FormItem>

                <FormItem>
                  <Label htmlFor="termino">
                    Data e Hora de Término:
                  </Label>

                  <Input
                    disabled
                    id="termino"
                    type="text"
                    value={formattedEndDate}
                  />
                </FormItem>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
              <div className="md:flex-1 flex flex-col gap-4">
                <h3 className="font-semibold text-white text-lg leading-none">Código para entrega:</h3>
                
                <HighlightBox>
                  {reserva.codigoEntrega}
                </HighlightBox>
              </div>

              <div className="md:flex-1 flex flex-col gap-4">
                <h3 className="font-semibold text-white text-lg leading-none">Código para coleta:</h3>
                
                <HighlightBox>
                  {reserva.codigoColeta}
                </HighlightBox>
              </div>

              <FormItem className="gap-4">
                <Label htmlFor="entrega">
                  Data e Hora de Entrega:
                </Label>

                <Input
                  disabled
                  id="entrega"
                  type="text"
                  className="flex-1"
                  value={formattedDataEntrega ?? "Não houve entrega"}
                />
              </FormItem>

              <FormItem className="gap-4">
                <Label htmlFor="coleta">
                  Data e Hora de Coleta:
                </Label>

                <Input
                  disabled
                  id="coleta"
                  type="text"
                  className="flex-1"
                  value={formattedDataColeta ?? "Não houve coleta"}
                />
              </FormItem>
            </div>
          </div>

          <div className="grid gap-3 mt-auto md:grid-cols-2 xl:grid-cols-4">
            {reserva.status === "Confirmada" && (

              <CancelarReservaDialog reserva={reserva} handleCancelClick={cancelarReserva}>
                <Button variant="destructive" className="md:col-start-2 xl:col-start-4">
                  <X className="size-5 text-red" />
                  <span className="text-red text-lg font-medium leading-none">Cancelar</span>
                </Button>
              </CancelarReservaDialog>
            ) }
          </div>
        </>
      )}
    </PageContainer.Card>
  )
}