import type {
  IOClients,
  ParamsContext,
  ServiceContext,
  RecorderState,
  EventContext,
} from '@vtex/api'
import { Service } from '@vtex/api'

import { example } from './events/example'

const TREE_SECONDS_MS = 3 * 1000
const CONCURRENCY = 10

declare global {
  type Context = ServiceContext<IOClients, State>

  interface State extends RecorderState {
    code: number
  }
}

export default new Service<IOClients, State, ParamsContext>({
  clients: {
    options: {
      events: {
        exponentialTimeoutCoefficient: 2,
        exponentialBackoffCoefficient: 2,
        initialBackoffDelay: 50,
        retries: 1,
        timeout: TREE_SECONDS_MS,
        concurrency: CONCURRENCY,
      },
    },
  },
  events: {
    example,
    onSettingsChanged: (ctx: EventContext<IOClients>) =>
      ctx.vtex.logger.info(ctx.body),
  },
  routes: {
    hcheck: (ctx: any) => {
      // setCacheContext(ctx)
      ctx.set('Cache-Control', 'no-cache')
      ctx.status = 200
      ctx.body = 'ok'
    },
  },
})
