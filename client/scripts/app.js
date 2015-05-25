var app = {

  init: function() {},

  server: 'https://api.parse.com/1/classes/chatterbox',

  messages: [],

  newMessages: [],

  send: function(message) {
    var app = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  updateMessages: function ( ) {
    var app = this;

    if ( this.messages.length === 0 ) {
      this.messages = this.newMessages;
      var newMsgs = this.messages;
    } else if ( this.newMessages.length > this.messages.length ) {
      var diff = this.newMessages.length - this.messages.length;
      var newMsgs = this.newMessages.slice(diff);
    }

    _.each( newMsgs, function (message) {
      var user = "";
      var msgtxt = "";
        if ( app.validate(message.username) ) {
        user = message.username;
        }
        if ( app.validate(message.text) ) {
          msgtxt = message.text;
        }
      var msg = $('<li><span class="createdBy">'+user+'</span>: '+msgtxt+'</li>');
      if (user !== "" && msg.text !== "") {
        $('.messages').append(msg);
      };
      console.log(message);
      app.messages.push(message);
    });
    this.newMessages = [];
  },

  fetch: function( ) {
    var app = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        app.newMessages = data.results;
        app.updateMessages( );
        console.log('chatterbox: Messages fetched');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message');
      }
    });
  },

  validate: function( string ) {
    if ( string === undefined ) {
      return false;
    }
    if ( string.match(/[|&;$%@"<>()+,]/g, "") || string === "") {
    return false;
    }
  return true;
  },




};

setInterval (app.fetch.bind(app), 1000);
