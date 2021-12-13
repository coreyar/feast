import createEventMock from 'aws-event-mocks'
import { handler as lambdaHandler } from '.'

const createEvent = (method: 'GET' | 'POST', id: string, body = {}) => createEventMock({
  template: 'aws:apiGateway',
  merge: {
    requestContext: {
      http: { method },
    },
    pathParameters: {
      id,
    },
    body,
  },
})

const contextStub = {
  callbackWaitsForEmptyEventLoop: true,
  functionName: '',
  functionVersion: '',
  invokedFunctionArn: '',
  memoryLimitInMB: '',
  awsRequestId: '',
  logGroupName: '',
  logStreamName: '',
  identity: undefined,
  clientContext: undefined,
  getRemainingTimeInMillis: () => 0,
  done: () => { },
  fail: () => { },
  succeed: () => { },
}

describe('Handler responds to HTTP methods', () => {
  beforeAll(async () => {
    jest.mock('./mongo')
  })

  test('GET retrives meal', async () => {
    const event = createEvent('GET', '123')
    await lambdaHandler(event, contextStub, () => { })
  })

  test('POST updates meal', async () => {
    const event = createEvent('POST', 'thanksgiving', {
      guests: ['Sam'],
    })
    await lambdaHandler(event, contextStub, () => { })
  })
})
