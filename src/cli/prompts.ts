import readline from "readline/promises";
import { TipoAeronave } from "../enums/TipoAeronave.js";
import { TipoPeca } from "../enums/TipoPeca.js";
import { StatusPeca } from "../enums/StatusPeca.js";
import { TipoTeste } from "../enums/TipoTeste.js";
import { ResultadoTeste } from "../enums/ResultadoTeste.js";

export async function promptTipoAeronave(rl: readline.Interface): Promise<TipoAeronave> {
  const v = await rl.question("Tipo de aeronave (1=COMERCIAL, 2=MILITAR): ");
  return v.trim() === "2" ? TipoAeronave.MILITAR : TipoAeronave.COMERCIAL;
}

export async function promptTipoPeca(rl: readline.Interface): Promise<TipoPeca> {
  const v = await rl.question("Tipo da peça (1=NACIONAL, 2=IMPORTADA): ");
  return v.trim() === "2" ? TipoPeca.IMPORTADA : TipoPeca.NACIONAL;
}

export async function promptStatusPeca(rl: readline.Interface): Promise<StatusPeca> {
  const v = await rl.question("Status da peça (1=EM_PRODUCAO, 2=EM_TRANSPORTE, 3=PRONTA): ");
  if (v.trim() === "2") return StatusPeca.EM_TRANSPORTE;
  if (v.trim() === "3") return StatusPeca.PRONTA;
  return StatusPeca.EM_PRODUCAO;
}

export async function promptTipoTeste(rl: readline.Interface): Promise<TipoTeste> {
  const v = await rl.question("Tipo de teste (1=ELETRICO, 2=HIDRAULICO, 3=AERODINAMICO): ");
  if (v.trim() === "2") return TipoTeste.HIDRAULICO;
  if (v.trim() === "3") return TipoTeste.AERODINAMICO;
  return TipoTeste.ELETRICO;
}

export async function promptResultadoTeste(rl: readline.Interface): Promise<ResultadoTeste> {
  const v = await rl.question("Resultado do teste (1=APROVADO, 2=REPROVADO): ");
  return v.trim() === "2" ? ResultadoTeste.REPROVADO : ResultadoTeste.APROVADO;
}

export async function promptNumber(rl: readline.Interface, question: string): Promise<number> {
  const s = await rl.question(question);
  return parseInt(s, 10) || 0;
}
