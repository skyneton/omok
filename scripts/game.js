var gameData = {
    GameType : 2,
    DuringGame : false,
    NowTurn : 0,
    BotAIVersion : 0,
    TurnChange : function(item) {
        if(this.NowTurn == 0) {
            this.NowTurn = 1;
            item.innerHTML = "하얀 턴";
        } else {
            this.NowTurn = 0;
            item.innerHTML = "검정 턴";
        }
    },
    ClickCheck : function(item) {
        if(item.innerHTML == '')
            return false;
        return true;
    },
    GetType : function(item) {
        if(item.style.color == 'black')
            return 0;
        return 1;
    }
}

var audio = new Audio();
audio.src = "sound/basic.mp3";

var boardClick = ((x, y) => {
    if(roomName.length >= 1) {
        boardClickSendPacket(x, y);
    }else {
        if(gameData.NowTurn == 0 | gameData.GameType == 1)
        clickToXY(x, y);
    }
});

var clickToXY = ((x, y) => {
    var item = document.getElementById("item_"+y+"_"+x);

    if(gameData.DuringGame == false) {
        gameData.DuringGame = true;
    }

    if(!gameData.ClickCheck(item)) {

        audio.currentTime = 0;
        audio.play();
        
        if(gameData.NowTurn == 0) {
            item.style.color = 'black';
            item.innerHTML = "●";
        }
        if(gameData.NowTurn == 1) {
            item.style.color = 'white';
            item.innerHTML = "●";
        }

        var check = gameClearCheck(x, y);
        if(check == 1) {
            setTimeout(function() {
                switch(gameData.NowTurn) {
                    case 0:
                        if(gameData.GameType == 1)
                            alert('검정 돌이 승리하였습니다.');
                        else
                            alert('플레이어가 승리하였습니다.');
                        break;
                    case 1:
                        if(gameData.GameType == 1)
                            alert('하얀 돌이 승리하였습니다.');
                        else
                            alert('컴퓨터가 승리하였습니다.');
                        break;
                }
                dataClear();
            }, 100);

        }else if(check == 2) {
            setTimeout(function() {
                alert('무승부!');
                dataClear();
            }, 100);

        }else {
            gameData.TurnChange(document.getElementsByClassName('turnNow')[0]);

            if(gameData.GameType == 2) {
                if(gameData.NowTurn == 1) {
                    targetBoardArray[targetBoardArray.length] = x+"_"+y;
                    if(gameData.BotAIVersion == 0)
                        botAIEasy(x, y);
                    else
                        botAINormal(x, y);
                }
            }
        }
    }
});

var dataClear = (() => {
    gameData.NowTurn = 0;
    gameData.DuringGame = false;
    
    document.getElementsByClassName('turnNow')[0].innerHTML = "검정 턴";

    targetBoardArray = [];
    meBoardArray = [];

    omocBoardClear();
})

var gameClearCheck = ((x, y) => {
    { //오른위에서 내려오는 대각선.
        var check = 1;

        var _y = y;
        var _x = x;
        for(var i = 0; i < 5; i++) {
            _y -= 1;
            _x += 1;
            var item = document.getElementById("item_"+_y+"_"+_x);
            if(item == null) break;
            if(gameData.ClickCheck(item) && gameData.GetType(item) == gameData.NowTurn) {
                check++;
            }else break;
        }

        _y = y;
        _x = x;
        for(var i = 0; i < 5; i++) {
            _y += 1;
            _x -= 1;
            var item = document.getElementById("item_"+_y+"_"+_x);
            if(item == null) break;
            if(gameData.ClickCheck(item) && gameData.GetType(item) == gameData.NowTurn) {
                check++;
            }else break;
        }

        if(check >= 5) return 1;
    }
    
    { //왼쪽위에서 내려오는 대각선
        var check = 1;

        var _y = y;
        var _x = x;
        for(var i = 0; i < 5; i++) {
            _y -= 1;
            _x -= 1;
            var item = document.getElementById("item_"+_y+"_"+_x);
            if(item == null) break;
            if(gameData.ClickCheck(item) && gameData.GetType(item) == gameData.NowTurn) {
                check++;
            }else break;
        }

        _y = y;
        _x = x;
        for(var i = 0; i < 5; i++) {
            _y += 1;
            _x += 1;
            var item = document.getElementById("item_"+_y+"_"+_x);
            if(item == null) break;
            if(gameData.ClickCheck(item) && gameData.GetType(item) == gameData.NowTurn) {
                check++;
            }else break;
        }

        if(check >= 5) return 1;
    }
    
    { //수직방향
        var check = 1;

        var _y = y;
        for(var i = 0; i < 5; i++) {
            _y -= 1;
            var item = document.getElementById("item_"+_y+"_"+x);
            if(item == null) break;
            if(gameData.ClickCheck(item) && gameData.GetType(item) == gameData.NowTurn) {
                check++;
            }else break;
        }

        _y = y;
        for(var i = 0; i < 5; i++) {
            _y += 1;
            var item = document.getElementById("item_"+_y+"_"+x);
            if(item == null) break;
            if(gameData.ClickCheck(item) && gameData.GetType(item) == gameData.NowTurn) {
                check++;
            }else break;
        }

        if(check >= 5) return 1;
    }
    
    { //수평방향
        var check = 1;

        var _x = x;
        for(var i = 0; i < 5; i++) {
            _x -= 1;
            var item = document.getElementById("item_"+y+"_"+_x);
            if(item == null) break;
            if(gameData.ClickCheck(item) && gameData.GetType(item) == gameData.NowTurn) {
                check++;
            }else break;
        }

        _x = x;
        for(var i = 0; i < 5; i++) {
            _x += 1;
            var item = document.getElementById("item_"+y+"_"+_x);
            if(item == null) break;
            if(gameData.ClickCheck(item) && gameData.GetType(item) == gameData.NowTurn) {
                check++;
            }else break;
        }

        if(check >= 5) return 1;
    }

    for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            if(!gameData.ClickCheck(document.getElementById("item_"+y+"_"+x)))
                return 0;
        }
    }
    
    return 2;
});