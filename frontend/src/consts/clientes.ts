export type Cliente = {
  id: number;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  password: string;
  role: "Cliente" | "Gerente" | "Suporte";
}

export const clientes: Cliente[] = [
  { id: 0, name: 'Administrador', email: 'admin@email.com', phone: '(00) 00000-0000', registrationDate: '01/01/2025', password: '123456', role: 'Gerente' },
  { id: 1, name: 'Equipe de Suporte', email: 'suporte@email.com', phone: '(33) 33333-3333', registrationDate: '03/03/2025', password: '123456', role: 'Suporte' },
  { id: 2, name: 'João Silva', email: 'joao.silva@example.com', phone: '(11) 98765-4321', registrationDate: '01/09/2025', password: '123456', role: 'Cliente' },
  { id: 3, name: 'Maria Fernandes', email: 'maria.fernandes@example.com', phone: '(21) 91234-5678', registrationDate: '01/09/2025', password: '123456', role: 'Cliente' },
  { id: 4, name: 'Diogo Mendonça', email: 'diogo.mendonca@example.com', phone: '(31) 98888-7777', registrationDate: '02/09/2025', password: '123456', role: 'Cliente' },
  { id: 5, name: 'Roberto Johnson', email: 'roberto.johnson@example.com', phone: '(41) 97777-6666', registrationDate: '03/09/2025', password: '123456', role: 'Cliente' },
  { id: 6, name: 'Ana Souza', email: 'ana.souza@example.com', phone: '(51) 96666-5555', registrationDate: '03/09/2025', password: '123456', role: 'Cliente' },
  { id: 7, name: 'Carlos Pereira', email: 'carlos.pereira@example.com', phone: '(61) 95555-4444', registrationDate: '04/09/2025', password: '123456', role: 'Cliente' },
  { id: 8, name: 'Fernanda Lima', email: 'fernanda.lima@example.com', phone: '(71) 94444-3333', registrationDate: '05/09/2025', password: '123456', role: 'Cliente' },
  { id: 9, name: 'Ricardo Alves', email: 'ricardo.alves@example.com', phone: '(81) 93333-2222', registrationDate: '05/09/2025', password: '123456', role: 'Cliente' },
  { id: 10, name: 'Patrícia Gomes', email: 'patricia.gomes@example.com', phone: '(91) 92222-1111', registrationDate: '06/09/2025', password: '123456', role: 'Cliente' },
  { id: 11, name: 'Marcos Andrade', email: 'marcos.andrade@example.com', phone: '(11) 91111-0000', registrationDate: '07/09/2025', password: '123456', role: 'Cliente' },
  { id: 12, name: 'Juliana Costa', email: 'juliana.costa@example.com', phone: '(21) 99876-5432', registrationDate: '08/09/2025', password: '123456', role: 'Cliente' },
  { id: 13, name: 'Eduardo Rocha', email: 'eduardo.rocha@example.com', phone: '(31) 98765-1234', registrationDate: '09/09/2025', password: '123456', role: 'Cliente' },
  { id: 14, name: 'Beatriz Martins', email: 'beatriz.martins@example.com', phone: '(41) 97654-3210', registrationDate: '10/09/2025', password: '123456', role: 'Cliente' },
  { id: 15, name: 'Lucas Cardoso', email: 'lucas.cardoso@example.com', phone: '(51) 96543-2109', registrationDate: '11/09/2025', password: '123456', role: 'Cliente' },
  { id: 16, name: 'Camila Ribeiro', email: 'camila.ribeiro@example.com', phone: '(61) 95432-1098', registrationDate: '12/09/2025', password: '123456', role: 'Cliente' },
  { id: 17, name: 'Felipe Nunes', email: 'felipe.nunes@example.com', phone: '(71) 94321-0987', registrationDate: '13/09/2025', password: '123456', role: 'Cliente' },
  { id: 18, name: 'Aline Dias', email: 'aline.dias@example.com', phone: '(81) 93210-9876', registrationDate: '14/09/2025', password: '123456', role: 'Cliente' },
  { id: 19, name: 'Rafael Teixeira', email: 'rafael.teixeira@example.com', phone: '(91) 92109-8765', registrationDate: '15/09/2025', password: '123456', role: 'Cliente' },
  { id: 20, name: 'Sofia Barbosa', email: 'sofia.barbosa@example.com', phone: '(11) 91098-7654', registrationDate: '16/09/2025', password: '123456', role: 'Cliente' },
  { id: 21, name: 'Bruno Monteiro', email: 'bruno.monteiro@example.com', phone: '(21) 90987-6543', registrationDate: '17/09/2025', password: '123456', role: 'Cliente' },
];