import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo'

declare module 'discord.js' {
  interface Client {
    commandHandler: CommandHandler
    listenerHandler: ListenerHandler
  }
}

export default class Client extends AkairoClient {
  constructor() {
    super({
      restTimeOffset: 0,
    })
  }
}
