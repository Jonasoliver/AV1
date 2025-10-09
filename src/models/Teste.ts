import { TipoTeste } from "../enums/TipoTeste.js";
import { ResultadoTeste } from "../enums/ResultadoTeste.js";

export class Teste {
  tipo: TipoTeste;
  resultado: ResultadoTeste;

  constructor(tipo: TipoTeste, resultado: ResultadoTeste) {
    this.tipo = tipo;
    this.resultado = resultado;
  }

  salvar(): void {}
  carregar(): void {}
}
