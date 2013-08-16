ci.Views.Cookie = Backbone.View.extend({

  className: 'cookie-row',

  tagName: 'tr',

  events: {
    'contextmenu' : '_onContextMenu'
  },

  initialize: function() {
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'change', this.render);
  },

  template: function() {
    return Hogan.compile($('#cookie-tmpl').text());
  },

  render: function() {
    this.$el.html(this.template().render(this.model.toJSON()));
    return this;
  },

  _onContextMenu: function(event) {
    var view = new ci.Views.ContextMenu({
      model: this.model,
      x: event.clientX,
      y: event.clientY
    });
    $(document.body).append(view.render().el);
    view.$el.focus();
    event.stopPropagation();
    event.preventDefault();
  }

});

