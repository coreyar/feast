import { MongoClient, Collection, Db } from 'mongodb'

const {
  MONGODB_URI = '', MONGO_DB_NAME,
} = process.env

let cachedDb: Db | null = null

const cachedCollections: Record<string, Collection> = {}

const connectToDb = async (): Promise<Db> => {
  if (cachedDb) {
    return cachedDb
  }
  const client = await MongoClient.connect(MONGODB_URI)
  cachedDb = await client.db(MONGO_DB_NAME)
  return cachedDb
}

const connectToCollection = async (collection: string): Promise<Collection> => {
  if (cachedCollections[collection]) {
    return cachedCollections[collection]
  }
  const db = await connectToDb()
  cachedCollections[collection] = db.collection('meals')
  return cachedCollections[collection]
}

const createClient = async () => {
  const meals = await connectToCollection('meals')

  const getMeal = (id: string) => meals.findOne({ _id: id })

  const updateMeal = (result: Record<string, string>) => meals.insertOne(result)

  return {
    getMeal,
    updateMeal,
  }
}

export default createClient
