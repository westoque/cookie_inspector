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
    this._showAddNewCookieForm();
  },

  _showAddNewCookieForm: function() {
    var view = new ci.Views.AddNewCookie();
    $(document.body).append(view.render().el);
  }

});

