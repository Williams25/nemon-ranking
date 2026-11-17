const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("../database/db");

const PADMIN_ROLE = "Nobre";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("painel-admin")
    .setDescription("Abre o painel de administração de um evento (apenas Nobre)")
    .addIntegerOption((opt) =>
      opt.setName("evento_id").setDescription("ID do evento").setRequired(true)
    ),

  async execute(interaction) {
    const hasPAdmin = interaction.member?.roles?.cache?.some((r) => r.name === PADMIN_ROLE);
    if (!hasPAdmin) {
      return interaction.reply({
        content: `❌ Você precisa do cargo **${PADMIN_ROLE}** para usar este comando.`,
        ephemeral: true,
      });
    }

    const eventId = interaction.options.getInteger("evento_id");
    const event = db.getEventById(eventId);

    if (!event) {
      return interaction.reply({ content: `❌ Evento \`${eventId}\` não encontrado.`, ephemeral: true });
    }
    if (!event.is_open) {
      return interaction.reply({ content: `🔒 Evento **${event.name}** está encerrado.`, ephemeral: true });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`aa:${eventId}`)
        .setLabel("➕ Adicionar Membros")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`ar:${eventId}`)
        .setLabel("➖ Remover Membros")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({
      content: `🛠️ **Painel Admin — ${event.name}** (ID \`${eventId}\`)`,
      components: [row],
      ephemeral: true,
    });
  },
};
