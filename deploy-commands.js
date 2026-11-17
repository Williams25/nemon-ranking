require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
// Routes deve vir de discord-api-types/v10 — @discordjs/rest v2 não o re-exporta
const { Routes } = require("discord-api-types/v10");

// Valida variáveis obrigatórias
const REQUIRED_ENV = ["DISCORD_TOKEN", "CLIENT_ID", "GUILD_ID"];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`❌ Variáveis de ambiente ausentes no .env: ${missing.join(", ")}`);
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, "src/commands");

for (const file of fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"))) {
  try {
    const command = require(path.join(commandsPath, file));
    if (command.data && typeof command.data.toJSON === "function") {
      commands.push(command.data.toJSON());
    } else {
      console.warn(`⚠️  Arquivo ignorado (data ausente): ${file}`);
    }
  } catch (err) {
    console.error(`❌ Falha ao carregar ${file}:`, err.message);
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Registrando ${commands.length} comandos no servidor ${process.env.GUILD_ID}...`);
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log("✅ Comandos registrados com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao registrar comandos:", err);
    process.exit(1);
  }
})();
