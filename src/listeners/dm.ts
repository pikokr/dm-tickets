import { Listener } from 'discord-akairo'
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
      await msg.reply(
        '티켓이 생성되었습니다. 모든 대화 내용이 관리자에게 전달됩니다.',
      )
    }
  }
}
