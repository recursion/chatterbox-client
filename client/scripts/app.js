var app = {

  init: function() {},

  server: 'https://api.parse.com/1/classes/chatterbox',

  rooms : [],

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
      var room = app.validate(message.roomname);
      var roomName = $('#inputRoom').val();
      if ( user !== "" && text !== "" && room === roomName) {
        var chatMessage = $('<p class = "message">' + '<span class = "username">' + user  + '</span>' + ':' +  '<br>' + text +'</p>');
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
    if ( string === undefined  || string === null) {
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
    app.send(postThis);
  },

  addRoom: function ( roomname ) {

  },

  getQueryVariable: function(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1];}
    }
    return(false);
  }

};

$(document).ready(function () {

  $('#inputName').val(app.getQueryVariable('username'));

  $('#submitButton').on("click",  function (event) {
    event.preventDefault();
    var username = $('#inputName').val();
    var message = $('#inputMessage').val();
    var roomname = $('#inputRoomName').val();
    app.addMessage(username, message, roomname);
  });

  $('#submitButtonRoom').on("click",  function (event) {
    event.preventDefault();
    var addNewRoom = $('#inputRoom').val();
    console.log(app.rooms);
      if ( app.rooms.indexOf(addNewRoom) === -1 ) {
        app.rooms.push(addNewRoom);
        var newRoom = $('<p class="room">' + addNewRoom + '</p>');
        $('#rooms').append(newRoom);
        $('.room').on("click",  function (event) {
          event.preventDefault();
          var filter = $(this).text();
        });
      } else {
        alert('Room already exists!');
      }
  });

});

setInterval (app.fetch.bind(app), 1000);
