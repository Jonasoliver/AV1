import { Funcionario } from "../models/Funcionario.js";
import { NivelPermissao } from "../enums/NivelPermissao.js";

export function menuPorPermissao(user: Funcionario) {
  const canAdmin = user.nivelPermissao === NivelPermissao.ADMINISTRADOR;
  const base = [
    "4) Listar aeronaves",
    "5) Adicionar peça à aeronave",
    "6) Atualizar status de peça",
    "7) Adicionar etapa à aeronave",
    "8) Iniciar etapa",
    "9) Finalizar etapa",
    "10) Associar funcionário à etapa",
    "11) Registrar teste",
  ];
  const admin = [
    "1) Cadastrar funcionário",
    "2) Listar funcionários",
    "3) Cadastrar aeronave",
    "12) Gerar relatório",
  ];
  const lines = canAdmin ? [...admin, ...base] : [...base];
  return [
    "=== Aerocode CLI ===",
    `Usuário: ${user.nome} (${user.nivelPermissao})`,
    ...lines,
    "0) Sair",
  ].join("\n");
}
