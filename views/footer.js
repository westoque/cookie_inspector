ci.Views.Footer = Backbone.View.extend({

  id: 'footer',

  events: {
    'click #new-cookie' : '_onAddNewCookieClick'
  },

  template: function() {
    return Hogan.compile($('#footer-tmpl').text());
  },

  render: function() {
    this.$el.html(this.template().render());
    return this;
  },

  _onAddNewCookieClick: function(e) {
    e.preventDefault();

    // TODO: Move this somewhere.
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
  }

});

