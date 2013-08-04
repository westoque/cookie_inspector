ci.Views.Cookie = Backbone.View.extend({

  className: 'cookie-row',

  tagName: 'tr',

  initialize: function() {
    this.listenTo(this.model, 'destroy', this.remove);
  },

  events: {
  },

  template: function() {
    return Hogan.compile($('#cookie-tmpl').text());
  },

  render: function() {
    this.$el.html(this.template().render(this.model.toJSON()));
    return this;
  }

});

