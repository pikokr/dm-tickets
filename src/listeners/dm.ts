import { Listener } from 'discord-akairo'
import { TextChannel } from 'discord.js'
import { MessageEmbed } from 'discord.js'
import { CategoryChannel } from 'discord.js'
import { Message } from 'discord.js'

export default class extends Listener {
  constructor() {
    super('dm', {
      emitter: 'client',
      event: 'message',
    })
  }

  async exec(msg: Message) {
    if (msg.channel.type !== 'dm') return
    if (msg.author.bot) return
    let channel, ticket
    const { prisma } = global
    if (
      !(await prisma.ticket.findFirst({
        where: {
          closed: false,
          AND: {
            user: msg.author.id,
          },
        },
      }))
    ) {
      const guild = this.client.guilds.cache.get(process.env.GUILD!)
      if (!guild) return
      const category = guild.channels.cache.get(process.env.CATEGORY!)
      if (!(category instanceof CategoryChannel)) return
      channel = await guild.channels.create('TICKET-INITIALIZING', {
        parent: category,
        reason: '티켓이 생성되었습니다.',
        topic: `${msg.author.tag}님의 티켓`,
      })
      ticket = await prisma.ticket.create({
        data: {
          channel: channel.id,
          user: msg.author.id,
        },
      })
      await channel.setName(`TICKET-${ticket.id}`)
      await msg.reply(
        '티켓이 생성되었습니다. 모든 대화 내용이 관리자에게 전달됩니다.',
      )
    }
    if (!ticket) {
      ticket = (await prisma.ticket.findFirst({
        where: {
          closed: false,
          AND: {
            user: msg.author.id,
          },
        },
      }))!
    }
    if (!channel) {
      const guild = this.client.guilds.cache.get(process.env.GUILD!)
      if (!guild) return
      channel = guild.channels.cache.get(ticket.channel) as TextChannel
    }
    await channel.send({
      files: msg.attachments.map((it) => it.url),
      embed:
        (msg.content &&
          new MessageEmbed().setDescription(
            `${msg.author.tag}: ${msg.content}`,
          )) ||
        undefined,
    })
    await msg.channel.send('문의가 전송되었습니다.')
  }
}
