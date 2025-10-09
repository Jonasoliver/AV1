import { promises as fs } from "fs";
import path from "path";
import { Aeronave } from "./Aeronave.js";
import { getReportsDir } from "../utils/storage.js";

export class Relatorio {
  gerarRelatorio(aeronave: Aeronave, cliente: string, dataEntrega: string): string {
    const linhas: string[] = [];
    linhas.push("=== Relatório Final de Aeronave ===");
    linhas.push(`Cliente: ${cliente}`);
    linhas.push(`Data de Entrega: ${dataEntrega}`);
    linhas.push("");
    linhas.push(aeronave.detalhes());
    linhas.push("");
    linhas.push("-- Peças --");
    if (aeronave.pecas.length === 0) linhas.push("(nenhuma)");
    for (const p of aeronave.pecas) {
      linhas.push(`- ${p.nome} | ${p.tipo} | ${p.fornecedor} | ${p.status}`);
    }
    linhas.push("");
    linhas.push("-- Etapas --");
    if (aeronave.etapas.length === 0) linhas.push("(nenhuma)");
    for (const e of aeronave.etapas) {
      const nomes = e.funcionarios.map((f) => f.nome).join(", ") || "(sem responsáveis)";
      linhas.push(`- ${e.nome} | prazo: ${e.prazo} | status: ${e.status} | resp: ${nomes}`);
    }
    linhas.push("");
    linhas.push("-- Testes --");
    if (aeronave.testes.length === 0) linhas.push("(nenhum)");
    for (const t of aeronave.testes) {
      linhas.push(`- ${t.tipo} | ${t.resultado}`);
    }
    linhas.push("");
    return linhas.join("\n");
  }

  async salvarEmArquivo(aeronave: Aeronave, conteudo: string): Promise<string> {
    const dir = getReportsDir();
    const file = path.join(dir, `relatorio_${aeronave.codigo}.txt`);
    await fs.writeFile(file, conteudo, "utf-8");
    return file;
  }
}
