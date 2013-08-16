ci.Views.Footer = Backbone.View.extend({

  id: 'footer',

  template: function() {
    return Hogan.compile($('#footer-tmpl').text());
  },

  render: function() {
    this.$el.html(this.template().render());
    return this;
  }

});

