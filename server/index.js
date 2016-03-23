var app = require('express')()
var fs = require('fs');
var server = require('http').Server(app)
var io = require('socket.io')(server)
var jwt = require('jsonwebtoken')
//var cert = fs.readFileSync('private.key')
var cert = 'MySecretToken1234'
var users = JSON.parse(fs.readFileSync('users.json')).users

var game = require('./game.js')

server.listen(8080, function() {
  console.log('=================================================')
  console.log('= Hallo Nils,                                   =')
  console.log('= diese Nachricht dient dazu dir mitzuteilen,   =')
  console.log('= dass dieser Server läuft!                     =')
  console.log('=                                               =')
  console.log('= Mit freundlichen Grüßen                       =')
  console.log('= Dustin Hoffner                                =')
  console.log('=                                               =')
  console.log('=================================================')
})

app.post('/login/:name', function(req, res) {
  if (users.indexOf(req.params.name) < 0) {
    users.push(req.params.name)
    fs.writeFile('users.json', JSON.stringify({users: users}), function(err) {
      if (err != null) {
        res.status(500).send('Failed to save username!')
      }
      jwt.sign({username: req.params.name}, cert, {
        algorithm: 'RS256'
      }, function(token) {
        res.status(200).json({token: token})
      });
    })
  } else {
    res.status(401).send('Username already used!')
  }
});

io.use(function(socket, next) {
  if (socket.request.headers.token != null) {
    jwt.verify(socket.request.headers.token, cert, function(err, decoded) {
      if (err) {
        return next(new Error('Authentication error'))
      }
      socket.jwtData = decoded;
      return next()
    })
  }
  next(new Error('Authentication error'))
});

io.on('connection', function(socket) {
  socket.on('auth', function(token) {
    jwt.verify(token, cert, function(err, decoded) {
      if (err) {
        socket.emit('auth', {success: false})
      }
      socket.jwtData = decoded
      socket.emit('auth', {success: true})
      game(io, socket)
    })
  })
})
