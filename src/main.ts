import { Aeronave } from "./models/Aeronave.js";
import { TipoAeronave } from "./enums/TipoAeronave.js";

function main() {
  console.log("=== Sistema Aerocode Iniciado ===");

  const aeronave = new Aeronave("AER001", "Modelo XP-45", TipoAeronave.COMERCIAL, 180, 5000);
  console.log(aeronave);
}

main();
