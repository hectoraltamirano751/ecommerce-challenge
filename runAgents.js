const { execSync } = require("child_process");

function runAgent(name, command) {
  console.log(`\n──────────────────────────────────────────────`);
  console.log(`Ejecutando ${name}...`);
  console.log(`──────────────────────────────────────────────\n`);

  try {
    execSync(command, { stdio: "inherit" });
  } catch (err) {
    console.error(`\nERROR ejecutando ${name}:`);
    console.error(err.message);
    process.exit(1);
  }
}

console.log("\n==============================================");
console.log("      PIPELINE DE AGENTES — PinApp Challenge");
console.log("==============================================\n");

// 1. Agente A
runAgent("Agente A — CodeReviewer", "node agents/A_CodeReviewer.js");

// 2. Agente B
runAgent("Agente B — BugFixAdvisor", "node agents/B_BugFixAdvisor.js");

// 3. Agente C
runAgent("Agente C — ReportFixer", "node agents/C_ReportFixer.js");

// 4. Agente D
runAgent("Agente D — CodeModifier", "node agents/D_CodeModifier.js");

// 5. Agente E
runAgent("Agente E — CodeAudit", "node agents/E_CodeAudit.js");

console.log("\n==============================================");
console.log("   PIPELINE COMPLETADO — Código corregido");
console.log("==============================================\n");
