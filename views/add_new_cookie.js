ci.Views.AddNewCookie = Backbone.View.extend({

  id: 'add-new-cookie',

  events: {
    'click' : 'closeModal'
  },

  template: function() {
    return Hogan.compile($('#add-new-cookie-tmpl').text());
  },

  render: function() {
    this.$el.html(this.template().render());
    return this;
  },

  closeModal: function(e) {
    e.preventDefault();
    this.remove();
  }

});

