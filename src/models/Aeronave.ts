import { TipoAeronave } from "../enums/TipoAeronave.js";
import { Peca } from "./Peca.js";
import { Etapa } from "./Etapa.js";
import { Teste } from "./Teste.js";

export class Aeronave {
  codigo: string;
  modelo: string;
  tipo: TipoAeronave;
  capacidade: number;
  alcance: number;
  pecas: Peca[];
  etapas: Etapa[];
  testes: Teste[];

  constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number) {
    this.codigo = codigo;
    this.modelo = modelo;
    this.tipo = tipo;
    this.capacidade = capacidade;
    this.alcance = alcance;
    this.pecas = [];
    this.etapas = [];
    this.testes = [];
  }

  detalhes(): string {
    const linhas: string[] = [];
    linhas.push(`Código: ${this.codigo}`);
    linhas.push(`Modelo: ${this.modelo}`);
    linhas.push(`Tipo: ${this.tipo}`);
    linhas.push(`Capacidade: ${this.capacidade}`);
    linhas.push(`Alcance: ${this.alcance}`);
    linhas.push(`Peças: ${this.pecas.length}`);
    linhas.push(`Etapas: ${this.etapas.length}`);
    linhas.push(`Testes: ${this.testes.length}`);
    return linhas.join("\n");
  }

  salvar(): void {}
  carregar(): void {}

  static fromJSON(obj: any): Aeronave {
    const a = new Aeronave(obj.codigo, obj.modelo, obj.tipo as TipoAeronave, obj.capacidade, obj.alcance);
    a.pecas = Array.isArray(obj.pecas) ? obj.pecas.map(Peca.fromJSON) : [];
    a.etapas = Array.isArray(obj.etapas) ? obj.etapas.map(Etapa.fromJSON) : [];
    a.testes = Array.isArray(obj.testes) ? obj.testes.map(Teste.fromJSON) : [];
    return a;
  }
}
