import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo'
import Dokdo from 'dokdo'
import path from 'path'

declare module 'discord.js' {
  interface Client {
    commandHandler: CommandHandler
    listenerHandler: ListenerHandler
    dokdo: Dokdo
  }
}

export default class Client extends AkairoClient {
  constructor() {
    super({
      restTimeOffset: 0,
    })
    this.commandHandler = new CommandHandler(this, {
      directory: path.join(__dirname, 'commands'),
      prefix: process.env.PREFIX,
    })
    this.listenerHandler = new ListenerHandler(this, {
      directory: path.join(__dirname, 'listeners'),
    })
    this.listenerHandler.setEmitters({
      client: this,
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
    })
    this.listenerHandler.loadAll()
    this.commandHandler.loadAll()
  }
}
