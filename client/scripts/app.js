var app = {

  init: function() {},

  server: 'https://api.parse.com/1/classes/chatterbox',

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

  updateMessages: function ( messages ) {
    var app = this;
    $('.message').remove();
    _.each (messages, function (message) {
      var user = app.validate(message.username);
      var text = app.validate(message.text);
      var roomName = app.validate(message.roomname);
      if ( user !== "" && text !== "" ) {
        var chatMessage = $('<p class = "message">' + user + ':' + text + '</p>');
        $('#main').append(chatMessage);
      }
    })
  },

  fetch: function( ) {
    var app = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        app.updateMessages( data.results);
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
      return "";
    }
    if ( string.match(/[|&;$%@"<>()+,]/g, "") || string === "") {
    return "";
    }
  return string;
  },

  clearMessages: function () {
    $('.message').remove();
  },

  addMessage: function (username, message, roomname) {
    var postThis = {};
    postThis.username = username;
    postThis.text = message;
    postThis.roomname = roomname;
    console.log("this is your message");
    app.send(postThis);
  }

};

$(document).ready(function () {

  $('#submitButton').on("click",  function (event) {
    event.preventDefault();
    console.log("i work");
    var username = $('#inputName').val();
    var message = $('#inputMessage').val();
    var roomname = $('#inputroomname').val();
    console.log(username);
    console.log(message);
    console.log(roomname);
    app.addMessage(username, message, roomname);
  });

});

setInterval (app.fetch.bind(app), 1000);
