'use strict';

var game = new Tic_Tac_Toe();
var _user_name = null;
var _start_game = false;
var _players = null;
var _mark = 'x';

game.on('init', function(err, data) {});

game.on('game_start', function(err, data) {
  if(err) return;
  var showed_x, showed_o = false;
  _players = data;
  for (var i in data) {
    if(data[i] == 'x') {
      $('#p1').html(i + ": <span style='color:red'>X</span>");
      showed_x = true;
    }
    else if(data[i] == 'o') {
      $('#p2').html(i + ": <span style='color:blue'>O</span>");
      showed_o = true;
    }
  }

  if(!showed_x) $('#p1').html('Waiting...');
  if(!showed_x) $('#p2').html('Waiting...');

  if(showed_x && showed_o) _start_game = true;
});

game.on('game_move', function(err, data) {
  if(err) return;
  if($.trim($(data.cell).html()) == '') {
    if( _mark == 'x') {
      $(data.cell).html('X');
      _mark = 'o';
      $(data.cell).css('color','red');
    } else {
      $(data.cell).html('O');
      $(data.cell).css('color','blue');
      _mark = 'x';
    }  
  }
});

game.on('game_over', function(err, data) {
  if(data.draw === true) {
    general_box_show('It was a draw', '<p>Your equally good, it is a draw</p>');
  } else if(data.winner == _user_name) {
    general_box_show('Congratulations', '<p>You won</p>');
  } else {
    general_box_show('You lost', '<p>Try harder next time</p>');
  }
});

var register_button_handler = function(game) {
  return function() {    
    var full_name = $('#full_name_register').val();
    var user_name = $('#user_name_register').val();
    var password = $('#password_register').val();
    _user_name = user_name;

    game.register(full_name, user_name, password, function(err, data) {
      if(err) return error_box_show(err.error);
      render_view('#dashboard');
    });
  };
};

var login_button_handler = function(game) {
  return function() {
    var user_name = $('#user_name_login').val();
    var password = $('#password_login').val();
    _user_name = user_name;

    game.login(user_name, password, function(err, data) {
      if(err) return error_box_show(err.error);
      render_view('#dashboard');
    });
  };
};

var new_game_button_handler = function(game) {
  return function() {
    game.player_connected(_user_name, function(err, data) {
      if(err) return error_box_show(err.error);
      render_view('#game');
    });
  };
};

var past_game_button_handler = function(game) {
  return function() {
     game.view_past_games(_user_name, function(err, data) {
      if(err) return error_box_show(err.error);
      populate_table(data);
      render_view('#past_games');
    });
  };
};

function render_view(view_id) {
  $('#login').hide();
  $('#dashboard').hide();
  $('#game').hide();
  $('#past_games').hide();
  $('#past_game_board').hide();
  $(view_id).show();
}

var mark_box = function(coordinates) {
  if(_start_game) {
    if(_players[_user_name] != _mark) {
       $('#stats').html('Not your turn').hide().fadeIn(1000).fadeOut(1000);
    } else {
      if($.trim($(coordinates).html()) == '') {

        game.mark_cell(_user_name, coordinates, _mark, function(err, data) {
          if (err) return error_box_show(err.error);
        });
      } else {
        $("#stats").html('Invalid move').hide().fadeIn(1000).fadeOut(1000);
      }
    }
  } else {
    $("#stats").html('Pending extra player...').hide().fadeIn(1000).fadeOut(1000);
  }
};

var populate_table = function(data) {
  for (var i = 0;i < data.length;i++) {
    var game_num = i+1;
    var opponent = (data[i].player1_user_name == _user_name) ? data[i].player2_user_name : data[i].player1_user_name;
    var winner = data[i].winner;
    var time = data[i].created_on;
    var board = data[i].board;
    var color = (winner == _user_name) ? 'success' : ((winner == 'draw') ? 'info' : 'error');
    console.log(board);
    var html = '<tr class = ' + color + '>'
        + '<td>'+ game_num +'</td>'
        + '<td>'+ opponent +'</td>'
        + '<td>'+ winner +'</td>'
        + '<td>'+ time +'</td>'
        + '<td><a onclick="show_board(\'' + board + '\')">View</a></td>'
        + '</tr>';
    $('#past_games > tbody:last-child').append(html);
  }
};

 // * Helper methods
 
var error_box_show = function(error) {
  $('#status_box_header').html('Error');
  $('#status_box_body').html(error);
  $('#status_box').modal({backdrop:true, show:true});  
};

/**
 * General message box with configurable title and body content
 */ 
var general_box_show = function(title, body) {
  $('#status_box_header').html(title);
  $('#status_box_body').html(body);
  $('#status_box').modal({backdrop:true, show:true});  
};

var show_board = function(board) {
  console.log(board);
  for (var i in board) {
    console.log($('table#past_table' + i ));
    $('table#past_table >' + i ).html(board[i]);
  }
  render_view('#past_game_board');
  console.log(board);
};

$(document).ready(function() {
  $('#register_button').click(register_button_handler(game));
  $('#login_button').click(login_button_handler(game));
  $('#new_game_button').click(new_game_button_handler(game));
  $('#past_game_button').click(past_game_button_handler(game));

  $('#00').click(function()
  {
    mark_box('#00');
  });
  $('#01').click(function()
  {
    mark_box('#01');
  });
  $('#02').click(function()
  {
    mark_box('#02');
  });
  $('#10').click(function()
  {
    mark_box('#10');
  });
  $('#11').click(function()
  {
    mark_box('#11');
  });
  $('#12').click(function()
  {
    mark_box('#12');
  });
  $('#20').click(function()
  {
    mark_box('#20');
  });
  $('#21').click(function()
  {
    mark_box('#21');
  });
  $('#22').click(function()
  {
    mark_box('#22');
  });
});