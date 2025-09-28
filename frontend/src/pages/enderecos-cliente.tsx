import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Card } from "@/components/ui/card"; 
import { Table } from "@/components/ui/table";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { enderecos, stringifyAddress, type Endereco } from "@/consts/enderecos";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/icons/arrow-right-icon";
import useCargo from "@/hooks/useCargo";
import { useNavigate, useParams } from "react-router";
import { DadosEnderecoDialog } from "@/components/dialogs/dados-endereco-dialog";
import { clientes } from "@/consts/clientes";
import { useEffect } from "react";

export default function EnderecosClientePage() {
  const { id } = useParams<{ id: string }>();
  const numberId = Number(id)

  if (isNaN(numberId) || numberId >= clientes.length) {
    return
  }

  const clienteIndex = clientes.findIndex((cliente) => cliente.id == numberId)
  const cliente = clientes[clienteIndex]

  const {isGerente, isSuporte} = useCargo()

  const navigate = useNavigate()

  useEffect(() => {
    if(!isGerente() && !isSuporte()) {
      navigate("/login")
    }
  }, [])

  return (
    <PageContainer.List>
      <PageTitle>Endereços de {cliente.name}</PageTitle>

      <Separator />

      <section className="w-full flex flex-col items-center gap-4 scrollbar md:grid md:grid-cols-2 xl:grid-cols-3 lg:hidden">
        {enderecos.map((endereco: Endereco, i) => {
          if(endereco.cliente != cliente) return

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
            {enderecos.map((endereco: Endereco, i) => {
              if(endereco.cliente.id !== cliente.id) return

              return (
                <DadosEnderecoDialog endereco={endereco} key={i}>
                  <Table.Row>
                    <Table.Cell className="font-medium text-white">{endereco.name}</Table.Cell>
                    <Table.Cell>{endereco.cep}</Table.Cell>
                    <Table.Cell>{endereco.state}</Table.Cell>
                    <Table.Cell>{endereco.city}</Table.Cell>
                    <Table.Cell>{endereco.street}, {endereco.number} - {endereco.neighborhood}</Table.Cell>
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

      <Button
        onClick={() => history.back()}
        className="w-full max-w-100 mx-auto mt-auto flex-none" variant="outline"
      >
        <ArrowLeftIcon className="size-5" />
        Voltar
      </Button>
    </PageContainer.List>
  );
}