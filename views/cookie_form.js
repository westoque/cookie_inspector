ci.Views.CookieForm = Backbone.View.extend({

  id: 'cookie-form-view',

  events: {
    'click #cancel'       : '_onCancelClick',
    'submit #cookie-form' : '_onFormSubmit'
  },

  template: function() {
    return Hogan.compile($('#cookie-form-tmpl').text());
  },

  render: function() {
    var options = this.model.toJSON();
    options.expires = this.model.expirationDateToISO();

    this.$el.html(this.template().render(options));
    return this;
  },

  _onCancelClick: function(event) {
    event.preventDefault();
    this.remove();
    return this;
  },

  _onFormSubmit: function(event) {
    event.preventDefault();
    var attrs = this._getFormValues();
    this.model.set(attrs);
    ci.cookies.add(this.model);
    this.remove();
  },

  _getFormValues: function() {
    var attrs = {};
    attrs.name = this.$('input[name="name"]').val();
    attrs.value = this.$('textarea').val();
    attrs.domain = this.$('input[name="domain"]').val();
    attrs.path = this.$('input[name="path"]').val();

    var expires = new Date(this.$('input[name="expires"]').val());
    attrs.expirationDate = parseInt(expires.getTime() / 1000);

    attrs.session = this.$('input[name="session"]').prop('checked');
    attrs.hostOnly = this.$('input[name="hostOnly"]').prop('checked');
    attrs.httpOnly = this.$('input[name="httpOnly"]').prop('checked');
    attrs.secure = this.$('input[name="secure"]').prop('checked');
    return attrs;
  }

});

