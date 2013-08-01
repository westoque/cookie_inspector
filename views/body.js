ci.Views.Body = Backbone.View.extend({

  el: $(document.body),

  className: 'ci-body',

  events: {
    'drop' : ''
  },

  initialize: function() {
    this._listenToWindowResize();
  },

  render: function() {
    return this;
  },

  _listenToWindowResize: function() {
    // window resize is said to be inefficient but in
    // this use case its alright ;)
    window.onresize = this._onWindowResize.bind(this);
  },

  _onWindowResize: function(val) {
    this.trigger('resize');
  }

});

