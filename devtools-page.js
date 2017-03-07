(function() {

    chrome.devtools.panels.create('Cookies',
        'cookie-icon.png',
        'CookieInspectorChromium.html',

        function (panel) {
            const themeColor = chrome.devtools.panels.themeName;

            panel.onShown.addListener(function (panelWindow) {
                panelWindow.document.body.classList.add(`${themeColor}Theme`);
            });
        });

})();
