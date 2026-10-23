require("dotenv").config();
const fs = require("fs");

/**
 * Limpia secuencias ANSI y basura de terminal del Agente B.
 * NO toca el contenido real del JSON.
 */
function cleanANSI(text) {
  return text
    .replace(/\x1b\[[0-9;]*[A-Za-z]/g, "")   // ANSI estándar
    .replace(/\[[0-9;]*[A-Za-z]/g, "")      // Secuencias PowerShell
    .replace(/[\x00-\x1F\x7F]/g, "")        // Invisibles
    .trim();
}

/**
 * Extrae un campo STRING del JSON del Agente B.
 * Para campos numéricos (como "line") NO se usa esta función.
 */
function extractField(text, field) {
  const regex = new RegExp(`"${field}"\\s*:\\s*"([^"]*)"`);
  const match = text.match(regex);
  if (!match) return "";

  return match[1]
    .replace(/\s+/g, " ")               // normaliza espacios
    .replace(/([a-zA-Z]+)\1/g, "$1")    // elimina duplicaciones tipo "motivmotivo"
    .trim();
}

async function reportFixer() {
  console.log("ReportFixer: limpiando reporte del Agente B...\n");

  const raw = fs.readFileSync("./reports/B_BugFixAdvisor.txt", "utf8");

  // 1. Limpiar basura ANSI
  const clean = cleanANSI(raw);

  // 2. Extraer campos STRING
  let id = extractField(clean, "id");
  let file = extractField(clean, "file");
  let explanation = extractField(clean, "explanation");
  let root_cause = extractField(clean, "root_cause");
  let fix = extractField(clean, "fix");
  let validation = extractField(clean, "validation");

  // 3. Extraer "line" como número (NO usar extractField)
  const lineMatch = clean.match(/"line"\s*:\s*(\d+)/);
  let line = 0;
  if (lineMatch) {
    line = Number(lineMatch[1]);
  }

  // Normalizar barras invertidas: dejar solo una
  file = file.replace(/\\\\+/g, "\\");

  // 4. Construir JSON limpio
  const result = {
    issues: [
      {
        id,
        file,
        line,
        explanation,
        root_cause,
        fix,
        validation,
      },
    ],
  };

  // 5. Guardar JSON limpio
  fs.writeFileSync(
    "./reports/C_ReportFixer.json",
    JSON.stringify(result, null, 2),
    "utf8"
  );

  console.log("ReportFixer listo. JSON limpio generado en:");
  console.log("reports/C_ReportFixer.json\n");
}

reportFixer();
