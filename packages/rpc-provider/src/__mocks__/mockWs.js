import { Server } from 'mock-socket';

const TEST_WS_URL = 'ws://localhost:9955';

let server;

function createError({ id, error: { code, message } }) {
  return {
    id,
    jsonrpc: '2.0',
    error: {
      code,
      message,
    },
  };
}

function createReply({ id, reply: { result } }) {
  return {
    id,
    jsonrpc: '2.0',
    result,
  };
}

function mockWs(requests) {
  server = new Server(TEST_WS_URL);

  let requestCount = 0;
  const scope = {
    body: {},
    requests: 0,
    server,
    done: () =>
      server.stop(() => {
        // ignore
      }),
  };

  server.on('connection', socket => {
    // @ts-ignore definitions are wrong, this is 'on', not 'onmessage'
    socket.on('message', body => {
      const request = requests[requestCount];
      // @ts-ignore Yes, SHOULD be fixed, this is a mess
      const response = request.error
        ? // @ts-ignore Yes, SHOULD be fixed, this is a mess
          createError(request)
        : // @ts-ignore Yes, SHOULD be fixed, this is a mess
          createReply(request);

      scope.body[request.method] = body;
      requestCount++;

      socket.send(JSON.stringify(response));
    });
  });

  return scope;
}

export { TEST_WS_URL, mockWs };
