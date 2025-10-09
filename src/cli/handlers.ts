import readline from "readline/promises";
import { Aeronave } from "../models/Aeronave.js";
import { Peca } from "../models/Peca.js";
import { Etapa } from "../models/Etapa.js";
import { Funcionario } from "../models/Funcionario.js";
import { Teste } from "../models/Teste.js";
import { Relatorio } from "../models/Relatorio.js";
import { StatusEtapa } from "../enums/StatusEtapa.js";
import { listAeronaves, listFuncionarios, upsertAeronave, generateAeronaveCode, getAeronaveByCodigo, upsertFuncionario, generateFuncionarioId } from "../utils/storage.js";
import { NivelPermissao } from "../enums/NivelPermissao.js";
import { promptNumber, promptResultadoTeste, promptStatusPeca, promptTipoAeronave, promptTipoPeca, promptTipoTeste } from "./prompts.js";

export async function cadastrarFuncionario(rl: readline.Interface) {
  const nome = await rl.question("Nome: ");
  const telefone = await rl.question("Telefone: ");
  const endereco = await rl.question("Endereço: ");
  const usuario = await rl.question("Usuário: ");
  const senha = await rl.question("Senha: ");
  const nivelStr = await rl.question("Nível (1=ADMINISTRADOR, 2=ENGENHEIRO, 3=OPERADOR): ");
  const nivel = nivelStr.trim() === "1" ? NivelPermissao.ADMINISTRADOR : nivelStr.trim() === "2" ? NivelPermissao.ENGENHEIRO : NivelPermissao.OPERADOR;

  const id = await generateFuncionarioId();
  const f = new Funcionario(id, nome, telefone, endereco, usuario, senha, nivel);
  await upsertFuncionario(f);
  console.log("Funcionário cadastrado.\n");
}

export async function cadastrarAeronave(rl: readline.Interface) {
  const codigo = await generateAeronaveCode();
  console.log(`Código gerado: ${codigo}`);
  const modelo = await rl.question("Modelo: ");
  const tipo = await promptTipoAeronave(rl);
  const capacidade = await promptNumber(rl, "Capacidade (número): ");
  const alcance = await promptNumber(rl, "Alcance (km): ");
  const a = new Aeronave(codigo, modelo, tipo, capacidade, alcance);
  await upsertAeronave(a);
  console.log("Aeronave cadastrada.\n");
}

export async function listarAeronavesCLI() {
  const arr = await listAeronaves();
  if (arr.length === 0) {
    console.log("Nenhuma aeronave cadastrada.\n");
    return;
  }
  for (const a of arr) {
    const an = Aeronave.fromJSON(a);
    console.log(an.detalhes());
    console.log("-");
  }
}

export async function selecionarAeronave(rl: readline.Interface) {
  const arr = await listAeronaves();
  if (arr.length === 0) {
    console.log("Nenhuma aeronave cadastrada.\n");
    return undefined;
  }
  console.log("Aeronaves:");
  arr.forEach((a) => console.log(`- ${a.codigo} | ${a.modelo}`));
  const codigo = await rl.question("Digite o código da aeronave: ");
  const raw = await getAeronaveByCodigo(codigo.trim());
  if (!raw) {
    console.log("Aeronave não encontrada.\n");
    return undefined;
  }
  return Aeronave.fromJSON(raw);
}

export async function adicionarPeca(rl: readline.Interface) {
  const aeronave = await selecionarAeronave(rl);
  if (!aeronave) return;
  const nome = await rl.question("Nome da peça: ");
  const tipo = await promptTipoPeca(rl);
  const fornecedor = await rl.question("Fornecedor: ");
  const status = await promptStatusPeca(rl);
  aeronave.pecas.push(new Peca(nome, tipo, fornecedor, status));
  await upsertAeronave(aeronave);
  console.log("Peça adicionada.\n");
}

export async function atualizarStatusPecaCLI(rl: readline.Interface) {
  const aeronave = await selecionarAeronave(rl);
  if (!aeronave) return;
  if (aeronave.pecas.length === 0) {
    console.log("Esta aeronave não possui peças.\n");
    return;
  }
  console.log("Peças:");
  aeronave.pecas.forEach((p: Peca, i: number) => console.log(`${i + 1}. ${p.nome} (${p.status})`));
  const idxStr = await rl.question("Selecione a peça (número): ");
  const idx = Math.max(1, parseInt(idxStr, 10) || 1) - 1;
  const status = await promptStatusPeca(rl);
  const peca = aeronave.pecas[idx];
  if (!peca) {
    console.log("Peça inválida.\n");
    return;
  }
  peca.atualizarStatus(status);
  await upsertAeronave(aeronave);
  console.log("Status atualizado.\n");
}

export async function adicionarEtapa(rl: readline.Interface) {
  const aeronave = await selecionarAeronave(rl);
  if (!aeronave) return;
  const nome = await rl.question("Nome da etapa: ");
  const prazo = await rl.question("Prazo: ");
  const etapa = new Etapa(nome, prazo, StatusEtapa.PENDENTE);
  aeronave.etapas.push(etapa);
  await upsertAeronave(aeronave);
  console.log("Etapa adicionada.\n");
}

function previousEtapaIsConcluded(aeronave: Aeronave, index: number) {
  if (index === 0) return true; // primeira etapa pode iniciar
  const prev = aeronave.etapas[index - 1];
  return prev ? prev.status === StatusEtapa.CONCLUIDA : true;
}

export async function iniciarEtapa(rl: readline.Interface) {
  const aeronave = await selecionarAeronave(rl);
  if (!aeronave) return;
  if (aeronave.etapas.length === 0) {
    console.log("Sem etapas.\n");
    return;
  }
  aeronave.etapas.forEach((e: Etapa, i: number) => console.log(`${i + 1}. ${e.nome} (${e.status})`));
  const idxStr = await rl.question("Selecione a etapa (número): ");
  const idx = Math.max(1, parseInt(idxStr, 10) || 1) - 1;
  if (!previousEtapaIsConcluded(aeronave, idx)) {
    console.log("A etapa anterior ainda não foi concluída.\n");
    return;
  }
  const etapaI = aeronave.etapas[idx];
  if (!etapaI) {
    console.log("Etapa inválida.\n");
    return;
  }
  etapaI.iniciar();
  await upsertAeronave(aeronave);
  console.log("Etapa iniciada.\n");
}

export async function finalizarEtapa(rl: readline.Interface) {
  const aeronave = await selecionarAeronave(rl);
  if (!aeronave) return;
  if (aeronave.etapas.length === 0) {
    console.log("Sem etapas.\n");
    return;
  }
  aeronave.etapas.forEach((e: Etapa, i: number) => console.log(`${i + 1}. ${e.nome} (${e.status})`));
  const idxStr = await rl.question("Selecione a etapa (número): ");
  const idx = Math.max(1, parseInt(idxStr, 10) || 1) - 1;
  if (!previousEtapaIsConcluded(aeronave, idx)) {
    console.log("A etapa anterior ainda não foi concluída.\n");
    return;
  }
  const etapaF = aeronave.etapas[idx];
  if (!etapaF) {
    console.log("Etapa inválida.\n");
    return;
  }
  etapaF.finalizar();
  await upsertAeronave(aeronave);
  console.log("Etapa finalizada.\n");
}

export async function associarFuncionarioEtapa(rl: readline.Interface) {
  const aeronave = await selecionarAeronave(rl);
  if (!aeronave) return;
  if (aeronave.etapas.length === 0) {
    console.log("Sem etapas.\n");
    return;
  }
  aeronave.etapas.forEach((e: Etapa, i: number) => console.log(`${i + 1}. ${e.nome} (${e.status})`));
  const idxStr = await rl.question("Selecione a etapa (número): ");
  const idx = Math.max(1, parseInt(idxStr, 10) || 1) - 1;

  const funcs = (await listFuncionarios()).map(Funcionario.fromJSON);
  if (funcs.length === 0) {
    console.log("Sem funcionários.\n");
    return;
  }
  funcs.forEach((f, i) => console.log(`${i + 1}. ${f.nome} (${f.nivelPermissao})`));
  const fIdxStr = await rl.question("Selecione o funcionário (número): ");
  const fIdx = Math.max(1, parseInt(fIdxStr, 10) || 1) - 1;

  const etapa = aeronave.etapas[idx];
  const f = funcs[fIdx] as Funcionario | undefined;
  if (!etapa || !f) {
    console.log("Seleção inválida.\n");
    return;
  }
  etapa.associarFuncionario(f);
  await upsertAeronave(aeronave);
  console.log("Funcionário associado à etapa.\n");
}

export async function registrarTeste(rl: readline.Interface) {
  const aeronave = await selecionarAeronave(rl);
  if (!aeronave) return;
  const tipo = await promptTipoTeste(rl);
  const resultado = await promptResultadoTeste(rl);
  aeronave.testes.push(new Teste(tipo, resultado));
  await upsertAeronave(aeronave);
  console.log("Teste registrado.\n");
}

export async function gerarRelatorioCLI(rl: readline.Interface) {
  const aeronave = await selecionarAeronave(rl);
  if (!aeronave) return;
  const cliente = await rl.question("Nome do cliente: ");
  const dataEntrega = new Date().toISOString().slice(0, 10);
  const rel = new Relatorio();
  const conteudo = rel.gerarRelatorio(aeronave, cliente, dataEntrega);
  const file = await rel.salvarEmArquivo(aeronave, conteudo);
  console.log(`Relatório salvo em: ${file}`);
}
