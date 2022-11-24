//made By 구잘(dksgusals99)

const instance = this;
let gameBoard = board();

this.placeStone = (x, y, color) => {
    let c = 0;
    if (color) {
        c = -1;
    } else {
        c = 1;
    }
    gameBoard[x][y] = c;
};

this.auto = () => {
    let wgb = calc(gameBoard, 1, -1);
    let m = 0;
    let ta = [];
    let r = 0;
    for (let y = 1; y <= 24; y++) {
        let data = "";
        for (let x = 1; x <= 23; x++) {
            data += wgb[x][y] + " ";
        }
    }
    m = aamax(wgb);
    for (let y = 1; y <= 24; y++) {
        for (let x = 1; x <= 23; x++) {
            if (wgb[x][y] == m && gameBoard[x][y] == 0) {
                ta.push({ x: x, y: y });
            }
        }
    }
    if (ta.length > 0) {
        r = getRandomInt(0, ta.length);
        return ta[r];
    }
};

function pev(a, b, c, d) {
    let m, mm, n, nn;
    if (a > b) {
        m = a;
        mm = c;
        n = b;
        nn = d;
    } else {
        m = b;
        mm = d;
        n = a;
        nn = c;
    }
    if (m != 0 && n != 0) {
        if (m + n == 4) {
            return 9;
        } else if (m + n == 3) {
            if (nn != 0 && mm != 0) {
                return 0;
            } else {
                return 8;
            }
        } else {
            if (nn != 0 || mm != 0) {
                return 0;
            } else {
                return m + n;
            }
        }
    } else {
        if (m == 4) {
            return 9;
        } else if (m == 3) {
            if (mm != 0) {
                return 0;
            } else {
                return 7;
            } 
        } else {
            if (mm != 0) {
                return 0;
            } else {
                return m;
            }
        }
    }
}

function aev(a, b, c, d) {
    let m, mm, n, nn;
    if (a && b) {
        if (a > b) {
            m = a;
            mm = c;
            n = b;
            nn = d;
        } else {
            m = b;
            mm = d;
            n = a;
            nn = c;
        }
        if (m + n == 4) {
            return 10;
        } else if (m + n == 3) {
            if (nn != 0 || mm != 0) {
                return 0;
            } else {
                return 9;
            }
        } else {
            if (nn != 0 || mm != 0) {
                return 0;
            } else {
                return m + n;
            }
        }
    } else {
        if (a > b) {
            m = a;
            mm = c;
            n = b;
            nn = d;
        } else {
            m = b;
            mm = d;
            n = a;
            nn = c;
        }
        if (m == 4) {
            return 10;
        } else if (m == 3) {
            if (mm != 0) {
                return 0;
            }
            return 8;
        } else {
            if (mm != 0) {
                return 0;
            } else {
                return m;
            }
        }
    }
}

function max(a, b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}
function min(a, b) {
    if (a < b) {
        return a;
    } else {
        return b;
    }
}
function amax(arr) {
    return arr.reduce((acc, cur) => max(acc, cur));
}
function amin(arr) {
    return arr.reduce((acc, cur) => min(acc, cur));
}
function aamax(arr) {
    return amax(arr.map(x => amax(x)));
}
function aamin(arr) {
    return amin(arr.map(x => amin(x)));
}

function calc(gb, me, op) {
    let pgb = board();
    let agb = board();
    for (let y = 1; y <= 24; y++) {
        for (let x = 1; x <= 23; x++) {
            let count0, count1, next0, next1, result;
            if (gb[x][y] == 0) {
                //막기 가중치 계산
                count0 = count1 = 0;
                for (let i = 1; gb[x + i][y] == op; i++) {
                    count0++;
                }
                next0 = gb[x + (count0 + 1)][y];
                for (let i = 1; gb[x - i][y] == op; i++) {
                    count1++;
                }
                next1 = gb[x - (count1 + 1)][y];
                result = pev(count0, count1, next0, next1);
                pgb[x][y] = max(pgb[x][y], result);

                count0 = count1 = 0;
                for (let i = 1; gb[x][y + i] == op; i++) {
                    count0++;
                }
                next0 = gb[x][y + (count0 + 1)];
                for (let i = 1; gb[x][y - i] == op; i++) {
                    count1++;
                }
                next1 = gb[x][y - (count1 + 1)];
                result = pev(count0, count1, next0, next1);
                pgb[x][y] = max(pgb[x][y], result);

                count0 = count1 = 0;
                for (let i = 1; gb[x + i][y + i] == op; i++) {
                    count0++;
                }
                next0 = gb[x + (count0 + 1)][y + (count0 + 1)];
                for (let i = 1; gb[x - i][y - i] == op; i++) {
                    count1++;
                }
                next1 = gb[x - (count1 + 1)][y - (count1 + 1)];
                result = pev(count0, count1, next0, next1);
                pgb[x][y] = max(pgb[x][y], result);

                count0 = count1 = 0;
                for (let i = 1; gb[x + i][y - i] == op; i++) {
                    count0++;
                }
                next0 = gb[x + (count0 + 1)][y - (count0 + 1)];
                for (let i = 1; gb[x - i][y + i] == op; i++) {
                    count1++;
                }
                next1 = gb[x - (count1 + 1)][y + (count1 + 1)];
                result = pev(count0, count1, next0, next1);
                pgb[x][y] = max(pgb[x][y], result);
            }
        }
    }

    //공격 가중치 계산
    for (let y = 1; y <= 24; y++) {
        for (let x = 1; x <= 23; x++) {
            let c0, c1, n0, n1, r;
            if (gb[x][y] == 0) {
                c0 = c1 = 0;
                for (let i = 1; gb[x + i][y] == me; i++) {
                    c0++;
                }
                n0 = gb[x + (c0 + 1)][y];
                for (let i = 1; gb[x - i][y] == me; i++) {
                    c1++;
                }
                n1 = gb[x - (c1 + 1)][y];
                r = aev(c0, c1, n0, n1);
                agb[x][y] = max(agb[x][y], r);

                c0 = c1 = 0;
                for (let i = 1; gb[x][y + i] == me; i++) {
                    c0++;
                }
                n0 = gb[x][y + (c0 + 1)];
                for (let i = 1; gb[x][y - i] == me; i++) {
                    c1++;
                }
                n1 = gb[x][y - (c1 + 1)];
                r = aev(c0, c1, n0, n1);
                agb[x][y] = max(agb[x][y], r);

                c0 = c1 = 0;
                for (let i = 1; gb[x + i][y + i] == me; i++) {
                    c0++;
                }
                n0 = gb[x + (c0 + 1)][y + (c0 + 1)];
                for (let i = 1; gb[x - i][y - i] == me; i++) {
                    c1++;
                }
                n1 = gb[x - (c1 + 1)][y - (c1 + 1)];
                r = aev(c0, c1, n0, n1);
                agb[x][y] = max(agb[x][y], r);

                c0 = c1 = 0;
                for (let i = 1; gb[x + i][y - i] == me; i++) {
                    c0++;
                }
                n0 = gb[x + (c0 + 1)][y - (c0 + 1)];
                for (let i = 1; gb[x - i][y + i] == me; i++) {
                    c1++;
                }
                n1 = gb[x - (c1 + 1)][y + (c1 + 1)];
                r = aev(c0, c1, n0, n1);
                agb[x][y] = max(agb[x][y], r);
            }
        }
    }

    /*let pm = aamax(pgb);
    let am = aamax(agb);

    if (am > pm) {
        return agb;
    } else {
        return pgb;
    }*/

    let tmp = board();
    for (let y = 1; y <= 24; y++) {
        for (let x = 1; x <= 23; x++) {
            tmp[x][y] = max(pgb[x][y], agb[x][y]);
        }
    }
    return tmp;
}
function board() {
    return Array(25).fill(null).map(() => Array(26)).map(x => x.fill(0));
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}