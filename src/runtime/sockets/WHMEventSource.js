/*
 * If the consumers' setup is to use webpack-hot-middleware with a custom express server,
 * we want to bind onto the EventSource for error tracking.
 */

/**
 * The hard-coded singleton key for webpack-hot-middleware's client instance.
 *
 * [Ref](https://github.com/webpack-contrib/webpack-hot-middleware/blob/cb29abb9dde435a1ac8e9b19f82d7d36b1093198/client.js#L152)
 */
const singletonKey = '__webpack_hot_middleware_reporter__';

/**
 * Creates a socket server for HMR according to the user's Webpack configuration.
 * @param {function(*): void} messageHandler A handler to consume Webpack compilation messages.
 * @param {*} overrides Socket integration overrides to change the connection URL.
 * @returns {void}
 */
// eslint-disable-next-line no-unused-vars
function initWHMEventSource(messageHandler, overrides) {
  const client = global[singletonKey] || require('webpack-hot-middleware/client');

  client.useCustomOverlay({
    showProblems(type, data) {
      const error = {
        type,
        data,
      };

      messageHandler(error);
    },
    clear() {
      messageHandler({ type: 'ok' });
    },
  });
}

module.exports = initWHMEventSource;
