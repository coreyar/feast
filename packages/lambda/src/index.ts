import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Handler } from 'aws-lambda'
import createDatabaseClient from './mongo'

interface LambdaEvent extends Omit<APIGatewayProxyEventV2, 'pathParameters'> {
  pathParameters: { id: string }
}

const main = async (method: string, id: string, body?: string) => {
  let result = {}
  const dbClient = await createDatabaseClient()
  switch (method) {
    case 'POST':
      result = { _id: id, ...JSON.parse(body || '{}') }
      dbClient.updateMeal(result)
      break
    case 'GET':
    default:
      result = dbClient.getMeal(id)
  }
  return result
}

export const handler: Handler<LambdaEvent, APIGatewayProxyResultV2> = async (event) => {
  const { requestContext, body = '{}', pathParameters } = event
  const { method } = requestContext.http
  const { id } = pathParameters

  const result = main(method, id, body)

  const response = {
    statusCode: 200,
    body: JSON.stringify(
      result,
      null,
      2,
    ),
  }

  return response
}

export default handler
