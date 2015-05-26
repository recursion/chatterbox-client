var app = {

  init: function() {},

  server: 'https://api.parse.com/1/classes/chatterbox',

  rooms : [],
  friends: [],

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
      // this message
      var user = app.validate(message.username);
      var text = app.validate(message.text);
      var room = app.validate(message.roomname);

      // selected room
      var selectedRoom = $('.selectedRoom')[0];
      if (selectedRoom !== undefined) {
        selectedRoom = selectedRoom.innerHTML;
      }

      // if we have a valid user and text string
      if ( user !== "" && text !== "") {
        var chatMessage;
        if ( app.friends.indexOf(user) !== -1 ) {
          chatMessage = $('<p class="message friendMessage">' + '<a href="#" class="username">' + user  + '</a>' + ':' +  '<br>' + text +'</p>');
        } else {
          chatMessage = $('<p class="message">' + '<a href="#" class="username">' + user  + '</a>' + ':' +  '<br>' + text +'</p>');
        }
        if (selectedRoom === "Lobby") {
          $('#main').append(chatMessage);
        } else if (selectedRoom !== undefined) {

          // if the current message is to the selected room
          if (room === selectedRoom) {
            $('#main').append(chatMessage);
          }
        }
      }
    });
    $('.username').on("click",  function (event) {
      event.preventDefault();
      var friend = $(this).text();
      if ( app.friends.indexOf(friend) === -1 ) {
        app.friends.push(friend);
        console.log(app.friends);
        var thisFriend = $('<p class="friend">' + friend + '</p>');
        $('#friendsList').append(thisFriend);
      }
    });
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
    var addNewRoom = roomname;
      if ( app.rooms.indexOf(addNewRoom) === -1 ) {
        app.rooms.push(addNewRoom);
        var newRoom = $('<p class="room">' + addNewRoom + '</p>');
        $('#rooms').append(newRoom);
        $('.room').on("click",  function (event) {
          event.preventDefault();
          $('.room').removeClass('selectedRoom');
          $(this).addClass('selectedRoom');
          var filter = $(this).text();
        });
      } else {
        alert('Room already exists!');
      }
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
    app.addRoom(addNewRoom);
  });

  $('.room').on("click",  function (event) {
    event.preventDefault();
    $('.room').removeClass('selectedRoom');
    $(this).addClass('selectedRoom');
    var filter = $(this).text();
  });
});

setInterval (app.fetch.bind(app), 1000);
