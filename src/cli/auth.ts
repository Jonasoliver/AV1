import readline from "readline/promises";
import { stdout as output } from "node:process";
import { Funcionario } from "../models/Funcionario.js";
import { NivelPermissao } from "../enums/NivelPermissao.js";
import { getFuncionarioByUsuario, listFuncionarios, upsertFuncionario } from "../utils/storage.js";

export type Session = {
  user: Funcionario;
};

export async function bootstrapAdminIfNeeded() {
  const funcs = await listFuncionarios();
  if (funcs.length === 0) {
    output.write("Nenhum usuário encontrado. Criando usuário administrador padrão...\n");
    const admin = new Funcionario(
      "F001",
      "Administrador",
      "",
      "",
      "admin",
      "admin",
      NivelPermissao.ADMINISTRADOR
    );
    await upsertFuncionario(admin);
    output.write("Usuário admin criado (usuario: admin, senha: admin).\n\n");
  }
}

export function can(user: Funcionario, ...levels: NivelPermissao[]) {
  return levels.includes(user.nivelPermissao);
}

export async function login(rl: readline.Interface): Promise<Session> {
  await bootstrapAdminIfNeeded();
  while (true) {
    const usuario = await rl.question("Usuário: ");
    const senha = await rl.question("Senha: ");
    const found = await getFuncionarioByUsuario(usuario);
    if (!found) {
      console.log("Usuário não encontrado. Tente novamente.\n");
      continue;
    }
    const user = Funcionario.fromJSON(found);
    if (user.autenticar(usuario, senha)) {
      console.log(`Bem-vindo, ${user.nome}! Permissão: ${user.nivelPermissao}.`);
      return { user };
    } else {
      console.log("Senha incorreta.\n");
    }
  }
}
