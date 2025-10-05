import { HighlightBox } from "@/components/highlight-box";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Separator } from "@/components/ui/separator";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";
import { useEffect } from "react";
import { selectAllReservas } from "@/redux/reservas/slice";

export default function ReservaConfirmadaPage() {
    const { id } = useParams<{ id: string }>();

    // const { reservas } = useSelector((rootReducer: RootState) => rootReducer.reservasReducer)
    const reservas = useSelector(selectAllReservas)

    const numberId = Number(id)
    const reserva = reservas.find((reserva) => reserva.id === numberId)

    if (isNaN(numberId) || numberId >= reservas.length || !reserva) {
        return
    }

    const formattedStartDate = format(reserva.dataInicio, "dd/MM/yyyy HH:mm", {locale: ptBR})
    const formattedEndDate = format(reserva.dataTermino, "dd/MM/yyyy HH:mm", {locale: ptBR})

    const navigate = useNavigate()
    const location = useLocation()
    const { clienteAtual } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)

    useEffect(() => {
        if (!clienteAtual) {
            const fullPath = location.pathname + location.search + location.hash;
            navigate(`/login?redirectTo=${encodeURIComponent(fullPath)}`)
        }
    })

    return (
        <>
        <PageContainer.Card>
            <PageTitle>
                Reserva confirmada
            </PageTitle>

            <Separator/>
            
            <div className="w-full md:max-w-140 md:mx-auto p-4 bg-gray/10 rounded-lg">
                <h3 className="font-bold text-white text-center leading-none text-2xl lg:text-3xl">Pagamento aprovado!</h3>
            </div>

            <p className="text-gray-2 font-medium text-lg text-center">Nossa equipe levará o pacote até você na hora combinada.</p>
            <div className="flex-1 flex flex-col gap-4 justify-center min-[820px]:pb-20">
                <p className="sm:max-w-7/10 md:max-w-1/2 lg:max-w-1/3 mx-auto text-white text-center text-light lg:text-lg">Mostre este código para o técnico da TechVault no momento da entrega:</p>

                <HighlightBox className="sm:w-min sm:px-24 sm:mx-auto md:text-2xl lg:text-3xl">
                    {reserva.codigoEntrega}
                </HighlightBox>
            </div>

            <div className="flex flex-col gap-4 min-[820px]:grid min-[820px]:grid-cols-3">
                <div className="space-y-2 [&:has(:disabled)]:opacity-75">
                    <Label htmlFor="inicio">Data e Hora de Início</Label>
                    <Input id="inicio" type="text" value={formattedStartDate} disabled/>
                </div>
                <div className="space-y-2 [&:has(:disabled)]:opacity-75">
                    <Label htmlFor="termino">Data e Hora de Término</Label>
                    <Input id="termino" type="text" value={formattedEndDate} disabled/>
                </div>
                <div className="space-y-2 [&:has(:disabled)]:opacity-75">
                    <Label htmlFor="endereco">Endereço de Entrega</Label>
                    <Input id="endereco" type="text" value="Faculdade" disabled/>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
                <Button>
                    Visualizar NF-e
                </Button>
                <Button variant={"outline"} asChild>
                    <Link to={"/minhas-reservas"}>Ver minhas reservas</Link>
                </Button>
            </div>
        </PageContainer.Card>
        </>
    )
}