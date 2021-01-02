import { Command } from 'discord-akairo'
import { CategoryChannel } from 'discord.js'
import { TextChannel } from 'discord.js'
import { Message } from 'discord.js'

export default class extends Command {
  constructor() {
    super('delete', {
      aliases: ['삭제', 'delete'],
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
    if (!ticket) return msg.reply('티켓이 아니네요!')
    if (!ticket.closed) return msg.reply('닫힌 티켓만 삭제 가능해요!')
    const category = msg.guild!.channels.cache.get(
      process.env.CATEGORY_CLOSED!,
    ) as CategoryChannel
    if (!category)
      return msg.reply(
        '봇 설정이 잘못되었어요! 카테고리 설정이 정상인지 확인해주세요.',
      )
    await prisma.ticket.delete({
      where: {
        id: ticket.id,
      },
    })
    await msg.channel.delete()
  }
}
