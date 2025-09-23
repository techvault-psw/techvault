import { HighlightBox } from "@/components/highlight-box";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Separator } from "@/components/ui/separator";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router";
import { reservas } from "@/consts/reservas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ReservaConfirmadaPage() {
    const { id } = useParams<{ id: string }>();

    const numberId = Number(id)

    if (isNaN(numberId) || numberId >= reservas.length) {
        return
    }

    const reserva = reservas[numberId]
    const formattedStartDate = format(reserva.dataInicio, "dd/MM/yyyy HH:mm", {locale: ptBR})
    const formattedEndDate = format(reserva.dataTermino, "dd/MM/yyyy HH:mm", {locale: ptBR})

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