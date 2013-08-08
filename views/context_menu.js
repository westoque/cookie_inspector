ci.Views.ContextMenu = Backbone.View.extend({

  id: 'context-menu-view',

  events: {
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

  _onBlur: function(event) {
    this.remove();
  }

});
