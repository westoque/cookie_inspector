ci.Models.Cookie = Backbone.Model.extend({

  initialize: function() {
  },

  parse: function(response, options) {
    response.size = response.name.length + response.value.length;
    response.expires = (new Date(response.expirationDate * 1000)).toString();
    return response;
  }

});

