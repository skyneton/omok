var playerName = "";
var roomList = new Array();
var roomName = "";
var password = "";

var search = "";

var playerNameChange = (_playerName) => {
    playerName = _playerName;
    document.getElementById('myName').innerHTML = playerName;
}

var addPlayerList = (name) => {
    document.getElementsByClassName('playerList')[0].innerHTML += "<p class='playerListItem' id='playerListItem_"+name+"'>"+name+"</p>";
}

var roomCreateSendPacket = (_roomName, _password) => {
    socket.emit('createRoom', {'roomName': _roomName, 'password': _password});
}

var roomQuitSendPacket = () => {
    socket.emit('leaveRoom');
}

var joinRoom = (_roomName, _password = null) => {
    socket.emit('joinRoom', {'roomName': _roomName, 'password': _password});
}

var roomAdminChange = (_roomName, _password) => {
    roomName = _roomName;
    password = _password;

    document.getElementById("nav3").style.display = "inline-block";
    document.getElementById("nav3").value = "방 설정";
    document.getElementById("nav4").value = "시작";
}

var clickToOnlineXY = ((x, y, turn) => {
    var item = document.getElementById("item_"+y+"_"+x);

    audio.currentTime = 0;
    audio.play();
    
    switch(turn) {
        case 0:
            item.style.color = 'black';
            item.innerHTML = "●";
            break;
        case 1:
            item.style.color = 'white';
            item.innerHTML = "●";
            break;
    }
});

var roomCreate = (_roomName, _password, _member = 0) => {
    roomList[_roomName] = { 'roomName': _roomName, 'len': _member, 'password': _password };

    if(search.length >= 1) {
        if(_roomName.includes(search)) {
            var item = document.getElementsByClassName('roomListBox')[0];
            item.innerHTML = "<div class='roomListItem' id='roomListItem_"+_roomName+"' onclick=\"joinRoom('"+_roomName+"')\">"+_roomName+"</div>" + item.innerHTML;
        }
    }else {
        var item = document.getElementsByClassName('roomListBox')[0];
        item.innerHTML = "<div class='roomListItem' id='roomListItem_"+_roomName+"' onclick=\"joinRoom('"+_roomName+"')\">"+_roomName+"</div>" + item.innerHTML;
    }
}

var whoJoinRoom = (_roomName) => {
    roomList[_roomName].len++;
}

var connectRoom = (_roomName) => {
    roomName = _roomName;
    password = null;

    document.getElementsByClassName('roomList')[0].style.display = "none";
    document.getElementsByClassName('roomInfo')[0].innerHTML = roomName;
    document.getElementById("nav3").style.display = "none";
    document.getElementById("nav4").style.display = "inline-block";
    document.getElementById("nav4").value = "준비";
    document.getElementById("nav5").style.display = "inline-block";
    document.getElementsByClassName("roomPlayerList")[0].style.display = "block";
}

var leaveRoom = () => {
    roomName = "";
    password = null;

    document.getElementsByClassName('roomList')[0].style.display = "block";
    document.getElementsByClassName('roomInfo')[0].innerHTML = "방 목록";
    if(document.getElementById("singlePlay").style.display != "block")
        document.getElementById("nav3").style.display = "inline-block";
    document.getElementById("nav3").value = "방 만들기";
    document.getElementById("nav4").style.display = "none";
    document.getElementById("nav5").style.display = "none";
    document.getElementsByClassName("roomPlayerList")[0].innerHTML = "";
    document.getElementsByClassName("roomPlayerList")[0].style.display = "none";
}

var whoQuitRoom = (_roomName) => {
    roomList[_roomName].len--;
}

var roomSearch = (_search) => {
    search = _search;
    var item = document.getElementsByClassName('roomListBox')[0];
    item.innerHTML = "";
    
    for(var key in roomList) {
        if(search.length >= 1) {
            if(roomList[key].roomName.includes(search))
                item.innerHTML = "<div class='roomListItem' id='roomListItem_"+roomList[key].roomName+"' onclick=\"joinRoom('"+roomList[key].roomName+"')\">"+roomList[key].roomName+"</div>" + item.innerHTML;
        }else
            item.innerHTML = "<div class='roomListItem' id='roomListItem_"+roomList[key].roomName+"' onclick=\"joinRoom('"+roomList[key].roomName+"')\">"+roomList[key].roomName+"</div>" + item.innerHTML;
    }
}

var roomDelete = (_roomName) => {
    delete roomList[_roomName];

    var item = document.getElementById('roomListItem_'+_roomName);
    if(item != null) {
        document.getElementsByClassName('roomListBox')[0].removeChild(item);
    }
}

var removePlayerList = (name) => {
    var removeItem = document.getElementById("playerListItem_"+name);
    if(removeItem != null)
        document.getElementsByClassName('playerList')[0].removeChild(removeItem);
}

var playerListNameChange = (oldName, newName) => {
    var oldItem = document.getElementById("playerListItem_"+oldName);
    oldItem.id = "playerListItem_"+newName;
    oldItem.innerHTML = newName;

    var item = document.getElementById('roomPlayerItem_'+oldName);
    if(item != null) {
        item.firstChild.innerHTML = newName;
        item.id = 'roomPlayerItem_'+newName;
    }
}

var nameChangePacketSend = (newName) => {
    socket.emit('nameChange', newName);
}

var boardClickSendPacket = (x, y) => {
    socket.emit('boardClick', { 'x': x, 'y': y });
}

var readyStatusSendPacket = () => {
    socket.emit('clientStatusChange');
}

var chatPacketSend = (data) => {
    socket.emit('message', data);
}

var mapCreatePacket = (data) => {
    socket.emit
}

var chattingMessageGet = (sender, message) => {
    var chatItem = document.createElement("div");
    chatItem.className = "chat_list_item"

    var name = document.createElement("span");
    name.innerHTML = sender;
    name.className = "chat_sender";

    var msg = document.createElement("span");
    msg.innerHTML = message;
    msg.className = "chat_message";

    var time = document.createElement("span");
    time.innerHTML = new Date().format("hh:mm:ss a/p");
    time.className = "chat_time"

    chatItem.appendChild(name);
    chatItem.appendChild(msg);
    chatItem.appendChild(time);

    
    var chatBox = document.getElementsByClassName('chattingBox')[0];
    chatBox.appendChild(chatItem);
    chatBox.scrollTop = chatBox.scrollHeight;
}

Date.prototype.format = function(f) {
    if(!this.valueOf()) return "";

    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|hh|mm|ss|a\/p)/gi, function($1) {
        switch($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h=d.getHours() % 12) ? h:12).zf(2) * 1;
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "AM":"PM";
            default: return $1;
        }
    });
};

String.prototype.string = function(len) { var s = '', i = 0; while(i++ < len) { s += this; } return s; };
String.prototype.zf = function(len) { return "0".string(len - this.length) + this; };
Number.prototype.zf = function(len) { return this.toString().zf(len); };