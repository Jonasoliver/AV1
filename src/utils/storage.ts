import { promises as fs } from "fs";
import path from "path";

export interface DB {
  aeronaves: any[];
  funcionarios: any[];
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const REPORTS_DIR = path.resolve(process.cwd(), "reports");
const DB_FILE = path.join(DATA_DIR, "aerocode.json");

export async function ensureDataDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(REPORTS_DIR, { recursive: true });
}

export function getReportsDir() {
  return REPORTS_DIR;
}

export async function readDB(): Promise<DB> {
  await ensureDataDirs();
  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");
    const db = JSON.parse(raw);
    return {
      aeronaves: Array.isArray(db.aeronaves) ? db.aeronaves : [],
      funcionarios: Array.isArray(db.funcionarios) ? db.funcionarios : [],
    } as DB;
  } catch (e) {
    // initialize
    const empty: DB = { aeronaves: [], funcionarios: [] };
    await writeDB(empty);
    return empty;
  }
}

export async function writeDB(db: DB): Promise<void> {
  await ensureDataDirs();
  const content = JSON.stringify(db, null, 2);
  await fs.writeFile(DB_FILE, content, "utf-8");
}

export async function generateAeronaveCode(): Promise<string> {
  const db = await readDB();
  const prefix = "AER";
  let max = 0;
  for (const a of db.aeronaves) {
    const m = typeof a.codigo === "string" ? a.codigo.match(/AER(\d+)/) : null;
    if (m) {
      const n = parseInt(m[1], 10);
      if (!Number.isNaN(n)) max = Math.max(max, n);
    }
  }
  const next = max + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

export async function generateFuncionarioId(): Promise<string> {
  const db = await readDB();
  const prefix = "F";
  let max = 0;
  for (const f of db.funcionarios) {
    const m = typeof f.id === "string" ? f.id.match(/^F(\d+)/) : null;
    if (m) {
      const n = parseInt(m[1], 10);
      if (!Number.isNaN(n)) max = Math.max(max, n);
    }
  }
  const next = max + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

export async function upsertAeronave(aeronave: any): Promise<void> {
  const db = await readDB();
  const idx = db.aeronaves.findIndex((x) => x.codigo === aeronave.codigo);
  if (idx >= 0) db.aeronaves[idx] = aeronave;
  else db.aeronaves.push(aeronave);
  await writeDB(db);
}

export async function listAeronaves(): Promise<any[]> {
  const db = await readDB();
  return db.aeronaves;
}

export async function getAeronaveByCodigo(codigo: string): Promise<any | undefined> {
  const db = await readDB();
  return db.aeronaves.find((x) => x.codigo === codigo);
}

export async function upsertFuncionario(func: any): Promise<void> {
  const db = await readDB();
  const idx = db.funcionarios.findIndex((x) => x.id === func.id);
  if (idx >= 0) db.funcionarios[idx] = func;
  else db.funcionarios.push(func);
  await writeDB(db);
}

export async function listFuncionarios(): Promise<any[]> {
  const db = await readDB();
  return db.funcionarios;
}

export async function getFuncionarioByUsuario(usuario: string): Promise<any | undefined> {
  const db = await readDB();
  return db.funcionarios.find((x) => x.usuario === usuario);
}
