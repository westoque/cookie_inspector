(function() {

  var RouteMap = {

    'POST /cookies': function(params, res) {
      var data = JSON.parse(params.data);

      chrome.tabs.get(params.tabId, function(tab) {
        var details = {
          url: tab.url,
          name: data.name,
          value: data.value,
          path: data.path,
          secure: data.secure,
          httpOnly: data.httpOnly,
          expirationDate: data.expirationDate
        };

        chrome.cookies.set(details, function(cookie) {
          res(cookie);
        });
      });
    }

  };

  var Background = {

    listeners: {},

    init: function() {
      this._listenForConnections();
      this._listenForNavigate();
      this._listenForDOMContentLoaded();
    },

    _listenForDOMContentLoaded: function() {
      chrome.webNavigation.onDOMContentLoaded.addListener(this._onDOMContentLoaded.bind(this));
    },

    _onDOMContentLoaded: function(details) {
      if (details.frameId !== 0) { return; }

      var tabId = details.tabId;
      var port = this.listeners[tabId];
      if (port) {
        chrome.tabs.get(tabId, function(tab) {
          chrome.cookies.getAll({ url: tab.url }, function(cookies) {
            port.postMessage({ command: 'cookies:read', data: { cookies: cookies } });
          });
        });
      }
    },

    _listenForConnections: function() {
      chrome.runtime.onConnect.addListener(this._onConnect.bind(this));
    },

    _onConnect: function(port) {
      port.onMessage.addListener(function() {
        // this function wrapper makes sure we pass the port
        // object along the arguments.
        var newArgs = Array.prototype.slice.call(arguments);
        newArgs.push(port);
        this._onPortMessageReceived.apply(this, newArgs);
      }.bind(this));
    },

    _onPortMessageReceived: function(msg, port) {
      console.log('MSG: ', msg);

      var tabId   = msg.tabId;
      var command = msg.command;

      if (command === 'saveListener') {
        this.listeners[tabId] = port;

        port.onDisconnect.addListener(function() {
          delete this.listeners[tabId];
        }.bind(this));
      }

      if (command === 'cookies:read') {
        chrome.tabs.get(tabId, function(tab) {
          chrome.cookies.getAll({ url: tab.url }, function(cookies) {
            port.postMessage({ command: command, data: { cookies: cookies } });
          });
        });
      }
    },

    _listenForNavigate: function() {
      chrome.webNavigation.onBeforeNavigate.addListener(this._onNavigate.bind(this));
    },

    _onNavigate: function(details) {
      if (details.frameId !== 0) { return; }

      var tabId = details.tabId;
      var port = this.listeners[tabId];
      if (port) {
        port.postMessage({ command: 'cookies:read', data: { cookies: [] } });
      }
    }

  };

  Background.init();

})();
