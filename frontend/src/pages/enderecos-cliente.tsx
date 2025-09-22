import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Card } from "@/components/ui/card"; 
import { Table } from "@/components/ui/table";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { enderecos, stringifyAddress, type Endereco } from "@/consts/enderecos";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/icons/arrow-right-icon";

export default function EnderecosClientePage() {
  return (
    <PageContainer.List>
      <PageTitle>Endereços de João Silva</PageTitle>

      <Separator />

      <section className="w-full flex flex-col items-center gap-4 scrollbar md:grid md:grid-cols-2 xl:grid-cols-3 lg:hidden">
        {Array(10).fill(enderecos).flat().map((endereco: Endereco, i) => (
          <Card.Container key={i} className="h-full">
            <Card.TextContainer className="h-full">
              <Card.Title>{endereco.name}</Card.Title>
              <Card.Description>
                {stringifyAddress(endereco)}
              </Card.Description>
            </Card.TextContainer>
          </Card.Container>
        ))}
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
            {Array(10).fill(enderecos).flat().map((endereco: Endereco, i) => (
              <Table.Row key={i}>
                <Table.Cell className="font-medium text-white">{endereco.name}</Table.Cell>
                <Table.Cell>{endereco.cep}</Table.Cell>
                <Table.Cell>{endereco.state}</Table.Cell>
                <Table.Cell>{endereco.city}</Table.Cell>
                <Table.Cell>{endereco.street}, {endereco.number} - {endereco.neighborhood}</Table.Cell>
                <Table.Cell>
                  <ArrowRightIcon className="size-6" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Container>
      </section>

      <Button onClick={history.back} className="w-full max-w-100 mx-auto mt-auto" variant="outline">
        <ArrowLeftIcon className="size-5" />
        Voltar
      </Button>
    </PageContainer.List>
  );
}