import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Card } from "@/components/ui/card"; 
import { Table } from "@/components/ui/table";
import { ArrowRightIcon } from "@/components/icons/arrow-right-icon";

const enderecos = [
  {
    nome: "Endereço 1",
    cep: "20271-110",
    estado: "RJ",
    cidade: "Rio de Janeiro",
    logradouro: "Rua General Canabarro, 485 - Tijuca",
  },
  {
    nome: "Endereço 2",
    cep: "01311-200",
    estado: "SP",
    cidade: "São Paulo",
    logradouro: "Avenida Paulista, 1578 - Bela Vista",
  },
  {
    nome: "Endereço 2",
    cep: "01311-200",
    estado: "SP",
    cidade: "São Paulo",
    logradouro: "Avenida Paulista, 1578 - Bela Vista",
  },
  {
    nome: "Endereço 2",
    cep: "01311-200",
    estado: "SP",
    cidade: "São Paulo",
    logradouro: "Avenida Paulista, 1578 - Bela Vista",
  },
  {
    nome: "Endereço 2",
    cep: "01311-200",
    estado: "SP",
    cidade: "São Paulo",
    logradouro: "Avenida Paulista, 1578 - Bela Vista",
  },
  {
    nome: "Endereço 2",
    cep: "01311-200",
    estado: "SP",
    cidade: "São Paulo",
    logradouro: "Avenida Paulista, 1578 - Bela Vista",
  },
  {
    nome: "Endereço 2",
    cep: "01311-200",
    estado: "SP",
    cidade: "São Paulo",
    logradouro: "Avenida Paulista, 1578 - Bela Vista",
  },
  {
    nome: "Endereço 2",
    cep: "01311-200",
    estado: "SP",
    cidade: "São Paulo",
    logradouro: "Avenida Paulista, 1578 - Bela Vista",
  },
  {
    nome: "Endereço 2",
    cep: "01311-200",
    estado: "SP",
    cidade: "São Paulo",
    logradouro: "Avenida Paulista, 1578 - Bela Vista",
  },
  {
    nome: "Endereço 2",
    cep: "01311-200",
    estado: "SP",
    cidade: "São Paulo",
    logradouro: "Avenida Paulista, 1578 - Bela Vista",
  },
];

export default function EnderecosClientePage() {
  return (
    <PageContainer.List>
      <PageTitle>Endereços de Cliente 1</PageTitle>

      {/* mobile */}
      <section className="flex flex-1 flex-col gap-4 overflow-y-auto pb-4 md:hidden">
        {enderecos.map((endereco, i) => (
          <Card.Container key={i} className="py-2 px-4">
            <Card.TextContainer className="gap-0.5">
              <Card.Title>{endereco.nome}</Card.Title>
              <Card.Description>
                {`${endereco.logradouro}, ${endereco.cidade}, ${endereco.estado}`}
              </Card.Description>
            </Card.TextContainer>
          </Card.Container>
        ))}
      </section>

      {/*telas medias = md */}
      <section className="hidden flex-1 overflow-y-auto w-full md:block">
        <Table.Container>
          <Table.Header>
            <Table.Row className="hover:bg-transparent cursor-default">
              <Table.Head>Nome</Table.Head>
              <Table.Head>CEP</Table.Head>
              <Table.Head>Estado</Table.Head>
              <Table.Head>Cidade</Table.Head>
              <Table.Head>Logradouro</Table.Head>
              <Table.Head className="w-12"></Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {enderecos.map((endereco, i) => (
              <Table.Row key={i}>
                <Table.Cell>{endereco.nome}</Table.Cell>
                <Table.Cell>{endereco.cep}</Table.Cell>
                <Table.Cell>{endereco.estado}</Table.Cell>
                <Table.Cell>{endereco.cidade}</Table.Cell>
                <Table.Cell>{endereco.logradouro}</Table.Cell>
                <Table.Cell>
                  <ArrowRightIcon className="size-5" />
            </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Container>
      </section>
    </PageContainer.List>
  );
}