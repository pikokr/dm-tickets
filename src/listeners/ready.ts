import { Listener } from 'discord-akairo'
import { Team } from 'discord.js'
import { User } from 'discord.js'
import Dokdo from 'dokdo'

export default class extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
    })
  }

  async exec() {
    const app = await this.client.fetchApplication()
    if (app.owner instanceof User) {
      this.client.ownerID = [app.owner.id]
    } else if (app.owner instanceof Team) {
      this.client.ownerID = app.owner.members.map((r) => r.id)
    }
    this.client.dokdo = new Dokdo(this.client, {
      noPerm(msg) {
        return msg.react('🚫')
      },
      prefix: process.env.COMMAND_PREFIX,
      owners: this.client.ownerID as string[],
    })
    this.client.on('message', (msg) => this.client.dokdo!.run(msg))
    console.log('Bot ready.')
  }
}
