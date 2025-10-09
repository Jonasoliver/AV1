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

  iniciar(): void {
    if (this.status === StatusEtapa.PENDENTE) this.status = StatusEtapa.ANDAMENTO;
  }

  finalizar(): void {
    if (this.status === StatusEtapa.ANDAMENTO || this.status === StatusEtapa.PENDENTE) {
      this.status = StatusEtapa.CONCLUIDA;
    }
  }

  associarFuncionario(f: Funcionario): void {
    const exists = this.funcionarios.some((x) => x.id === f.id);
    if (!exists) this.funcionarios.push(f);
  }

  listarFuncionarios(): Funcionario[] {
    return [...this.funcionarios];
  }

  static fromJSON(obj: any): Etapa {
    const e = new Etapa(obj.nome, obj.prazo, obj.status as StatusEtapa);
    e.funcionarios = Array.isArray(obj.funcionarios) ? obj.funcionarios.map(Funcionario.fromJSON) : [];
    return e;
  }
}
