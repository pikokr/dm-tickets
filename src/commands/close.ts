import { Command } from 'discord-akairo'
import { CategoryChannel } from 'discord.js'
import { TextChannel } from 'discord.js'
import { Message } from 'discord.js'

export default class extends Command {
  constructor() {
    super('close', {
      aliases: ['닫기', 'close'],
      channel: 'guild',
    })
  }

  async exec(msg: Message) {
    if (!(msg.channel instanceof TextChannel)) return
    const { prisma } = global
    const ticket = await prisma.ticket.findFirst({
      where: {
        channel: msg.channel.id,
      },
    })
    if (!ticket) return msg.reply('티켓이 없어요!')
    if (ticket.closed) return msg.reply('닫힌 티켓이네요!')
    const category = msg.guild!.channels.cache.get(
      process.env.CATEGORY_CLOSED!,
    ) as CategoryChannel
    if (!category)
      return msg.reply(
        '봇 설정이 잘못되었어요! 카테고리 설정이 정상인지 확인해주세요.',
      )
    await msg.channel.setParent(category)
    await prisma.ticket.update({
      data: {
        closed: true,
      },
      where: {
        id: ticket.id,
      },
    })
    const user = this.client.users.cache.get(ticket.user)
    if (user) {
      await user.send(
        '문의가 종료되었습니다. dm을 보내면 다시 문의가 접수됩니다.',
      )
    }
    await msg.reply('티켓이 닫혔습니다.')
  }
}
