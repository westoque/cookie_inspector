ci.Models.Cookie = Backbone.Model.extend({

  url: 'cookies',

  initialize: function(attrs) {
    this.set('size', this.computeSize());
    this.set('expires', this.computeExpires());
    this.listenTo(this, 'change:name', function() {
      this.set('size', this.computeSize());
    }, this);
    this.listenTo(this, 'change:value', function() {
      this.set('size', this.computeSize());
    }, this);
  },

  computeSize: function() {
    return this.get('name').length + this.get('value').length;
  },

  computeExpires: function() {
    var expirationDate = this.get('expirationDate');

    if (expirationDate) {
      return (new Date(expirationDate * 1000)).toString()
    } else {
      return null;
    }
  },

  expirationDateObject: function() {
    return new Date(this.get('expirationDate') * 1000);
  },

  expirationDateToISO: function() {
    var date = this.expirationDateObject();
    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = month > 9 ? month : '0' + month;

    var day = date.getDate()
    day = day > 9 ? day : '0' + day;

    var hours = date.getHours();
    hours = hours > 9 ? hours : '0' + hours;

    var minutes = date.getMinutes();
    minutes = minutes > 9 ? minutes : '0' + minutes;

    return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;
  }

});

COOKIES = [
  {
    id: 1,
    domain: "squareup.com",
    expirationDate: 1458191627,
    hostOnly: true,
    httpOnly: false,
    name: "_savt",
    path: "/",
    secure: false,
    session: false,
    storeId: "0",
    value: "5d943487-8783-4a2d-81c2-aa356f254782"
  },
  {
    id: 2,
    domain: ".squareup.com",
    expirationDate: 1426661120,
    hostOnly: false,
    httpOnly: false,
    name: "__utma",
    path: "/",
    secure: false,
    session: false,
    storeId: "0",
    value: "141992880.1096054503.1362680496.1363584513.1363584513.4"
  },
  {
    id: 3,
    domain: ".squareup.com",
    expirationDate: 1379357120,
    hostOnly: false,
    httpOnly: false,
    name: "__utmz",
    path: "/",
    secure: false,
    session: false,
    storeId: "0",
    value: "141992880.1362680496.1.1.utmcsr=t.co|utmccn=(referral)|utmcmd=referral|utmcct=/ZQwuzO6Gey"
  },
  {
    id: 4,
    domain: ".squareup.com",
    hostOnly: false,
    httpOnly: false,
    name: "session",
    path: "/",
    secure: false,
    session: true,
    storeId: "0",
    value: "some_session_value"
  }
];
