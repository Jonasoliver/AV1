# Aerocode CLI (AV1)

Sistema de linha de comando (CLI) em TypeScript para gestão do processo de produção de aeronaves (civil e militar), atendendo aos requisitos do MVP da Aerocode.

## Visão geral

O sistema permite:

- Cadastro de aeronaves com: código gerado automaticamente, modelo, tipo (COMERCIAL/MILITAR), capacidade e alcance
- Gestão de peças associadas (tipo NACIONAL/IMPORTADA e status EM_PRODUCAO/EM_TRANSPORTE/PRONTA)
- Gestão de etapas da produção (PENDENTE/ANDAMENTO/CONCLUIDA), com regras de sequência e associação de funcionários
- Cadastro e autenticação de funcionários com níveis de permissão (ADMINISTRADOR/ENGENHEIRO/OPERADOR)
- Registro de testes (ELETRICO/HIDRAULICO/AERODINAMICO) e seus resultados (APROVADO/REPROVADO)
- Geração de relatório final por aeronave em arquivo de texto
- Persistência simples em arquivo JSON (texto) no diretório `data/`

Diretórios gerados em runtime:
- `data/` — banco de dados simples em `aerocode.json`
- `reports/` — relatórios gerados: `relatorio.txt`

## Arquitetura

- `src/cli.ts` — ponto de entrada do CLI (orquestra o loop do menu)
- `src/cli/auth.ts` — autenticação, bootstrap do admin e checagem de permissão
- `src/cli/menu.ts` — construção do menu por permissão
- `src/cli/handlers.ts` — handlers de cada ação do menu (cadastro, listagens, etc.)
- `src/cli/prompts.ts` — prompts e mapeamento de entradas para enums/valores
- `src/utils/storage.ts` — persistência em arquivo JSON e geração de IDs/códigos
- `src/models/*` — modelos (Aeronave, Peca, Etapa, Funcionario, Teste, Relatorio)
- `src/enums/*` — enumerações do domínio

Tecnologias e configurações:
- TypeScript + ESM (NodeNext)
- `tsconfig.json` com `module: nodenext`, `rootDir: src`, `outDir: dist`
- `package.json` com `"type": "module"`

## Pré-requisitos

- Node.js LTS (versão 18 pra cima)

## Instalação

No PowerShell (Windows):

```powershell
npm install
```

## Desenvolvimento

Compilar uma vez:

```powershell
npm run build
```

Compilar em watch (recompila a cada alteração):

```powershell
npm run dev
```

## Execução

Após compilar, execute o CLI:

```powershell
npm start
```

Primeira execução:
- Se não houver usuários, um administrador padrão é criado automaticamente: `usuario: admin`, `senha: admin`.

## Fluxo de uso (resumo)

1. Login com um usuário válido (admin/admin na primeira execução)
2. Como administrador, cadastre funcionários e aeronaves
3. Associe peças, etapas e funcionários às etapas
4. Registre testes e seus resultados
5. Gere relatório final da aeronave (salvo em `reports/`)

## Persistência e relatórios

- Banco: `data/aerocode.json` (criado automaticamente)
- Relatórios: `reports/relatorio_<CODIGO>.txt`

Observação: ambos os diretórios são gerados em tempo de execução e estão no `.gitignore`.

## Scripts disponíveis

- `npm run build` — compila TypeScript para `dist/`
- `npm run dev` — compila em watch
- `npm start` — executa `dist/main.js` (que inicia o CLI)

