import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import {
  fromCognitoIdentityPool,
} from '@aws-sdk/credential-provider-cognito-identity'
import MenuType, { MenuOptions } from '../components/menu/types'

export const bucketName = 'feast.coreyeatsrice.com'
const region = process.env.REACT_APP_REGION
const identityPoolId = process.env.REACT_APP_IDENTITY_POOL_ID || ''

const client = new S3Client({
  region,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region }),
    identityPoolId,
  }),
})

export const defaultState: MenuType = {
  guests: [],
  [MenuOptions.appetizer]: [],
  [MenuOptions.side]: [],
  [MenuOptions.entre]: [],
  [MenuOptions.dessert]: [],
  [MenuOptions.drinks]: [],
}

const streamToString = (stream: ReadableStream) => new Promise((resolve, reject) => {
  if (stream instanceof ReadableStream === false) {
    reject(new Error(`Expected stream to be instance of ReadableStream, but got ${typeof stream}`))
  }
  let text = ''
  const decoder = new TextDecoder('utf-8')
  const reader = stream.getReader()
  const processRead = ({ done, value }: ReadableStreamDefaultReadResult<Uint8Array>) => {
    if (done) {
      resolve(text)
      return
    }
    text += decoder.decode(value)
    reader.read().then(processRead)
  }
  reader.read().then(processRead)
})

export const eventKey = 'meal.json'

export const updateMenu = async ({ body }: { body: MenuType }): Promise<[MenuType | undefined, boolean | undefined]> => {
  try {
    const command = new PutObjectCommand({
      Body: JSON.stringify(body), Key: `meals/${eventKey}`, Bucket: bucketName, ContentType: 'application/json', ACL: 'public-read',
    })
    await client.send(command)
    return [body, undefined]
  } catch (error) {
    console.log(error)
  }
  return [undefined, true]
}

export const getMenu = async (): Promise<[MenuType, boolean | undefined]> => {
  let data = {} as MenuType
  let error = false
  try {
    const command = new GetObjectCommand({ Key: `meals/${eventKey}`, Bucket: bucketName })
    const resp = await client.send(command)
    if (resp.Body) {
      const jsonString = await streamToString(resp.Body as ReadableStream)
      if (typeof jsonString === 'string') {
        data = JSON.parse(jsonString)
      }
    }
  } catch (ex) {
    console.log(ex)
    error = true
  } finally {
    Object.keys(defaultState).forEach((key) => {
      if (!Array.isArray(data[key as keyof MenuType])) {
        data[key as keyof MenuType] = []
      }
    })
  }
  return [data, error]
}
