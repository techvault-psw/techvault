import { GoBackButton } from "@/components/go-back-button"
import { PacoteImage } from "@/components/pacote-image"
import { PageContainer } from "@/components/page-container"
import { PageTitle, PageTitleContainer } from "@/components/page-title"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/format-currency"
import { fetchReservas } from "@/redux/reservas/fetch"
import { selectReservaById } from "@/redux/reservas/slice"
import type { RootState } from "@/redux/root-reducer"
import type { AppDispatch } from "@/redux/store"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate, useParams } from "react-router"

export default function PagamentoReservaPage() {
    const { id } = useParams<{ id: string }>();

    const dispatch = useDispatch<AppDispatch>()
    const { status: statusR } = useSelector((rootReducer: RootState) => rootReducer.reservasReducer)

    useEffect(() => {
        if (['not_loaded', 'saved', 'deleted'].includes(statusR)) {
            dispatch(fetchReservas())
        }
    }, [statusR, dispatch])

    const numberId = Number(id)
    const reserva = useSelector((state: RootState) => selectReservaById(state, numberId))

    const pacote = reserva?.pacote

    const navigate = useNavigate()
    const location = useLocation()
    const { clienteAtual } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)

    useEffect(() => {
        if (!clienteAtual) {
            const fullPath = location.pathname + location.search + location.hash;
            navigate(`/login?redirectTo=${encodeURIComponent(fullPath)}`)
        }
    })

    const valorReserva = reserva?.valor ?? 0
    const taxaTransporte = 40.00
    const valorTotal = valorReserva + taxaTransporte

    if (isNaN(numberId) || !reserva || !pacote) {
        return
    }

    return (
        <PageContainer.Card>
            <PageTitleContainer>
                <GoBackButton />
                <PageTitle> Finalizar Pagamento </PageTitle>
            </PageTitleContainer>
            

            <Separator/>

            <section className="flex-1 flex flex-col justify-between gap-5 overflow-y-hidden lg:hidden">
                <div className="flex flex-col gap-5 md:overflow-y-auto custom-scrollbar-ver">
                    <div className="flex md:flex-col items-center gap-3">
                        <PacoteImage
                            pacote={pacote}
                            className="h-22 md:h-44 rounded-lg"
                        />

                        <span className="text-white text-lg md:text-xl font-semibold">{pacote.name}</span>
                    </div>

                    <Separator/>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-white text-lg">
                            <span className="font-medium">Valor do Pacote:</span>
                            <span>{formatCurrency(valorReserva)}</span>
                        </div>

                        <div className="flex items-center justify-between text-white text-lg">
                            <span className="font-medium">Taxa de Transporte:</span>
                            <span>{formatCurrency(taxaTransporte)}</span>
                        </div>

                        <Separator/>

                        <div className="flex items-center justify-between text-white text-lg">
                            <span className="font-medium">Total:</span>
                            <span className="font-semibold">{formatCurrency(valorTotal)}</span>
                        </div>
                    </div>

                    <div className="mt-auto space-y-4">
                        <h3 className="text-lg font-semibold text-white text-center">
                        Pague com <span className="text-blue">PIX</span>!
                        </h3>

                        <img src="/qrcode.png" alt="qrcode" className="size-75 md:size-50 mx-auto"/>
                    </div>
                </div>
                
                {/* TODO: Usar props para definir método de pagamento nessa página */}
                <Button asChild size="lg" className="flex-none font-bold">
                    <Link to={`/reserva-confirmada/${reserva.id}`}>Copiar Código Pix</Link>
                </Button>
            </section>

            <section className="flex-1 gap-5 overflow-y-hidden hidden lg:flex lg:gap-5">
                <div className="flex-1 flex flex-col gap-5 md:overflow-y-auto custom-scrollbar-ver">
                    <div className="flex md:flex-col items-center gap-3">
                        <PacoteImage
                            pacote={pacote}
                            className="w-8/10"
                        />

                        <span className="text-white text-2xl font-semibold">{pacote.name}</span>
                    </div>

                    <Separator/>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-white text-lg">
                            <span className="font-medium">Valor do Pacote:</span>
                            <span>{formatCurrency(valorReserva)}</span>
                        </div>

                        <div className="flex items-center justify-between text-white text-lg">
                            <span className="font-medium">Taxa de Transporte:</span>
                            <span>{formatCurrency(taxaTransporte)}</span>
                        </div>

                        <Separator/>

                        <div className="flex items-center justify-between text-white text-lg">
                            <span className="font-medium">Total:</span>
                            <span className="font-semibold">{formatCurrency(valorTotal)}</span>
                        </div>
                    </div>
                </div>

                <Separator orientation="vertical"/>

                <div className="flex flex-col gap-8 justify-center">
                    <h3 className="text-3xl font-semibold text-white text-center">
                        Pague com <span className="text-blue">PIX</span>!
                    </h3>

                    <img src="/qrcode.png" alt="qrcode" className="size-76 mx-auto"/>

                    {/* TODO: Usar props para definir método de pagamento nessa página */}
                    <Button asChild size="lg" className="flex-none font-bold">
                        <Link to={`/reserva-confirmada/${reserva.id}`}>Copiar Código Pix</Link>
                    </Button>
                </div>
            </section>

        </PageContainer.Card>
    )
}