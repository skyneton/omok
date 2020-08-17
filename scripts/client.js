var socket = io.connect("https://skyneton-omoc.herokuapp.com/");

socket.on('connect', () => {
    console.log("소켓 연결 성공");
});

socket.on('disconnect', () => {
    console.log("소켓 끉어짐");
    socket.close();
});

socket.on('connect_error', () => {
    socket.close();
    if(document.getElementById("singlePlay").style.display == "" | document.getElementById("singlePlay").style.display == "none") {
        alert("서버가 다운되었거나 네트워크에 연결되어 있지 않습니다.");
        singleModeChange();
    }
});

socket.on('createRoom', (data) => {
    //방 추가 함수
    if(data.len != null)
        roomCreate(data.roomName, data.password, data.len);
    else
        roomCreate(data.roomName, data.password);
});

socket.on('deleteRoom', (data) => {
    //방 제거 함수
    roomDelete(data);
});

socket.on('leaveRoom', () => {
    //방 나감
    leaveRoom();
});

socket.on('roomAdmin', (data) => {
    document.getElementById('roomNameInput').value = "";
    document.getElementsByClassName('roomCreate')[0].style.display = "none";

    var item = document.getElementById('roomPlayerItem_'+playerName);
    if(item != null) {
        item.lastChild.style.color = "aqua";
        item.lastChild.innerHTML = "준비";
    }
    
    roomAdminChange(data.roomName, data.password);
});

socket.on('joinRoom', (data) => {
    //방 들어감
    document.getElementById('roomNameInput').value = "";
    document.getElementsByClassName('roomCreate')[0].style.display = "none";

    connectRoom(data);
});

socket.on('roomPlayerList', (data) => {
    var item = document.getElementsByClassName("roomPlayerList")[0];
    item.innerHTML += "<div class='roomPlayerBox' id='roomPlayerItem_"+data.playerName+"'><h3>"+data.playerName+"</h3>"+((data.ready) ? "<div style='color: aqua'>준비" : "<div style='color: gray'>준비중") + "</div></div>";
});

socket.on('roomPasswdPls', (data) => {
    var pw = prompt("비밀번호를 입력해 주세요.");
    if(pw != null && pw != '')
        joinRoom(data, pw);
});

socket.on('joinRoomPlayer', (data) => {
    //data 방 들어옴
    whoJoinRoom(data);
});

socket.on('leaveRoomPlayer', (data) => {
    //data 방 나감
    whoQuitRoom(data);
});

socket.on('changeRoom', (data) => {
    roomList[data.newName] = {'roomName': data.newName, 'len': roomList[data.oldName].len, 'password': data.password };
    delete roomList[data.oldName];

    var item = document.getElementById('roomListItem_'+data.oldName);
    if(item != null) {
        item.innerHTML = data.newName;
        item.id = 'roomListItem_'+data.newName;
    }
});

socket.on('roomDataChanged', (data) => {
    document.getElementById('roomNameInput').value = "";
    document.getElementsByClassName('roomCreate')[0].style.display = "none";

    connectRoom(data);
})

socket.on('joinPlayer', (data) => {
    //data가 방에 들어옴
    chattingMessageGet("SYSTEM", data+" 님이 방에 입장하였습니다.");
    var item = document.getElementsByClassName("roomPlayerList")[0];
    item.innerHTML += "<div class='roomPlayerBox' id='roomPlayerItem_"+data+"'><h3>"+data+"</h3><div style='color: gray'>준비중</div></div>";
});

socket.on('leavePlayer', (data) => {
    //data가 방을 나감
    chattingMessageGet("SYSTEM", data+" 님이 방에 퇴장하였습니다.");
    var item = document.getElementById('roomPlayerItem_'+data);
    if(item != null)
        document.getElementsByClassName("roomPlayerList")[0].removeChild(item);
});

socket.on('myReadyStatusChange', (data) => {
    if(data) {
        document.getElementById("nav4").value = "취소";
    }else {
        document.getElementById("nav4").value = "준비";
    }
});

socket.on('readyStatusChange', (data) => {
    var item = document.getElementById('roomPlayerItem_'+data.playerName);
    if(item != null) {
        if(data.status) {
            item.lastChild.style.color = "aqua";
            item.lastChild.innerHTML = "준비";
        }else {
            item.lastChild.style.color = "gray";
            item.lastChild.innerHTML = "준비중";
        }
    }
});

socket.on('message', (data) => {
    chattingMessageGet(data.sender, data.message);
});

socket.on('nickName', (data) => {
    playerNameChange(data);
});

socket.on('nickChange', (data) => {
    playerListNameChange(data.oldName, data.newName);
})

socket.on('join', (data) => {
    addPlayerList(data);
});

socket.on('quit', (data) => {
    removePlayerList(data);
});

socket.on('alertMessage', (data) => {
    alert(data);
})




socket.on('gameStart', () => {
    document.getElementById("nav1").style.display = "none";
    document.getElementById("nav2").style.display = "none";
    document.getElementById("nav3").style.display = "none";
    document.getElementById("nav4").style.display = "none";

    document.getElementById("multiPlay").style.display = "none";
    document.getElementById("gameNow").style.display = "block";

    document.getElementsByClassName("turnNow")[0].style.color = "gray";
    document.getElementsByClassName("turnNow")[0].innerHTML = "상대 턴";
});

socket.on('myTurnNow', () => {
    document.getElementsByClassName("turnNow")[0].style.color = "aquamarine";
    document.getElementsByClassName("turnNow")[0].innerHTML = "내 턴";
});

socket.on('otherTurnNow', () => {
    document.getElementsByClassName("turnNow")[0].style.color = "gray";
    document.getElementsByClassName("turnNow")[0].innerHTML = "상대 턴";
});

socket.on('boardClick', (data) => {
    clickToOnlineXY(data.x, data.y, data.turn);
});

socket.on('gameEnd', () => {
    document.getElementById("nav1").style.display = "inline-block";
    document.getElementById("nav2").style.display = "inline-block";
    document.getElementById("nav3").style.display = "inline-block";
    document.getElementById("nav4").style.display = "inline-block";

    document.getElementById("multiPlay").style.display = "block";
    document.getElementById("gameNow").style.display = "none";

    omocBoardClear();
});