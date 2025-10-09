import { TipoPeca } from "../enums/TipoPeca.js";
import { StatusPeca } from "../enums/StatusPeca.js";

export class Peca {
  nome: string;
  tipo: TipoPeca;
  fornecedor: string;
  status: StatusPeca;

  constructor(nome: string, tipo: TipoPeca, fornecedor: string, status: StatusPeca) {
    this.nome = nome;
    this.tipo = tipo;
    this.fornecedor = fornecedor;
    this.status = status;
  }

  atualizarStatus(novoStatus: StatusPeca): void {
    this.status = novoStatus;
  }

  salvar(): void {
    // A persistência ocorre via Aeronave que contém a peça.
  }

  carregar(): void {
    // A carga ocorre via Aeronave que contém a peça.
  }

  static fromJSON(obj: any): Peca {
    return new Peca(obj.nome, obj.tipo as TipoPeca, obj.fornecedor, obj.status as StatusPeca);
  }
}
