import { HighlightBox } from "@/components/highlight-box";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Separator } from "@/components/ui/separator";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function ReservaConfirmadaPage() {
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
                    4HYDNEU
                </HighlightBox>
            </div>

            <div className="flex flex-col gap-4 min-[820px]:grid min-[820px]:grid-cols-3">
                <div className="space-y-2 [&:has(:disabled)]:opacity-75">
                    <Label htmlFor="inicio">Data e Hora de Início</Label>
                    <Input id="inicio" type="datetime-local" value="2025-09-02 18:10" disabled/>
                </div>
                <div className="space-y-2 [&:has(:disabled)]:opacity-75">
                    <Label htmlFor="termino">Data e Hora de Término</Label>
                    <Input id="termino" type="datetime-local" value="2025-09-03 21:30" disabled/>
                </div>
                <div className="space-y-2 [&:has(:disabled)]:opacity-75">
                    <Label htmlFor="endereco">Endereço de Entrega</Label>
                    <Input id="endereco" type="text" value="Endereço 1" disabled/>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
                <Button>
                    Visualizar NF-e
                </Button>
                <Button variant={"outline"}>
                    <Link to={"/minhas-reservas"}>Ver minhas reservas</Link>
                </Button>
            </div>
        </PageContainer.Card>
        </>
    )
}