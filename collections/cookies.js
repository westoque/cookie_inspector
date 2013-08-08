ci.Collections.Cookies = Backbone.Collection.extend({

  initialize: function() {
    socket.on('cookies:read', this._onCookiesRead.bind(this));
    socket.on('cookies:create', this._onCookiesCreate.bind(this));
    socket.on('navigate', this._onNavigate.bind(this));
  },

  url: 'cookies',

  model: ci.Models.Cookie,
    
  sortByAttrDesc: function(attr) {
      var val;
      this.comparator = function(a, b) {
          if (a.get(attr) < b.get(attr)) {
              val = 1;
          } else if (a.get(attr) > b.get(attr)) {
              val = -1;
          } else {
              val = 0;
          }
          return val;
      }
      this.sort();      
  },
    
  sortByAttrAsc: function(attr) {
      var val;
      this.comparator = function(a, b) {
          if (a.get(attr) > b.get(attr)) {
              val = 1;
          } else if (a.get(attr) < b.get(attr)) {
              val = -1;
          } else {
              val = 0;
          }
          return val;
      }
      this.sort();
  },

  _onCookiesRead: function(data) {
    this.reset(data.cookies);
  },

  _onCookiesCreate: function(cookie) {
    this.push(cookie);
  },

  _onNavigate: function() {
    this.reset([]);
  }

});
