// check login

// send msg

// get all admins

// connect to an admin

// dc from admin

// connect / dc

// save msg in mem store

// save to db

// chatStore.put('foo', 'bar');
// console.log(chatStore.get('foo'));

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
                item.clientID = clients[i].id;
                list.push(item);
            }
        }
        cb(list);
    }

    // initial browser connection
    io.on('connection', function(client) {
        // set details in arrays
        clients[client.id] = client;
        clients[client.id].chatActive = false;
        clients[client.id].isAdmin = false;

        // user - get online admins
        clients[client.id].on('getAdmins', function(id) {
            // console.log(id);
            //set userID
            clients[client.id].userID = id.userID;
            clients[client.id].firstName = id.firstName;
            clients[client.id].lastname = id.lastName;

            //get list
            makeAdminList(clients, function(list) {
                clients[client.id].emit('adminsOnline', {
                    list: list
                });
            });
        });

        clients[client.id].on('startChat', function(id) {
            console.log(client.id, 'started chat with: ', id);

            // set active chat with id on user object
            clients[client.id].activeChat = id.adminID;

            // open a tab on admin panel
            clients[id.adminID].emit('newTab', {
                clientID: client.id,
                firstName: clients[client.id].firstName,
                lastName: clients[client.id].lastName
            });

            // send status to both
            clients[client.id].emit('status', {
                status: 'Now chatting with ' + clients[id.adminID].firstName,
                connected: true
            });
            

            // console.log(clients[ID]);

            // start chat at with user
            // var msg = "Now Chatting with " + clients[client.id].adminName;
            // clients[id.userID].emit('status', {
            //     msg: msg,
            //     adminID: client.id,
            //     type: 'connected'
            // });

            
            
            // set status to user

        });

        // admin - set admin
        clients[client.id].on('isAdmin', function() {

            console.log('admin logged', client.id);
            clients[client.id].isAdmin = true;
            clients[client.id].adminName = "Admin - 1";
        });

        clients[client.id].on('adminSendMsg', function(data) {
            clients[data.userID].emit('adminSendMsg', {
                msg: data.msg
            });
        });

        // client - send a message to admin
        clients[client.id].on('userSendMsg', function(data) {
            // console.log(data);
            clients[clients[client.id].activeChat].emit('userSendMsg', {
                msg: data.msg
            });
        });


        // remove disconnected clients
        clients[client.id].on('disconnect', function() {
            delete clients[client.id];
        });

        // remove leaving clients
        clients[client.id].on('leave', function() {
            clients[client.id].disconnect();
            delete clients[client.id];
        });

    });

}

// module.exports = function(server, app) {

//     // var chatStore = app.get('chatStore');
//     // var chatStore = require('memory-cache');

//     var io = require('socket.io')(server);
//     // io.set("log level", 1);  

//     // var people = []; 
//     var clients = [];
//     var chats = [];

//     function makeRequestList(clients, cb) {
//         var requests = [];

//         for (i in clients) {
//             var item = {};
//             if (!clients[i].isAdmin) {
//                 item.ticketID = clients[i].ticketID;
//                 item.clientID = clients[i].id;
//                 item.userDetails = clients[i].userDetails;
//                 requests.push(item);
//                 // requests[String(clients[i].id)] = item;
//             }
//         }
//         cb(requests);
//     }

//     // initial browser connection
//     io.on('connection', function(client) {

//         //io.sockets.emit("update", "new conn"); // broadcast !
//         console.log('con', client.id);

//         // set details in arrays
//         clients[client.id] = client;
//         clients[client.id].chatActive = false;
//         clients[client.id].isAdmin = false;
//         // clients[client.id].ticketID = '123';
//         // clients[client.id].token = generateToken();

//         // console.log(clients[client.id].token);

//         // client - initial message
//         // clients[client.id].emit('status', {
//         //     msg: "Waiting for ClearNorth Rep"
//         // });

//         // admin - get chat requests
//         clients[client.id].on('getRequests', function() {
//             // console.log(clients);
//             // client.emit('allRequests', {requests: clients});

//             makeRequestList(clients, function(requests) {
//                 // console.log(requests);

//                 client.emit('allRequests', {
//                     requests: requests
//                 });
//             });
//         });

//         // remove disconnected clients
//         clients[client.id].on('disconnect', function() {
//             //io.sockets.emit('user disconnected');
//             delete clients[client.id];
//         });

//         // remove leaving clients
//         clients[client.id].on('leave', function() {
//             //io.sockets.emit('user disconnected');
//             // console.log('leave');

//             clients[client.id].disconnect();
//             delete clients[client.id];
//             // console.log(clients);
//         });

//         // admin - start a chat with client
//         clients[client.id].on('startChat', function(id) {
//             // console.log(clients);
//             // console.log(clients[id.userID].userDetails);
//             // emit event to open a new tab

//             clients[id.userID].activeChat = client.id; // id of admin

//             // clients[client.id].emit('newTab', {
//             //     clientID: id.userID,
//             //     userDetails: clients[id.userID].userDetails
//             // });

//             // console.log(clients[ID]);

//             // start chat at with user
//             var msg = "Now Chatting with " + clients[client.id].adminName;
//             clients[id.userID].emit('status', {
//                 msg: msg,
//                 adminID: client.id,
//                 type: 'connected'
//             });
//         });

//         // admin - set admin
//         clients[client.id].on('isAdmin', function() {
//             // console.log(clients[client.id].id);
//             // console.log(clients[client.id].isAdmin);
//             console.log('admin logged');
//             clients[client.id].isAdmin = true;
//             clients[client.id].adminName = "Admin - 1";
//             // console.log(clients[client.id].chatActive);
//         });

//         // client - get user details 
//         // clients[client.id].on('userDetails', function(data) {
//         //     // console.log(data);
//         //     clients[client.id].userDetails = data.data;
//         //     console.log(clients[client.id].userDetails);
//         // });

//         // admin - admin sent message
//         clients[client.id].on('adminSendMsg', function(data) {
//             // clients[data.clientID].emit('adminMsg', {
//             //     msg: data.msg
//             // });
//          io.sockets.emit("update", "admin msg"); // broadcast !
//         });

//         // client - send a message to admin
//         clients[client.id].on('userSendMsg', function(data) {
//             // console.log(data);
//             // clients[data.adminID].emit('userSendMsg', {
//             //     msg: data.msg,
//             //     userID: client.id
//             // });
//          io.sockets.emit("update", "user msg"); // broadcast !
//         });


//     });
// }


function generateToken() {
    var token = '';
    var availableSymbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321"; // just so they're easier to type, I removed the !@#$%^&*
    for (var i = 0; i < 8; i++) {
        var symbol = availableSymbols[(Math.floor(Math.random() * availableSymbols.length))];
        token += symbol;
    }
    return token;
}
