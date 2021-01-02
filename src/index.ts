import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Client } from 'discord.js'

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient
    }
  }
}

global.prisma = new PrismaClient()

const client = new Client()

client.login()
