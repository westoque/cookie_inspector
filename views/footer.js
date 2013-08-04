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
    var cookie = new ci.Models.Cookie({
      domain: 'localhost',
      expirationDate: (new Date().getTime() / 1000),
      hostOnly: false,
      httpOnly: false,
      name: '',
      path: '/',
      secure: false,
      session: false,
      value: ''
    });
    var view = new ci.Views.CookieForm({ model: cookie });
    $(document.body).append(view.render().el);
    view.$('input').eq(0).focus();
  }

});

