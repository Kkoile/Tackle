
var onlineUsers = {}

function getUsers() {
  var users = []
  for (var i in onlineUsers) {
    if (onlineUsers[i] != null) {
      var u = onlineUsers[i]
      if (u.gamedata.inGame === false && u.gamedata.attacking === false && u.gamedata.ready === true && u.gamedata.attacked === false) {
        users.push(i)
      }
    }
  }
  return users
}

module.exports = function(io, socket) {
  onlineUsers[socket.jwtData.username] = socket
  socket.gamedata = {
    inGame: false,
    attacking: false,
    ready: false,
    attacked: false
  }
  socket.on('disconnect', function() {
    onlineUsers[socket.jwtData.username] = null
    io.emit('users', getUsers())
  })
  socket.on('attack', function(data) {
    if (socket.gamedata.inGame === false && socket.gamedata.attacking === false) {
      if (onlineUsers[data.username] != null) {
        var op = onlineUsers[data.username]
        if (op.gamedata.attacking === false && op.gamedata.inGame === false && op.gamedata.ready === true && op.gamedata.attacked === false) {
          socket.gamedata.attacking = data.username
          op.gamedata.attacked = data.username
          op.emit('attack', data)
          io.emit('users', getUsers())
        }
      }
    }
  })
  socket.on('replyAttack', function(data) {
    if (data === true) {
      // Attack accepted
      if(socket.gamedata.attacked !== false && onlineUsers[socket.gamedata.attacked] != null && onlineUsers[socket.gamedata.attacked].gamedata.attacking === socket.jwtData.username){
        // Start game
        var op = onlineUsers[socket.gamedata.attacked]
        var attackerStarts = Math.random() >= 0.5
        op.gamedata.attacking = false
        op.gamedata.inGame = socket.jwtData.username
        socket.gamedata.attacked = false
        socket.gamedata.inGame = op.jwtData.username
        io.emit('users', getUsers())
        socket.emit('startgame', !attackerStarts)
        op.emit('startgame', attackerStarts)
      }
    } else {
      // Attack denied
      if(socket.gamedata.attacked !== false && onlineUsers[socket.gamedata.attacked] != null && onlineUsers[socket.gamedata.attacked].gamedata.attacking === socket.jwtData.username){
        var op = onlineUsers[socket.gamedata.attacked]
        op.gamedata.attacking = false
        op.emit('replyAttack', data)
      }
      socket.gamedata.attacked = false
      io.emit('users', getUsers())
    }
  })
  socket.on('turn', function(data){
    if(socket.gamedata.inGame != null && onlineUsers[socket.gamedata.inGame] != null){
      var op = onlineUsers[socket.gamedata.inGame]
      op.emit('turn', data)
    }
  })
  socket.on('ready', function(data) {
    if (data === true || data === false) {
      socket.gamedata.ready = data
    }
  })
  io.emit('users', getUsers())
}
