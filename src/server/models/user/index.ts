export type User = {
    id?: string,
    nome: string,
    email: string,
    telefone: number,
    senha: string,
    cep: string,
    cidade: string,
    uf: string,
    endereco?: string,
    numero?: string,
    bairro?: string,
    dataInclusao: number,
    dataAtualizacao: number
}