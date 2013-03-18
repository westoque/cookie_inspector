(function() {

  var Background = {

    listeners: {},

    init: function() {
      this._listenToConnect();
      this._listenToNavigate();
      this._listenToOnCommitted();
    },

    _listenToConnect: function() {
      chrome.extension.onConnect.addListener(this._onConnect.bind(this));
    },

    _listenToNavigate: function() {
      chrome.webNavigation.onBeforeNavigate.addListener(this._onNavigate.bind(this));
    },

    _listenToOnCommitted: function() {
      chrome.webNavigation.onDOMContentLoaded.addListener(this._onDOMContentLoaded.bind(this));
    },

    _onNavigate: function(details) {
      var tabId = details.tabId;
      var port = this.listeners[tabId];
      if (port) {
        port.postMessage({command: 'reset', options: {cookies: []}});
      }
    },

    _onDOMContentLoaded: function(details) {
      var tabId = details.tabId;
      var port = this.listeners[tabId];
      if (port) {
        chrome.tabs.getSelected(null, function(tab) {
          chrome.cookies.getAll({url: tab.url}, function(cookies) {
            port.postMessage({command: 'reset', options: {cookies: cookies}});
          });
        });
      }
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
      var tabId,
          data,
          command = msg.command;

      if (command === 'saveListener') {
        tabId = msg.options.tabId;
        this.listeners[tabId] = port;
        port.onDisconnect.addListener(function() {
          delete this.listeners[tabId];
        }.bind(this));
      }

      if (command === 'getCookies') {
        tabId = msg.options.tabId;
        chrome.tabs.get(tabId, function(tab) {
          chrome.cookies.getAll({url: tab.url}, function(cookies) {
            port.postMessage({command: 'reset', options: {cookies: cookies}});
          });
        });
      }

      if (command === 'saveCookie') {
        tabId   = msg.options.tabId;
        oldData = msg.options.data;
        chrome.tabs.get(tabId, function(tab) {
          var details = {
            url: tab.url,
            name: oldData.name
          };
          chrome.cookies.remove(details, function() {
            this._onCookiesRemoved.apply(this, [tab.url, oldData]);
          }.bind(this));
        }.bind(this));
      }
    },

    _onCookiesRemoved: function(url, details) {
      var newDetails = {
        url: url,
        name: details.name,
        value: details.value,
        domain: details.domain,
        path: details.path,
        secure: details.secure,
        httpOnly: details.httpOnly,
        expirationDate: details.expirationDate,
        storeId: details.storeId
      };
      chrome.cookies.set(newDetails);
    }

  };

  Background.init();

})();
