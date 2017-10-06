const mongo = require('mongodb').MongoClient;
const credentials = require('./credentials');
/** Express模块,本项目用不到
var express=require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
app.listen(9009);
app.use(express.static(__dirname+'/static'));
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('body-parser').json());
app.get('/', function (req, res) {
    res.sendFile(__dirname+'/index.html');
});
*/
const client = require('socket.io').listen(4001).sockets;

mongo.connect(credentials.Mongo,function (err, db) {
    if(err) throw err;

        console.log("MongoDB Connected.");
        client.on('connection',function(socket) {
            console.log('Socket connected.');
            let chat = db.collection('chats');
            let sendStatus = function (s) {
                socket.emit('status', s);
            };
            chat.find({}).limit(100).sort({_id:1}).toArray(function (err, res) {
                if(err) throw err;
                socket.emit('output', res);
            });

            socket.on('input',function (data) {
                console.log("收到input：", data.message);
                let message = data.message;
                if(message||message!=="") {
                    chat.insertOne({name:"cxd",message:message},function () {
                        client.emit('output',[data]);
                        sendStatus({message:"Message sent",clear:true});
                    });
                }else {
                    sendStatus("Please enter right!");
                }
            });
            socket.on('clear_all',function (data) {
                chat.removeMany({},function () {
                    client.emit('output',[]);
                    sendStatus("cleared");
                })
            });
            socket.on('disconnect', function () {
                client.emit('失去连接');
                console.log('Disconnected');
            });
        });


});