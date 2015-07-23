#!/usr/bin/env node
var debug = require('debug')('st-app');
var app = require('./app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});


// var chatStore = require('memory-cache');
// var chats = [];
// chats.push('test');
// chatStore.put('chats', chats);

require('./routes/chat')(server, app);

// var io = require('socket.io')(server);