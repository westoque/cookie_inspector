if (!window.DEVELOPMENT) {

  Backbone.ajax = function(request) {
    var msg = {};

    msg.path  = request.type + ' ' + request.url;
    msg.tabId = chrome.devtools.inspectedWindow.tabId;

    var onMessage = function(response) {
      try {
        request.success(response);
      } catch(e) {
        request.error(e);
      }
    };

    chrome.extension.sendMessage(msg, onMessage);
  };

}

var ci = {

  resizers: {},

  Models: {},

  Collections: {},

  Views: {},

  run: function() {
    this._listenToWindowResize();
    this._listenToResizerDrag();

    this.cookies = new ci.Collections.Cookies();

    var headerView = new ci.Views.Header({cookies: this.cookies});
    $(document.body).append(headerView.render().el);

    var contentView = new ci.Views.Content({cookies: this.cookies});
    $(document.body).append(contentView.render().el);

    var footerView = new ci.Views.Footer();
    $(document.body).append(footerView.render().el);

    // Add the resizers
    var $resizers = $('#header table th');
    for (var i = 1; i < $resizers.length; i += 1) {
      var view = new ci.Views.Resizer({$column: $resizers.eq(i)});
      view.$el.attr('data-index', i - 1);
      this.resizers[i] = view;
      $(document.body).append(view.render().el);
    }

    if (window.DEVELOPMENT) {
      this.cookies.reset([]);
    } else {
      this.cookies.fetch({reset: true});
    }
  },

  _listenToResizerDrag: function() {
    document.body.addEventListener('drag', this._onResizerDrag.bind(this), false);
  },

  _listenToWindowResize: function() {
    // window resize is said to be inefficient but in
    // this use case its alright ;)
    window.onresize = this._onWindowResize.bind(this);
  },

  _onWindowResize: function(val) {
    this.trigger('resize');
  },

  _onResizerDrag: function(e) {
    if (e.x === 0 && e.y === 0) { return; }

    var index = parseInt($(e.target).attr('data-index'));
    var thWidth = $('#header table th').eq(index)[0].offsetLeft + $('#header table th').eq(index)[0].offsetWidth;
    var difference = thWidth - e.x;
    var percentage = (difference / $('#header table').width()) * 100;

    // Resize the column
    var newColWidth = $('#header table col').eq(index).width() - percentage;
    $('#header table col').eq(index).css('width', newColWidth + '%');
    $('#content table col').eq(index).css('width', newColWidth + '%');

    var newColWidth = $('#header table col').eq(index + 1).width() + percentage;
    $('#header table col').eq(index + 1).css('width', newColWidth + '%');
    $('#content table col').eq(index + 1).css('width', newColWidth + '%');

    this.trigger('resize');
  }
};

// Make sure we get Backbone events on our
// literal object.
_.extend(ci, Backbone.Events);

// Main entry point
$(document).ready(function() {

  ci.run();

});
