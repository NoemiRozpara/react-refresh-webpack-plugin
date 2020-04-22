if (process.env.NODE_ENV !== 'production' && typeof global !== 'undefined') {
  const Refresh = require('react-refresh/runtime');

  // Inject refresh runtime into global
  Refresh.injectIntoGlobalHook(global);

  // Setup placeholder functions
  global.$RefreshReg$ = function () {};
  global.$RefreshSig$ = function () {
    return function (type) {
      return type;
    };
  };

  /**
   * Setup module refresh.
   * @param {number} moduleId An ID of a module.
   * @returns {function(): void} A function to restore handlers to their previous state.
   */
  global.$RefreshSetup$ = function setupModuleRefresh(moduleId) {
    // Capture previous refresh state
    const prevRefreshReg = global.$RefreshReg$;
    const prevRefreshSig = global.$RefreshSig$;

    /**
     * Registers a refresh to react-refresh.
     * @param {string} [type] A valid type of a module.
     * @param {number} [id] An ID of a module.
     * @returns {void}
     */
    global.$RefreshReg$ = function (type, id) {
      const typeId = moduleId + ' ' + id;
      Refresh.register(type, typeId);
    };

    /**
     * Creates a module signature function from react-refresh.
     * @returns {function(string): string} A created signature function.
     */
    global.$RefreshSig$ = Refresh.createSignatureFunctionForTransform;

    // Restore to previous refresh functions after initialization
    return function cleanup() {
      global.$RefreshReg$ = prevRefreshReg;
      global.$RefreshSig$ = prevRefreshSig;
    };
  };
}
