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

  detalhes(): void {}
  salvar(): void {}
  carregar(): void {}
}
