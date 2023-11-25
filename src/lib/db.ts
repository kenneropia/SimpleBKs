import { Db, MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { getEnvOrThrow } from './validate'
import HttpException from '../error/http-exception'

class MongoDBSingleton {
  private static instance: MongoDBSingleton
  private client: MongoClient | null = null

  private constructor () {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance (): MongoDBSingleton {
    if (MongoDBSingleton.instance === null || MongoDBSingleton.instance === undefined) {
      MongoDBSingleton.instance = new MongoDBSingleton()
    }
    return MongoDBSingleton.instance
  }

  public async getClient (): Promise<Db> {
    if (this.client === null || this.client === undefined) {
      await this.connect()
    }
    if (this.client == null) {
      throw new HttpException(500, 'Internal server error')
    }
    return this.client.db(getEnvOrThrow('DATABASE_NAME'))
  }

  private async connect (): Promise<void> {
    let uri: string

    if (process.env.NODE_ENV === 'test') {
      const mongod = await MongoMemoryServer.create()
      uri = mongod.getUri()
    } else {
      uri = getEnvOrThrow('DATABASE_URL')
    }

    this.client = new MongoClient(uri)
    await this.client.connect()
  }
}

export const DB = MongoDBSingleton.getInstance()
