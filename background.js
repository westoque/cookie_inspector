(function() {

  var routeMap = {

    'GET /cookies': function(params, render) {
      chrome.tabs.get(params.tabId, function(tab) {
        chrome.cookies.getAll({url: tab.url}, function(cookies) {
          console.log('Completed ', cookies);
          render(cookies);
        });
      });
    }

  };

  var Background = {

    init: function() {
      chrome.extension.onMessage.addListener(this._onMessageReceived);
    },

    _onMessageReceived: function(msg, sender, sendResponse) {
      console.log('Started ', msg.path);
      routeMap[msg.path](msg, sendResponse);
      return true;
    }

  };

  Background.init();

})();
