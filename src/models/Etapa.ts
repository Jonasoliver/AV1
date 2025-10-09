import { StatusEtapa } from "../enums/StatusEtapa.js";
import { Funcionario } from "./Funcionario.js";

export class Etapa {
  nome: string;
  prazo: string;
  status: StatusEtapa;
  funcionarios: Funcionario[];

  constructor(nome: string, prazo: string, status: StatusEtapa) {
    this.nome = nome;
    this.prazo = prazo;
    this.status = status;
    this.funcionarios = [];
  }

  iniciar(): void {}
  finalizar(): void {}
  associarFuncionario(f: Funcionario): void {}
  listarFuncionarios(): Funcionario[] {
    return [];
  }
}
