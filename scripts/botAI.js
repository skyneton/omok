var targetBoardArray = new Array(); //적(검정) 알 둔 위치 변수
var meBoardArray = new Array();
var botDelay = 1;

var botAIEasy = ((x, y) => {
    setTimeout(function() {
        var DefenceWeightList = new Array();
        var AttackWeightList = new Array();


        var checkList = JSON.parse(JSON.stringify(targetBoardArray));
        

        var output = BotDecisionCheck(x, y);
        DefenceWeightList[DefenceWeightList.length] = { weight: output.split("-")[0] * 1, x: output.split("-")[1].split("_")[0] * 1, y: output.split("-")[1].split("_")[1] * 1 };
        
        checkList.splice(x+"_"+y, 1);

        var dataIndex;
        var data = "";
        for(var i = 0; i < 30; i++) {
            if(checkList.length <= 0) break;
            dataIndex = Math.floor(Math.random() * checkList.length);
            data = checkList[dataIndex];
            checkList.splice(data, 1);

            var dataArr = data.split("_");

            output = BotDecisionCheck(dataArr[0] * 1, dataArr[1] * 1);
            DefenceWeightList[DefenceWeightList.length] = { weight: output.split("-")[0] * 1, x: output.split("-")[1].split("_")[0] * 1, y: output.split("-")[1].split("_")[1] * 1 };
        }

        var weight = 0;
        var targetX, targetY;
        DefenceWeightList.forEach(i => {
            if(weight < i['weight']) {
                weight = i['weight'];
                targetX = i['x'];
                targetY = i['y'];
            }
        })

        
        for(var i = 0; i < meBoardArray.length; i++) {
            data = meBoardArray[i];

            var dataArr = data.split("_");

            output = BotDecisionCheck(dataArr[0] * 1, dataArr[1] * 1, 1);
            AttackWeightList[AttackWeightList.length] = { weight: output.split("-")[0] * 1, x: output.split("-")[1].split("_")[0] * 1, y: output.split("-")[1].split("_")[1] * 1 };
        }

        
        var AttackWeight = 0;
        var attackTargetX, attackTargetY;
        AttackWeightList.forEach(i => {
            if(AttackWeight < i['weight']) {
                AttackWeight = i['weight'];
                attackTargetX = i['x'];
                attackTargetY = i['y'];
            }
        })

        
        //if(Math.abs(_x - RightDownLoc.split("_")[0]))

        if(AttackWeight > 3) {
            clickToXY(attackTargetX, attackTargetY);
            meBoardArray[meBoardArray.length] = attackTargetX+"_"+attackTargetY;
        } else if(weight >= 3) {
            clickToXY(targetX, targetY);
            meBoardArray[meBoardArray.length] = targetX+"_"+targetY;
        } else if(AttackWeightList != 0) {
            clickToXY(attackTargetX, attackTargetY);
            meBoardArray[meBoardArray.length] = attackTargetX+"_"+attackTargetY;
        } else
            randomClick();

        return;

        randomClick();
    }, botDelay * 1000);

    var randomClick = () => {
        var x = Math.floor(Math.random() * height);
        var y = Math.floor(Math.random() * width);

        if(!gameData.ClickCheck(document.getElementById("item_"+y+"_"+x))) {
            clickToXY(x, y);
            meBoardArray[meBoardArray.length] = x+"_"+y;
        } else
            randomClick();
    };

    var BotDecisionCheck = ((x, y, targetId = 0) => {
        var weightRightDown = 1, weightLeftDown = 1, weightLeft = 1, weightDown = 1;
        var RightDownLoc = "", LeftDownLoc = "", LeftLoc = "", DownLoc = "";

        { //오른위에서 내려오는 대각선.
            var barrier = 0;
            var check = false;
            var _y = y, _x = x;

            for(var i = 0; i < 5; i++) {
                _y--; _x++;
                var item = document.getElementById("item_"+_y+"_"+_x);
                if(item == null) { barrier = _x; check = true; weightRightDown -= 0.5; break; }
                if(gameData.ClickCheck(item)) {
                    if(gameData.GetType(item) == targetId)
                        weightRightDown++;
                    else {
                        barrier = _x;
                        check = true;
                        weightRightDown -= 0.5;
                        break;
                    }
                }else {
                    if(RightDownLoc == "")
                        RightDownLoc = _x+"_"+_y;

                    var nextItem = document.getElementById("item_"+(_y-1)+"_"+(_x+1));
                    if(nextItem == null) {
                        barrier = _x+1;
                        check = true;
                        // weightRightDown -= 0.5;
                        break;
                    }
                    if(!gameData.ClickCheck(nextItem)) break;
                }
                // var nextItem = document.getElementById("item_"+(_y-1)+"_"+(_x+1));
                // if(nextItem == null) { barrier = _x+1; check = true; weightRightDown -= 0.5; break; }
                // if(!gameData.ClickCheck(nextItem)) break;
            }

            _y = y; _x = x;
            for(var i = 0; i < 5; i++) {
                _y++; _x--;
                var item = document.getElementById("item_"+_y+"_"+_x);
                if(item == null) {
                    if(check && Math.abs(barrier - _x) <= 5)
                        weightRightDown = 0; weightRightDown -= 0.5; break;
                }
                if(gameData.ClickCheck(item)) {
                    if(gameData.GetType(item) == targetId)
                        weightRightDown++;
                    else {
                        if(check && Math.abs(barrier - _x) <= 5)
                            weightRightDown = 0;

                        weightRightDown -= 0.5;
                        break;
                    }
                }else {
                    if(RightDownLoc == "")
                        RightDownLoc = _x+"_"+_y;

                    var nextItem = document.getElementById("item_"+(_y-1)+"_"+(_x+1));
                    if(nextItem == null) {
                        if(check && Math.abs(barrier - (_x-1)) <= 5)
                            weightRightDown = 0;
                        break;
                    }
                    if(!gameData.ClickCheck(nextItem)) break;
                }
                /*var nextItem = document.getElementById("item_"+(_y-1)+"_"+(_x+1));
                if(nextItem == null) {
                    if(check && Math.abs(barrier - (_x-1)) <= 5)
                        weightRightDown = 0;
                    weightRightDown -= 0.5; break;
                }*/
                // if(!gameData.ClickCheck(nextItem)) break;
            }
        }
        
        { //왼쪽위에서 내려오는 대각선
            var barrier = 0;
            var check = false;
            var _y = y, _x = x;
            for(var i = 0; i < 5; i++) {
                _y--; _x--;
                var item = document.getElementById("item_"+_y+"_"+_x);
                if(item == null) { barrier = _x; check = true; weightLeftDown -= 0.5; break; }
                if(gameData.ClickCheck(item)) {
                    if(gameData.GetType(item) == targetId)
                        weightLeftDown++;
                    else {
                        barrier = _x;
                        check = true;
                        weightLeftDown -= 0.5;
                        break;
                    }
                }else {
                    if(LeftDownLoc == "")
                        LeftDownLoc = _x+"_"+_y;

                    var nextItem = document.getElementById("item_"+(_y-1)+"_"+(_x-1));
                    if(nextItem == null) {
                        barrier = _x-1;
                        check = true;
                        // weightLeftDown -= 0.5;
                        break;
                    }
                    if(!gameData.ClickCheck(nextItem)) break;
                }
                // var nextItem = document.getElementById("item_"+(_y-1)+"_"+(_x-1));
                // if(nextItem == null) { barrier = _x-1; check = true; weightLeftDown -= 0.5; break; }
                // if(!gameData.ClickCheck(nextItem)) break;
            }

            _y = y; _x = x;
            for(var i = 0; i < 5; i++) {
                _y++; _x++;
                var item = document.getElementById("item_"+_y+"_"+_x);
                if(item == null) {
                    if(check && Math.abs(barrier - _x) <= 5)
                        weightLeftDown = 0;
                    weightLeftDown -= 0.5;
                    break;
                }
                if(gameData.ClickCheck(item)) {
                    if(gameData.GetType(item) == targetId)
                        weightLeftDown++;
                    else {
                        if(check && Math.abs(barrier - _x) <= 5)
                            weightLeftDown = 0;

                        weightLeftDown -= 0.5;
                        break;
                    }
                }else {
                    if(LeftDownLoc == "")
                        LeftDownLoc = _x+"_"+_y;
                    
                    var nextItem = document.getElementById("item_"+(_y+1)+"_"+(_x+1));
                    if(nextItem == null) {
                        if(check && Math.abs(barrier - (_x+1)) <= 5)
                            weightLeftDown = 0;
                        break;
                    }
                    if(!gameData.ClickCheck(nextItem)) break;
                }
                // var nextItem = document.getElementById("item_"+(_y+1)+"_"+(_x+1));
                // if(nextItem == null) {
                //     if(check && Math.abs(barrier - (_x+1)) <= 5)
                //         weightLeftDown = 0;
                //     weightLeftDown -= 0.5;
                //     break;
                // }
                // if(!gameData.ClickCheck(nextItem)) break;
            }
        }
        
        { //수직방향
            var barrier = 0;
            var check = false;
            var _y = y;
            for(var i = 0; i < 5; i++) {
                _y--;
                var item = document.getElementById("item_"+_y+"_"+x);
                if(item == null) { barrier = _y; check = true; weightDown -= 0.5; break; }
                if(gameData.ClickCheck(item)) {
                    if(gameData.GetType(item) == targetId)
                        weightDown++;
                    else {
                        barrier = _y;
                        check = true;
                        weightDown -= 0.5;
                        break;
                    }
                }else {
                    if(DownLoc == "")
                        DownLoc = x+"_"+_y;

                    var nextItem = document.getElementById("item_"+(_y-1)+"_"+x);
                    if(nextItem == null) {
                        barrier = _y-1;
                        check = true;
                        // weightDown -= 0.5;
                        break;
                    }
                    if(!gameData.ClickCheck(nextItem)) break;
                }
                // var nextItem = document.getElementById("item_"+(_y-1)+"_"+x);
                // if(nextItem == null) { barrier = _y - 1; check = true; weightDown -= 0.5; break; }
                // if(!gameData.ClickCheck(nextItem)) break;
            }

            _y = y;
            for(var i = 0; i < 5; i++) {
                _y++;
                var item = document.getElementById("item_"+_y+"_"+x);
                if(item == null) {
                    if(check && Math.abs(barrier - _y) <= 5)
                        weightDown = 0;
                    weightDown -= 0.5;
                    break;
                }
                if(gameData.ClickCheck(item)) {
                    if(gameData.GetType(item) == targetId)
                        weightDown++;
                    else {
                        if(check && Math.abs(barrier - _y) <= 5)
                        weightDown = 0;
                            
                        weightDown -= 0.5;
                        break;
                    }
                }else {
                    if(DownLoc == "")
                        DownLoc = x+"_"+_y;

                    var nextItem = document.getElementById("item_"+(_y+1)+"_"+x);
                    if(nextItem == null) {
                        if(check && Math.abs(barrier - (_y+1)) <= 5)
                            weightDown = 0;
                        break;
                    }
                    if(!gameData.ClickCheck(nextItem)) break;
                }
                // var nextItem = document.getElementById("item_"+(_y+1)+"_"+x);
                // if(nextItem == null) {
                //     if(check && Math.abs(barrier - (_y+1)) <= 5)
                //         weightDown = 0;
                //     weightDown -= 0.5;
                //     break;
                // }
                // if(!gameData.ClickCheck(nextItem)) break;
            }
        }
        
        { //수평방향
            var barrier = 0;
            var check = false;
            var _x = x;
            for(var i = 0; i < 5; i++) {
                _x--;
                var item = document.getElementById("item_"+y+"_"+_x);
                if(item == null) { barrier = _x; check = true; weightLeft -= 0.5; break; }
                if(gameData.ClickCheck(item)) {
                    if(gameData.GetType(item) == targetId)
                        weightLeft++;
                    else {
                        barrier = _x;
                        check = true;
                        weightLeft -= 0.5;
                        break;
                    }
                }else {
                    if(LeftLoc == "")
                        LeftLoc = _x+"_"+y;

                    var nextItem = document.getElementById("item_"+y+"_"+(_x-1));
                    if(nextItem == null) {
                        barrier = _x-1;
                        check = true;
                        // weightLeft -= 0.5;
                        break;
                    }
                    if(!gameData.ClickCheck(nextItem)) break;
                }
                //var nextItem = document.getElementById("item_"+y+"_"+(_x-1));
                //if(nextItem == null) { barrier = _x; check = true; weightLeft -= 0.5; break; }
                //if(!gameData.ClickCheck(nextItem)) break;
            }

            _x = x;
            for(var i = 0; i < 5; i++) {
                _x++;
                var item = document.getElementById("item_"+y+"_"+_x);
                if(item == null) {
                    if(check && Math.abs(barrier - _x) <= 5)
                        weightLeft = 0;
                    weightLeft -= 0.5;
                    break;
                }
                if(gameData.ClickCheck(item)) {
                    if(gameData.GetType(item) == targetId)
                        weightLeft++;
                    else {
                        if(check && Math.abs(barrier - _x) <= 5)
                            weightLeft = 0;
                            
                        weightLeft -= 0.5;
                        break;
                    }
                }else {
                    if(LeftLoc == "")
                        LeftLoc = _x+"_"+y;

                    var nextItem = document.getElementById("item_"+y+"_"+(_x+1));
                    if(nextItem == null) {
                        if(check && Math.abs(barrier - (_x+1)) <= 5)
                            weightLeft = 0;
                        break;
                    }
                    if(!gameData.ClickCheck(nextItem)) break;
                }
                /*var nextItem = document.getElementById("item_"+y+"_"+(_x+1));
                if(nextItem == null) {
                    if(check && Math.abs(barrier - (_x+1)) <= 5)
                        weightLeft = 0;
                    weightLeft -= 0.5;
                    break;
                }
                if(!gameData.ClickCheck(nextItem)) break;*/
            }
        }

        var max = 0;
        if(weightRightDown > max && RightDownLoc != "")
            max = weightRightDown;

        if(weightLeftDown > max && LeftDownLoc != "")
            max = weightLeftDown;

        if(weightDown > max && DownLoc != "")
            max = weightDown;

        if(weightLeft > max && LeftLoc != "")
            max = weightLeft;

        if(weightRightDown == max && RightDownLoc != "")
            return weightRightDown+"-"+RightDownLoc;

        if(weightLeftDown == max && LeftDownLoc != "")
            return weightLeftDown+"-"+LeftDownLoc;

        if(weightDown == max && DownLoc != "")
            return weightDown+"-"+DownLoc;

        if(weightLeft == max && LeftLoc != "")
            return weightLeft+"-"+LeftLoc;

        return "0-0_0";
    });
    
});