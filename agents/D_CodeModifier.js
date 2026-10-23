require("dotenv").config();
const fs = require("fs");
const path = require("path");

async function applyFix() {
  console.log("CodeModifier: aplicando corrección...\n");

  // 1. Leer el plan del Agente C
  const raw = fs.readFileSync("./reports/C_ReportFixer.json", "utf8");
  const plan = JSON.parse(raw);

  const issue = plan.issues[0];
  const explanation = issue.explanation;

  // Ruta real del archivo
  const normalizedPath = path.join(process.cwd(), "src", "index.js");

  console.log("Archivo a modificar:");
  console.log(normalizedPath + "\n");

  // 2. Leer archivo real
  let code;
  try {
    code = fs.readFileSync(normalizedPath, "utf8");
  } catch (err) {
    console.error("No se pudo abrir el archivo real. Ruta usada:");
    console.error(normalizedPath);
    return;
  }

  // 3. Crear carpeta audit_backups si no existe
  const backupDir = path.join(process.cwd(), "audit_backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  // 4. Crear backup ANTES de modificar
  const backupPath = path.join(backupDir, "index.js.backup");
  fs.copyFileSync(normalizedPath, backupPath);

  // 5. Snippet original detectado por el Agente A
  const originalSnippet = "quantity = quantity * 2";

  // 6. Snippet corregido según el Agente B/C
  const correctedSnippet = "quantity = quantity";

  // 7. Verificar si el snippet existe en el archivo
  if (!code.includes(originalSnippet)) {
    console.log("El snippet original no fue encontrado en el archivo.");
    console.log("No se aplicó ningún cambio.\n");
    return;
  }

  // 8. Aplicar reemplazo
  const updatedCode = code.replace(originalSnippet, correctedSnippet);

  // 9. Guardar archivo modificado
  fs.writeFileSync(normalizedPath, updatedCode, "utf8");

  // 10. Calcular línea del cambio (tu método original)
  const lineNumber =
    code.substring(0, code.indexOf(originalSnippet)).split("\n").length;

  console.log("Cambio aplicado correctamente.\n");
  console.log("Detalle del fix:");
  console.log("- " + explanation);
  console.log("- Reemplazo realizado:");
  console.log(`  '${originalSnippet}'  →  '${correctedSnippet}'\n`);

  // 11. Generar reporte del Agente D
  const report = `
Agente: D_CodeModifier
Archivo modificado: ${normalizedPath}
Backup generado: ${backupPath}
Línea del cambio: ${lineNumber}

Código original:
${originalSnippet}

Código nuevo:
${correctedSnippet}

Explicación del fix:
${explanation}
`;

  fs.writeFileSync("./reports/D_CodeModifier.log", report, "utf8");
  console.log("Reporte generado en reports/D_CodeModifier.log\n");
}

applyFix();
