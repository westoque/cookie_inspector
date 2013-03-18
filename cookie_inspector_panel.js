(function(window) {

  var myDataSource = new YAHOO.util.DataSource([]);
  myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
  myDataSource.responseSchema = {
      fields: ["name", "value", "domain",
        "size", "path", "expirationDate",
        "httpOnly", "secure"
      ]
  };

  // Custom sort
  var sortSize = function(a, b, desc) {
    var aSize = parseInt(a.getData('name').length + a.getData('value').length, 10);
    var bSize = parseInt(b.getData('name').length + b.getData('value').length, 10);
    return YAHOO.util.Sort.compare(aSize, bSize, desc);
  };

  // Custom formatters
  var domainFormatter = function(elLiner, oRecord, oColumn, oData) { 
    if (oData) {
      elLiner.innerHTML = '<div style="color: blue;">' + oData + '</div>';
    }
  };

  var sizeFormatter = function(elLiner, oRecord, oColumn, oData) { 
    elLiner.innerHTML =
      parseInt(oRecord.getData('name').length +
       oRecord.getData('value').length, 10) + ' B';
  };

  var expiresFormatter = function(elLiner, oRecord, oColumn, oData) { 
    if (YAHOO.lang.isValue(oData)) {
      elLiner.innerHTML = (new Date(oData * 1000)).toString();
    } else {
      elLiner.innerHTML = '<div style="color: green;">Session</div>';
    }
  };

  var httpOnlyFormatter = function(elLiner, oRecord, oColumn, oData) { 
    if (oData) {
      elLiner.innerHTML = '<div style="color: green;">HttpOnly</div>';
    }
  };

  var secureFormatter = function(elLiner, oRecord, oColumn, oData) { 
    if (oData) {
      elLiner.innerHTML = 'Secure';
    }
  };

  YAHOO.widget.DataTable.Formatter.domain   = domainFormatter;
  YAHOO.widget.DataTable.Formatter.size     = sizeFormatter;
  YAHOO.widget.DataTable.Formatter.expires  = expiresFormatter;
  YAHOO.widget.DataTable.Formatter.httpOnly = httpOnlyFormatter;
  YAHOO.widget.DataTable.Formatter.secure   = secureFormatter;

  var App = {

    DATA_SOURCE: myDataSource,

    COLUMN_DEFS: [
      {
        key:"name",
        label: 'Name',
        sortable:true,
        resizeable:true,
        width: 80,
        editor: new YAHOO.widget.TextboxCellEditor({disableBtns: true})
      },
      {
        key:"value",
        label: 'Value',
        sortable:true,
        resizeable:true,
        width: 400,
        editor: new YAHOO.widget.TextboxCellEditor({disableBtns: true})
      },
      {
        key:"domain",
        label: 'Domain',
        sortable:true,
        resizeable:true,
        width: 100,
        formatter: YAHOO.widget.DataTable.Formatter.domain,
        editor: new YAHOO.widget.TextboxCellEditor({disableBtns: true})
      },
      {
        key:"size",
        label: 'Size',
        sortable:true,
        resizeable:true,
        width: 50,
        formatter: YAHOO.widget.DataTable.Formatter.size,
        sortOptions: {sortFunction: sortSize}
      },
      {
        key:"path",
        label: 'Path',
        sortable:true,
        resizeable:true,
        width: 20,
        editor: new YAHOO.widget.TextboxCellEditor()
      },
      {
        key:"expirationDate",
        label: 'Expires',
        sortable:true,
        resizeable:true,
        width: 230,
        formatter: YAHOO.widget.DataTable.Formatter.expires
      },
      {
        key:"httpOnly",
        label: 'HttpOnly',
        sortable:true,
        resizeable:true,
        width: 50,
        formatter: YAHOO.widget.DataTable.Formatter.httpOnly
      },
      {
        key:"secure",
        label: 'Security',
        sortable:true,
        resizeable:true,
        width: 50,
        formatter: YAHOO.widget.DataTable.Formatter.secure
      }
    ],

    run: function() {
      this._listenToMessagesFromBackground();
      this._createTable();
      this._sendSaveListenerMessage();
      this._sendGetCookiesMessage();
      this._initFooterControls();
    },

    _initFooterControls: function() {
      var addCookieButton = new YAHOO.widget.Button({
        id: 'pushbutton7',
        label: 'Add',
        container: 'add-cookie-button'
      });

      addCookieButton.on("click", function() {
        YAHOO.util.Dom.setStyle('add-cookie-form', 'display', 'block');
      });

      var cancelAddCookieButton = new YAHOO.widget.Button({
        id: 'cancel-add-cookie-button',
        label: 'Cancel',
        container: 'cancel-add-cookie-button-container'
      });

      cancelAddCookieButton.on("click", function() {
        YAHOO.util.Dom.setStyle('add-cookie-form', 'display', 'none');
      });

      var submitAddCookieButton = new YAHOO.widget.Button({
        id: 'submit-add-cookie-button',
        label: 'submit',
        container: 'submit-add-cookie-button-container'
      });

      submitAddCookieButton.on("click", function() {
        YAHOO.util.Dom.setStyle('add-cookie-form', 'display', 'none');
      });
    },

    _createTable: function() {
      this.dataTable = new YAHOO.widget.ScrollingDataTable("main", this.COLUMN_DEFS, this.DATA_SOURCE, {width: '100%', height: '100%'});
      this.dataTable.subscribe("cellDblclickEvent", this.dataTable.onEventShowCellEditor); 
      this.dataTable.subscribe("editorSaveEvent", this._onEditorSaveEvent.bind(this)); 
    },

    _listenToMessagesFromBackground: function() {
      this.port = chrome.extension.connect({name: 'billy'});
      this.port.onMessage.addListener(this._onPortMessageReceived.bind(this));
    },

    _onPortMessageReceived: function(msg) {
      var command = msg.command;

      if (command === 'reset') {
        var length = this.dataTable.getRecordSet().getLength();
        this.dataTable.deleteRows(0,length);
        this.dataTable.addRows(msg.options.cookies);
      }
    },

    _sendSaveListenerMessage: function() {
      var tabId = chrome.devtools.inspectedWindow.tabId;
      this.port.postMessage({
        command: 'saveListener',
        options: {tabId: tabId}
      });
    },

    _sendGetCookiesMessage: function() {
      var tabId = chrome.devtools.inspectedWindow.tabId;
      this.port.postMessage({
        command: 'getCookies',
        options: {tabId: tabId}
      });
    },

    _onEditorSaveEvent: function(oArgs) {
      var tabId = chrome.devtools.inspectedWindow.tabId;
      var data = oArgs.editor.getRecord().getData();
      this.port.postMessage({
        command: 'saveCookie',
        options: {
          tabId: tabId,
          data: data
        }
      });
    }

  };

  App.run();

})(window);
