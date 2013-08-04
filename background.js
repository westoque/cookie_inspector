(function() {

  var routeMap = {

    'GET /cookies': function(params, render) {
      chrome.tabs.get(params.tabId, function(tab) {
        chrome.cookies.getAll({url: tab.url}, function(cookies) {
          console.log('Completed ', cookies);
          render(cookies);
        });
      });
    },

    'POST /cookies': function(params, sendResponse) {
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

        console.log(details);

        chrome.cookies.set(details, function(cookie) {
          sendResponse(cookie);
        });
      });
    }

  };

  var Background = {

    init: function() {
      chrome.extension.onMessage.addListener(this._onMessageReceived);
    },

    _onMessageReceived: function(msg, sender, sendResponse) {
      if (!routeMap[msg.path]) {
        throw new Error('Route ' + msg.path + ' does not exist');
      }
      routeMap[msg.path](msg, sendResponse);
      return true;
    }

  };

  Background.init();

})();
