import readline from "readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { login } from "./cli/auth.js";
import { menuPorPermissao } from "./cli/menu.js";
import { NivelPermissao } from "./enums/NivelPermissao.js";
import { associarFuncionarioEtapa, cadastrarAeronave, cadastrarFuncionario, finalizarEtapa, gerarRelatorioCLI, iniciarEtapa, listarAeronavesCLI, registrarTeste, atualizarStatusPecaCLI, adicionarPeca, adicionarEtapa } from "./cli/handlers.js";
import { listFuncionarios } from "./utils/storage.js";

export async function runCLI() {
  const rl = readline.createInterface({ input, output });
  try {
    const { user } = await login(rl);
    while (true) {
      console.log("\n" + menuPorPermissao(user));
      const op = await rl.question("Escolha uma opção: ");
      switch (op.trim()) {
        case "1":
          if (user.nivelPermissao === NivelPermissao.ADMINISTRADOR) await cadastrarFuncionario(rl);
          else console.log("Permissão negada.\n");
          break;
        case "2":
          if (user.nivelPermissao === NivelPermissao.ADMINISTRADOR) console.table(await listFuncionarios());
          else console.log("Permissão negada.\n");
          break;
        case "3":
          if (user.nivelPermissao === NivelPermissao.ADMINISTRADOR) await cadastrarAeronave(rl);
          else console.log("Permissão negada.\n");
          break;
        case "4":
          await listarAeronavesCLI();
          break;
        case "5":
          if (user.nivelPermissao === NivelPermissao.ADMINISTRADOR || user.nivelPermissao === NivelPermissao.ENGENHEIRO) await adicionarPeca(rl);
          else console.log("Permissão negada.\n");
          break;
        case "6":
          if (user.nivelPermissao === NivelPermissao.ADMINISTRADOR || user.nivelPermissao === NivelPermissao.ENGENHEIRO) await atualizarStatusPecaCLI(rl);
          else console.log("Permissão negada.\n");
          break;
        case "7":
          if (user.nivelPermissao === NivelPermissao.ADMINISTRADOR || user.nivelPermissao === NivelPermissao.ENGENHEIRO) await adicionarEtapa(rl);
          else console.log("Permissão negada.\n");
          break;
        case "8":
          if (user.nivelPermissao === NivelPermissao.ADMINISTRADOR || user.nivelPermissao === NivelPermissao.ENGENHEIRO) await iniciarEtapa(rl);
          else console.log("Permissão negada.\n");
          break;
        case "9":
          if (user.nivelPermissao === NivelPermissao.ADMINISTRADOR || user.nivelPermissao === NivelPermissao.ENGENHEIRO) await finalizarEtapa(rl);
          else console.log("Permissão negada.\n");
          break;
        case "10":
          if (user.nivelPermissao === NivelPermissao.ADMINISTRADOR || user.nivelPermissao === NivelPermissao.ENGENHEIRO) await associarFuncionarioEtapa(rl);
          else console.log("Permissão negada.\n");
          break;
        case "11":
          if (user.nivelPermissao === NivelPermissao.ADMINISTRADOR || user.nivelPermissao === NivelPermissao.ENGENHEIRO) await registrarTeste(rl);
          else console.log("Permissão negada.\n");
          break;
        case "12":
          if (user.nivelPermissao === NivelPermissao.ADMINISTRADOR) await gerarRelatorioCLI(rl);
          else console.log("Permissão negada.\n");
          break;
        case "0":
          console.log("Saindo...");
          return;
        default:
          console.log("Opção inválida.\n");
      }
    }
  } finally {
    rl.close();
  }
}
