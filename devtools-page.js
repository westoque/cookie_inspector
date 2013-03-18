(function() {

  fetchDevToolsAPI(function(is_remote) {
    if (chromeDevTools && chromeDevTools.panels) {
      chromeDevTools.panels.create('Cookies',
                                   'pagespeed-devtools-icon.png',
                                   'CookieInspectorChromium.html');
    } else {
      alert('Chrome DevTools extension API is not available.');
    }
  });

})();
