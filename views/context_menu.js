ci.Views.ContextMenu = Backbone.View.extend({

  id: 'context-menu-view',

  events: {
    'click #add-new-cookie' : '_onAddNewCookieClick',
    'click #edit-cookie' : '_onEditCookieClick',
    'click #remove-cookie' : '_onRemoveCookieClick',
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

    chrome.devtools.inspectedWindow.eval('window.document.domain', function(domain) {
      var cookie = new ci.Models.Cookie({
        domain: domain,
        expirationDate: (new Date().getTime() / 1000),
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

  _onRemoveCookieClick: function() {
    event.preventDefault();
    this.remove();
    this.model.destroy();
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
