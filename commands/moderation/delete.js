const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Command is used for deleting channel or role")
    /*.addChannelOption((option) =>
    option
    .setName('channel')
    .setDescription('select channel to be deleted')
    .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Select role to be deleted")
        .setRequired(false)
    ),*/
    .addSubcommand(subcommand =>
      subcommand
        .setName('channel')
        .setDescription('select channel to be deleted')
        .addChannelOption(option => option.setName('channel').setDescription('select channel to be deleted').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('role')
        .setDescription('Select role to be deleted')
        .addRoleOption(option => option.setName('role').setDescription('select role to be deleted').setRequired(true))),
  options: {
    guildOnly: false,
  },
  async execute(interaction, client) {
    if (interaction.options.getSubcommand() === "role") {
      try {
      if (!client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.id).permissions.has("MANAGE_ROLES")) {
          return interaction.reply('Missing Permissions!')
      }
      const deleteRole = interaction.options.getRole('role');
      //let deleteRole = await interaction.guild.roles.cache.find(r => r.name === role)

      if (!deleteRole) {
          return interaction.reply('Role not found!')
      }

      if (interaction.guild.me.roles.highest.postion < deleteRole.postion) {
          return interaction.reply('I cannot delete a role higher than my own roles!')
      } else if (interaction.member.roles.highest.position < deleteRole.postion) {
          return interaction.reply('You cannot delete a role higher than your own roles!!')
      }

      await deleteRole.delete()

      const roleEmbed = new MessageEmbed()
      .setTitle("Role Deleted")
      .setDescription(`
**Name:** ${deleteRole.name}
**ID:** ${deleteRole.id}
**Deleted By:** ${interaction.member.user.username}`)
      .setColor("RED")

      return interaction.reply({ embeds: [roleEmbed] })
      } catch (err) {
          console.log(err)
          return interaction.reply(`An Error Occured: ${err}`)
      }
  } else if (interaction.options.getSubcommand() === "channel") {
      try {
      if (!client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.id).permissions.has("MANAGE_CHANNELS")) {
          return interaction.reply('Missing Permissions!')
      }

      let toBeDeletedChannel = interaction.options.getChannel('channel');
      //let toBeDeletedChannel = await interaction.guild.channels.cache.find(ch => ch.name === channel)

      if (!toBeDeletedChannel) {
          return interaction.reply('Channel not found!')
      }

      await toBeDeletedChannel.delete();

      const channelEmbed = new MessageEmbed()
      .setTitle("Channel Deleted")
      .setDescription(`
**Name:** ${toBeDeletedChannel.name}
**ID:** ${toBeDeletedChannel.id}
**Deleted By:** ${interaction.member.user.username}`)
      .setColor("RED")

      return interaction.reply({ embeds: [channelEmbed] })
  } catch (err) {
      console.log(err)
      return interaction.reply(`An Error Occured: ${err}`)
  }}}
};