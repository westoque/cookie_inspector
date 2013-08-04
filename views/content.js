ci.Views.Content = Backbone.View.extend({

  id: 'content',

  initialize: function() {
    this.cookies = this.options.cookies;
    this.listenTo(this.cookies, 'reset', this._onCookiesReset.bind(this));
    this.listenTo(this.cookies, 'add',   this._onCookiesAdd.bind(this));
    this.listenTo(this.cookies, 'sort',  this._onCookiesSort.bind(this));
  },

  template: function() {
    return Hogan.compile($('#content-tmpl').text());
  },

  render: function() {
    this.$el.html(this.template().render());
    return this;
  },

  _onCookiesAdd: function(cookie) {
    this._addOne(cookie);
  },

  _onCookiesReset: function(cookies) {
    cookies.each(this._addOne.bind(this));
  },

  _onCookiesSort: function(cookies) {
    this.$('.cookie-row').remove();
    cookies.each(this._addOne.bind(this));
  },

  _addOne: function(cookie) {
    var view = new ci.Views.Cookie({model: cookie});
    this.$('table tbody').prepend(view.render().el);
  }

});

