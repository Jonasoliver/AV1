import { NivelPermissao } from "../enums/NivelPermissao.js";

export class Funcionario {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha: string;
  nivelPermissao: NivelPermissao;

  constructor(
    id: string,
    nome: string,
    telefone: string,
    endereco: string,
    usuario: string,
    senha: string,
    nivelPermissao: NivelPermissao
  ) {
    this.id = id;
    this.nome = nome;
    this.telefone = telefone;
    this.endereco = endereco;
    this.usuario = usuario;
    this.senha = senha;
    this.nivelPermissao = nivelPermissao;
  }

  autenticar(usuario: string, senha: string): boolean {
    return this.usuario === usuario && this.senha === senha;
  }

  salvar(): void {}
  carregar(): void {}

  static fromJSON(obj: any): Funcionario {
    return new Funcionario(
      obj.id,
      obj.nome,
      obj.telefone ?? "",
      obj.endereco ?? "",
      obj.usuario,
      obj.senha,
      obj.nivelPermissao as NivelPermissao
    );
  }
}
