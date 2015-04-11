var socketio = require('socket.io');

//建立一個新的 socket.io server
var io = socketio(8080);//port

//建立一個userlist物件
var userList = {};

//紀錄username和socket id 對應
var user_match = {};

//每條新的連線近來都要做事件綁定
io.on('connection',function(socket){
	console.log('some one',socket.id);
	
  //使用者上線通知
  socket.on('user_in',function(nickname){
	  userList[socket.id] = nickname;
	  user_match[socket.id]=socket;
	  io.emit('user_list',userList);
  });
  
  //使用者離線通知
  socket.on('disconnect',function(){
	  delete userList[socket.id];
	  delete user_match[socket.id];
	  io.emit('user_list',userList);
  });
	
	//收到訊息並發送給所有人
  socket.on('message',function(form,msg){
	  io.emit('message',form,msg);
  });
  
  //私訊給特定人
  socket.on('private message',function(form, sendToId, msg){
    //io.emit io是給全體
    user_match[sendToId].emit('private message', form, msg);
  
  });
  
});

/*setTimeout(
	function(){
	console.log('hello world');
},2000);
setTimeout(
	function(){
	console.log('ha ha ha ');
},1000);
*/
//結果 hahaha 會先執行 因為time設的比較短