(function() {

  // addExtensionWrapper will be toStringed and injected into and run directly
  // in the developer tools page. There, for Chrome 16 or newer, use
  // addExtension to insert our extension into the remote devtools page.

  function addExtensionWrapper(url)
  {
    if (typeof addExtension === 'function') {
      addExtension(url);
      console.log('PageSpeed injected into a devtools page.');
    } else {
      console.log('Cannot add extension PageSpeed to devtools.');
    }
  }

  // Create a link to the PageSpeed landing page.
  var pagespeedURL = escape(chrome.extension.getURL('devtools-page.html'));

  var script = document.createElement('script');
  script.innerText = ('(' + addExtensionWrapper.toString() +
                      ")(unescape('" + pagespeedURL + "'));");
  document.body.appendChild(script);

})();

