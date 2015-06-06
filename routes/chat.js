var ChatLog = require('../models/chatLog');
var chatStore = require('memory-cache');
// var chats = [];
// chats.push('test');
// chatStore.put('chats', chats);
// chatStore.put('foo', 'bar');




module.exports = function(server, app) {
    var io = require('socket.io')(server);

    var clients = [];
    var chats = [];

    function makeAdminList(clients, cb) {
        var list = [];

        for (i in clients) {
            var item = {};
            if (clients[i].isAdmin) {
                item.clientID = i;
                list.push(item);
            }
        }
        cb(list);
    }

    function updateList(client, sid, cb) {
        // console.log(sid, client.id);
        if (clients[sid]) {
            var userDetails = clients[sid].userDetails;
            // console.log(userDetails);
            clients[sid] = client;
            clients[sid].userDetails = userDetails;
        } else {
            clients[sid] = client;
            clients[sid].userDetails = {};
        }
        // console.log(clients[sid]);
        cb();
    }

    function finishChat(sid, cb){
      // save chat cache in DB
      var chat = chatStore.get(sid);

      ChatLog.findOne({
          sid: sid
      }, function(err, chatlog) {
          if (err) {
              console.error(err);
          } else if (chatlog) {

              chatlog.adminID = chat.adminID;
              chatlog.userID = chat.userID;
              var c = chatlog.log.concat(chat.log);
              chatlog.log = c;

              chatlog.save(function(err){
                  if(err){
                      console.error(err);
                      cb(err);
                  } else {
                      clients[sid].disconnect();
                      delete clients[sid];
                      console.log('leave', sid);
                      cb(null);
                  }
              });
          } else {
              var newChatLog = new ChatLog();

              newChatLog.sid = sid;
              newChatLog.adminID = chat.adminID;
              newChatLog.userID = chat.userID;
              newChatLog.log = chat.log;

              newChatLog.save(function(err){
                  if(err){
                      console.error(err);
                      cb(err);
                  } else {
                      clients[sid].disconnect();
                      delete clients[sid];
                      console.log('leave', sid);
                      cb(null);
                  }
              });
          }
      });
    }

    // initial browser connection
    io.on('connection', function(client) {
        // console.log(app.get('sid'));
        var sid = app.get('sid');

        updateList(client, sid, function() {

            // user - get online admins
            clients[sid].on('getAdmins', function(id) {
                // console.log(id);
                // set userID
                // clients[sid].userID = id.userID;
                // clients[sid].firstName = id.firstName;
                // clients[sid].lastname = id.lastName;

                // if alreadt chatting
                if(typeof clients[sid].userDetails.activeChat === "undefined"){
                    clients[sid].userDetails = {};
                    clients[sid].userDetails.userID = id.userID;
                    clients[sid].userDetails.firstName = id.firstName;
                    clients[sid].userDetails.lastName = id.lastName;
                    clients[sid].userDetails.uid = app.get('uid');

                    makeAdminList(clients, function(list) {
                        clients[sid].emit('adminsOnline', {
                            list: list
                        });
                    });
                } else {
                    clients[sid].userDetails.userID = id.userID;
                    clients[sid].userDetails.firstName = id.firstName;
                    clients[sid].userDetails.lastName = id.lastName;
                    clients[sid].userDetails.uid = app.get('uid');

                    // continue chat
                    if(chatStore.get(sid)){
                        var chat = chatStore.get(sid);
                        clients[sid].emit('continue', { chat : chat.log });
                    } else {
                        console.error('missing chat in cache', sid);
                        clients[sid].emit('continue', { chat: null });
                    }


                }

            });

            // admin - set admin
            clients[sid].on('isAdmin', function() {

                console.log('admin logged', client.id);
                clients[sid].isAdmin = true;
            });

            // user starts a chat
            clients[sid].on('startChat', function(id) {
                console.log(sid, 'started chat with: ', id);
                // console.log('user', clients[sid].userDetails);

                // set active chat with id on user object
                clients[sid].userDetails.activeChat = id.adminID;

                // open a tab on admin panel
                clients[id.adminID].emit('newTab', {
                    clientID: sid,
                    firstName: clients[sid].userDetails.firstName,
                    lastName: clients[sid].userDetails.lastName
                });

                // send status to both
                clients[sid].emit('status', {
                    status: 'Now chatting with ' + clients[id.adminID].firstName,
                    connected: true
                });

                // start recording in mem-cache
                // console.log(sid, clients[id.adminID].userDetails.uid, clients[sid].userDetails.uid);
                chatStore.put(String(sid), {
                    adminID: clients[id.adminID].userDetails.uid,
                    userID: clients[sid].userDetails.uid,
                    log: []
                });
                // chatStore.put(String(sid), {test: 'hello'});


            });

            // admin sends a message
            clients[sid].on('adminSendMsg', function(data) {
                clients[data.userID].emit('adminSendMsg', {
                    msg: data.msg
                });

                // save it in chat cache
                if(chatStore.get(data.userID)){
                    var chat = chatStore.get(data.userID);
                    chat.log.push('Admin: ' + data.msg);
                    chatStore.put(data.userID, chat);
                } else {
                    console.error('missing chat in cache', data.userID);
                }

            });

            // client - send a message to admin
            clients[sid].on('userSendMsg', function(data) {
                // console.log(data);
                clients[clients[sid].userDetails.activeChat].emit('userSendMsg', {
                    msg: data.msg,
                    sid: sid
                });

                // save it in chat cache
                if(chatStore.get(sid)){
                    var chat = chatStore.get(sid);
                    chat.log.push('User: ' + data.msg);
                    chatStore.put(sid, chat);
                } else {
                    console.error('missing chat in cache', sid);
                }
            });

            // remove disconnected clients
            clients[sid].on('disconnect', function() {
                // delete clients[sid];
                console.log('dis', sid);
            });

            // admin - finish Chat with a user
            clients[sid].on('finishChat', function(data){
              clients[data.userID].emit('chatClosed');

              finishChat(data.userID, function(err){
                if(err){
                  console.log(err);
                }
              });
            });

            // remove leaving clients
            clients[sid].on('leave', function() {
              finishChat(sid, function(err){
                if(err){
                  console.log(err);
                }
              });
            });
        });
    });
}

/*
module.exports = function(server, app) {
    var io = require('socket.io')(server);
    var sid = app.get('sid');

    var clients = [];
    var chats = [];

    function makeAdminList(clients, cb) {
        var list = [];

        for (i in clients) {
            var item = {};
            if (clients[i].isAdmin) {
                item.clientID = clients[i].id;
                list.push(item);
            }
        }
        cb(list);
    }

    function updateClients(client){
        // console.log('sock',clients[sid]);
        if(clients[sid]){
            clients[sid] = client;
            clients[sid].chatActive = false;
            clients[sid].isAdmin = false;
            console.log(clients.length);
            // cb();
        } else {
            clients[sid] = client;
            console.log(clients.length);
            // cb();
        }
        // console.log(clients.length);
    }

    // initial browser connection
    io.on('connection', function(client) {

        updateClients(client);

        // user - get online admins
        clients[sid].on('getAdmins', function(id) {
            // console.log(id);
            //set userID
            clients[sid].userID = id.userID;
            clients[sid].firstName = id.firstName;
            clients[sid].lastname = id.lastName;

            //get list
            makeAdminList(clients, function(list) {
                clients[sid].emit('adminsOnline', {
                    list: list
                });
            });
        });

        clients[sid].on('startChat', function(id) {
            console.log(sid, 'started chat with: ', id);

            // set active chat with id on user object
            clients[sid].activeChat = id.adminID;

            // open a tab on admin panel
            clients[id.adminID].emit('newTab', {
                clientID: client.id,
                firstName: clients[sid].firstName,
                lastName: clients[sid].lastName
            });

            // send status to both
            clients[sid].emit('status', {
                status: 'Now chatting with ' + clients[id.adminID].firstName,
                connected: true
            });

            // start recording in mem-cache
            console.log('sid', app.get('sid'));
            chatStore.put(app.get('sid'), {
                adminID: id,
                log: {}
            });
            console.log(chatStore.get(app.get('sid')));

        });

        // admin - set admin
        clients[sid].on('isAdmin', function() {

            console.log('admin logged', client.id);
            clients[sid].isAdmin = true;
            clients[sid].adminName = "Admin - 1";
        });

        clients[sid].on('adminSendMsg', function(data) {
            clients[data.userID].emit('adminSendMsg', {
                msg: data.msg
            });
        });

        // client - send a message to admin
        clients[sid].on('userSendMsg', function(data) {
            // console.log(data);
            clients[clients[sid].activeChat].emit('userSendMsg', {
                msg: data.msg
            });
        });


        // remove disconnected clients
        clients[sid].on('disconnect', function() {
            delete clients[sid];
        });

        // remove leaving clients
        clients[sid].on('leave', function() {
            clients[sid].disconnect();
            delete clients[sid];
        });

    });

}

function generateToken() {
    var token = '';
    var availableSymbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321"; // just so they're easier to type, I removed the !@#$%^&*
    for (var i = 0; i < 8; i++) {
        var symbol = availableSymbols[(Math.floor(Math.random() * availableSymbols.length))];
        token += symbol;
    }
    return token;
} */
