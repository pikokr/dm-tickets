import { Listener } from 'discord-akairo'
import { MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'

export default class extends Listener {
  constructor() {
    super('ticket', {
      emitter: 'commandHandler',
      event: 'messageInvalid',
    })
  }

  async exec(msg: Message) {
    if (msg.author.bot) return
    if (msg.channel.type !== 'text') return
    if (msg.channel.parent?.id !== process.env.CATEGORY) return
    const { prisma } = global
    const ticket = await prisma.ticket.findFirst({
      where: {
        channel: msg.channel.id,
        AND: {
          closed: false,
        },
      },
    })
    if (!ticket) return
    const user = this.client.users.cache.get(ticket.user)
    if (!user) return msg.reply('유저를 찾을 수 없습니다.')
    await user.send({
      files: msg.attachments.map((it) => it.url),
      embed:
        (msg.content &&
          new MessageEmbed().setDescription(
            `${msg.author.tag}: ${msg.content}`,
          )) ||
        undefined,
    })
    await msg.channel.send('답변이 전송되었습니다.')
  }
}
