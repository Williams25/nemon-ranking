require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

// Valida variáveis obrigatórias antes de qualquer coisa
const REQUIRED_ENV = ["DISCORD_TOKEN", "CLIENT_ID", "GUILD_ID"];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`❌ Variáveis de ambiente ausentes no .env: ${missing.join(", ")}`);
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Carrega comandos com proteção contra arquivos malformados
const commandsPath = path.join(__dirname, "commands");
for (const file of fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"))) {
  try {
    const command = require(path.join(commandsPath, file));
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    } else {
      console.warn(`⚠️  Comando ignorado (data/execute ausente): ${file}`);
    }
  } catch (err) {
    console.error(`❌ Falha ao carregar comando ${file}:`, err);
  }
}

// Carrega eventos
const eventsPath = path.join(__dirname, "events");
for (const file of fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js"))) {
  try {
    const event = require(path.join(eventsPath, file));
    const handler = (...args) => event.execute(...args, client.commands);
    if (event.once) {
      client.once(event.name, handler);
    } else {
      client.on(event.name, handler);
    }
  } catch (err) {
    console.error(`❌ Falha ao carregar evento ${file}:`, err);
  }
}

// Captura rejeições não tratadas para evitar crash silencioso
process.on("unhandledRejection", (err) => {
  console.error("Rejeição não tratada:", err);
});

client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.error("❌ Falha ao autenticar o bot:", err.message);
  process.exit(1);
});
