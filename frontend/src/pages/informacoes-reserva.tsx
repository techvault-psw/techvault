import { CancelarReservaDialog } from "@/components/dialogs/cancelar-reserva-dialog"
import { HighlightBox } from "@/components/highlight-box"
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon"
import { PacoteImage } from "@/components/pacote-image"
import { PageContainer } from "@/components/page-container"
import { PageTitle } from "@/components/page-title"
import { Button } from "@/components/ui/button"
import { FormItem } from "@/components/ui/form"
import { Input, Label } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { pacotes } from "@/consts/pacotes"
import { formatCurrency } from "@/lib/format-currency"
import { deleteReserva } from "@/redux/reservas/slice"
import type { RootState } from "@/redux/root-reducer"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { X } from "lucide-react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router"

export default function InformacoesReservasPage() {
  
  const { reservas } = useSelector((rootReducer : RootState) => rootReducer.reservasReducer)
  const { id } = useParams<{ id: string }>();
  
  const numberId = Number(id)
  
  if (isNaN(numberId) || numberId >= reservas.length) {
    return
  }
  
  const reserva = reservas[numberId]
  const pacote = pacotes[reserva.pacoteIndex]
  const formattedValue = formatCurrency(reserva.valor)
  const formattedStartDate = format(reserva.dataInicio, "dd/MM/yyyy HH:mm", {locale: ptBR})
  const formattedEndDate = format(reserva.dataTermino, "dd/MM/yyyy HH:mm", {locale: ptBR})
  

  
  const navigate = useNavigate()
  
  const dispatch = useDispatch()

  const cancelarReserva = () => {
    navigate("/minhas-reservas")
    dispatch(deleteReserva(numberId))
  }

  const { clienteAtual } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)

  useEffect(() => {
    if (!clienteAtual) {
      navigate("/login")
    }
  }, [])

  return (
    <PageContainer.Card>
      <PageTitle>
        Reserva
      </PageTitle>

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

            <FormItem>
              <Label htmlFor="endereco">
                Endereço de Entrega:
              </Label>

              <Input
                disabled
                id="endereco"
                type="text"
                value="Faculdade"
              />
            </FormItem>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4 md:flex-row">
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
        </div>
      </div>

      <div className="grid gap-3 mt-auto md:grid-cols-2 xl:grid-cols-4">
        <CancelarReservaDialog reserva={reserva} handleCancelClick={cancelarReserva}>
          <Button variant="destructive" className="md:order-2 xl:col-start-3">
            <X className="size-5 text-red" />
            <span className="text-red text-lg font-medium leading-none">Cancelar</span>
          </Button>
        </CancelarReservaDialog>

        <Button variant="outline" className="md:order-1 xl:col-start-2" asChild>
          <Link to="/minhas-reservas">
            <ArrowLeftIcon className="size-5" />
            <span className="text-white text-lg font-medium leading-none">Voltar</span>
          </Link>
        </Button>
      </div>
    </PageContainer.Card>
  )
}