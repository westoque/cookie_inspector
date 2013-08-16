ci.Views.ContextMenu = Backbone.View.extend({

  id: 'context-menu-view',

  events: {
    'click #add-new-cookie' : '_onAddNewCookieClick',
    'click #edit-cookie' : '_onEditCookieClick',
    'click #remove-cookie' : '_onRemoveCookieClick',
    'click #remove-all-cookies' : '_onRemoveAllCookiesClick',
    'blur' : '_onBlur'
  },

  template: function() {
    return Hogan.compile($('#context-menu-tmpl').text());
  },

  initialize: function(attrs) {
    this.x = attrs.x;
    this.y = attrs.y;
  },

  render: function() {
    this.$el.html(this.template().render());
    this.$el.css('top', this.y);
    this.$el.css('left', this.x);
    this.$el.attr('tabindex', '0');
    return this;
  },

  _onAddNewCookieClick: function(event) {
    event.preventDefault();
    this.remove();

    var today = new Date();
    var oneYearFromToday = new Date(today.getFullYear() + 1, today.getMonth() + 1, today.getDate());
    chrome.devtools.inspectedWindow.eval('window.document.domain', function(domain) {
      var cookie = new ci.Models.Cookie({
        domain: domain,
        expirationDate: (oneYearFromToday.getTime() / 1000),
        hostOnly: false,
        httpOnly: false,
        name: 'Cookie',
        path: '/',
        secure: false,
        session: false,
        value: 'Value'
      });

      var view = new ci.Views.CookieForm({ model: cookie });
      $(document.body).append(view.render().el);
      view.$('input').eq(0).focus();
    });
  },

  _onRemoveCookieClick: function(event) {
    event.preventDefault();
    this.remove();
    this.model.destroy();
  },

  _onRemoveAllCookiesClick: function(event) {
    event.preventDefault();
    this.remove();
    socket.postMessage({ command: 'removeAllCookies' });
  },

  _onEditCookieClick: function(event) {
    event.preventDefault();
    this.remove();

    var view = new ci.Views.CookieForm({ model: this.model });
    $(document.body).append(view.render().el);
    view.$('input').eq(0).focus();
  },

  _onBlur: function(event) {
    this.remove();
  }

});
