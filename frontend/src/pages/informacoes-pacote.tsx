import { HighlightBox } from "@/components/highlight-box";
import { PacoteImage } from "@/components/pacote-image";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { pacotes } from "@/consts/pacotes";
import { formatCurrency } from "@/lib/format-currency";
import { Link, useParams } from "react-router";

export default function InformacoesPacotePage() {
  const { id } = useParams<{ id: string }>();

  const numberId = Number(id)

  if (isNaN(numberId) || numberId >= pacotes.length) {
    return
  }

  const pacote = pacotes[numberId]
  const formattedValue = formatCurrency(pacote.value)

  return (
    <PageContainer.Card>
      <div className="flex flex-col items-center gap-3">
        <PacoteImage pacote={pacote} className="max-w-full h-55 md:h-66 xl:h-77 rounded-lg md:rounded-xl border-gray/30" />

        <PageTitle className="sm:text-4xl font-semibold">{pacote.name}</PageTitle>
      </div>

      <Separator />

      <div className="flex flex-col gap-4 md:overflow-y-auto md:pr-1 custom-scrollbar-ver">
        <div className="text-white flex flex-col gap-1">
          <span className="font-bold text-xl">Descrição</span>

          {pacote.description.map((paragraph) => (
            <p className="text-sm lg:text-base">{paragraph}</p>
          ))}
        </div>
        
        <div className="text-white flex flex-col gap-1">
          <span className="font-bold text-xl">Componentes do PC</span>

          <ul className="list-disc text-sm ml-5 lg:text-base">
            {pacote.components.map((component, i) => {
              return (
                <li>{component + (i == pacote.components.length - 1 ? '.' : ';')}</li>
              )
            })}
          </ul>
        </div>
      </div>

      <p className="text-xs text-white text-center md:text-base md:max-w-8/10 md:mx-auto mt-auto">
        OBS: Todos os pacotes acompanham no-break para proteção contra falhas na rede elétrica.
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <HighlightBox className="md:w-1/2 lg:w-1/3">
          Valor (hora): {formattedValue}
        </HighlightBox>

        <Button size="lg" className="md:w-2/3" asChild>
          <Link to="/confirmar-reserva">
            Solicitar Reserva
          </Link>
        </Button>
      </div>
    </PageContainer.Card>
  );
}