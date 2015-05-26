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
    } else {
      //console.log('No new Messages');
      var newMsgs = []
    }

    //console.log('adding: ', newMsgs.length, ' new messages.');
    _.each( newMsgs, function (message) {
      var user = "";
      var msgtxt = "";
        if ( app.validate(message.username) ) {
        user = message.username;
        }
        if ( app.validate(message.text) ) {
          msgtxt = message.text;
        }
      var msg = $('<p class = "message"><span class="createdBy">'+user+'</span>: '+msgtxt+'</p>');
      if (user !== "" && msg.text !== "") {
        $('#main').prepend(msg);
      };
      app.messages.push(message);
      $('#main').scrollTop = $('#main').scrollheight;
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
        //console.log('chatterbox: Messages fetched');
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

  clearMessages: function () {
    $('.message').remove();
  },

  addMessage: function (username, message, roomname) {
    var message = {};
    message.username = username;
    message.text = message;
    message.roomname = roomname;
    console.log("this is your message");
    console.log(message);
    app.send(message);
  }


};

$(document).ready(function () {

  $('#submitButton').on("click",  function (event) {
    event.preventDefault();
    console.log("i work");
    var username = $('#inputUser').val();
    var message = $('#inputMessage').val();
    var roomname = $('#inputroomname').val();
    app.addMessage(username, message, roomname);
  });

});

setInterval (app.fetch.bind(app), 1000);
