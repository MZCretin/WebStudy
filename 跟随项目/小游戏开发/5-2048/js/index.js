var panel = document.querySelector(".panel");
var container = document.querySelector(".container");

panel.style.height = panel.clientWidth + "px";

var h = document.documentElement.clientHeight;

container.style.marginTop = (h - container.clientHeight) / 2 + 'px';

//设置数字
var lis = panel.querySelectorAll("li");
var itemWidth = lis[0].offsetWidth;

for (var i = 0; i < lis.length; i++) {
    lis[i].innerHTML = i;
    lis[i].style.height = itemWidth + "px";
    lis[i].style.lineHeight = itemWidth + "px";
}

initGame();

function initGame() {
    //清空所有内容所有数字
    var one = getRandomNum(16);
    var two = getRandomNum(16);
    while (one == two) {
        two = getRandomNum(16);
    }
    for (var i = 0; i < 16; i++) {
        lis[i].setAttribute("position", i)
        if (i == one || i == two) {
            var random = getNewRandomNum();
            lis[i].innerHTML = random;
        } else {
            lis[i].innerHTML = "";
        }
    }
    setBg(-1);
}

//给容器添加滑动事件
var startX = 0;
var startY = 0;
panel.addEventListener("touchstart", function(e) {
    e.preventDefault(); //阻止浏览器默认事件
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
})

panel.addEventListener("touchend", function(e) {
    var x = e.changedTouches[0].pageX;
    var y = e.changedTouches[0].pageY;

    var tempX = Math.abs(x - startX);
    var tempY = Math.abs(y - startY);

    var direction = -1; //0 左 1 右  2  上 3 下

    if (tempX > 30 && tempX > tempY) {
        if (x > startX) {
            //右
            direction = 1;
        } else {
            //左
            direction = 0;
        }
    }
    if (tempY > 30 && tempY > tempX) {
        if (y > startY) {
            //下
            direction = 3;
        } else {
            //上
            direction = 2;
        }
    }
    moveNum(direction)
})

function moveNum(direction) {
    var canMoveOne = false;
    var canMoveTwo = false;
    var canMoveThree = false;
    var canMoveFour = false;

    if (direction == 0) {
        //左
        canMoveOne = moveToLeft(lis[0]);
        canMoveTwo = moveToLeft(lis[4]);
        canMoveThree = moveToLeft(lis[8]);
        canMoveFour = moveToLeft(lis[12]);
    }
    if (direction == 1) {
        //右
        canMoveOne = moveToRight(lis[3]);
        canMoveTwo = moveToRight(lis[7]);
        canMoveThree = moveToRight(lis[11]);
        canMoveFour = moveToRight(lis[15]);
    }
    if (direction == 2) {
        //上
        canMoveOne = moveToTop(lis[0]);
        canMoveTwo = moveToTop(lis[1]);
        canMoveThree = moveToTop(lis[2]);
        canMoveFour = moveToTop(lis[3]);
    }
    if (direction == 3) {
        //下
        canMoveOne = moveToBottom(lis[12]);
        canMoveTwo = moveToBottom(lis[13]);
        canMoveThree = moveToBottom(lis[14]);
        canMoveFour = moveToBottom(lis[15]);
    }

    if (canMoveOne || canMoveTwo || canMoveThree || canMoveFour) {
        //有可以移动的 //找一个随机的位置
        findEmptyPostion();
    } else  {
        //没有可以移动的
    }
}

function setBg(position) {
    for (var i = 0; i < lis.length; i++) {
        if (position == i) {
            lis[i].className = 'colors' + lis[i].innerHTML + " newClone";
        } else {
            lis[i].className = 'colors' + lis[i].innerHTML;
        }
    }
}

/**
 * 寻找空闲的位置
 */
function findEmptyPostion() {
    var tempEmpty = [];
    for (var i = 0; i < lis.length; i++) {
        if (lis[i].innerHTML == '') {
            tempEmpty.push(i);
        }
    }
    if (tempEmpty.length == 0) {
        //游戏结束
        setBg(-1);
        return false;
    } else　 {
        var random = getRandomNum(tempEmpty.length);
        var position = tempEmpty[random];
        lis[position].innerHTML = getNewRandomNum();

        setBg(position);

        //执行动画

        return true;
    }
}

function moveToLeft(li) {
    var position = parseInt(li.getAttribute("position"));
    var fourLi = lis[position];
    var four = fourLi.innerHTML;
    var threeLi = lis[position + 1];
    var three = threeLi.innerHTML;
    var twoLi = lis[position + 2];
    var two = twoLi.innerHTML;
    var oneLi = lis[position + 3];
    var one = oneLi.innerHTML;

    return realMove(one, oneLi, two, twoLi, three, threeLi, four, fourLi);
}

function moveToRight(li) {
    var position = parseInt(li.getAttribute("position"));
    var fourLi = lis[position];
    var four = fourLi.innerHTML;
    var threeLi = lis[position - 1];
    var three = threeLi.innerHTML;
    var twoLi = lis[position - 2];
    var two = twoLi.innerHTML;
    var oneLi = lis[position - 3];
    var one = oneLi.innerHTML;

    return realMove(one, oneLi, two, twoLi, three, threeLi, four, fourLi);
}

function moveToTop(li) {
    var position = parseInt(li.getAttribute("position"));
    var fourLi = lis[position];
    var four = fourLi.innerHTML;
    var threeLi = lis[position + 4];
    var three = threeLi.innerHTML;
    var twoLi = lis[position + 8];
    var two = twoLi.innerHTML;
    var oneLi = lis[position + 12];
    var one = oneLi.innerHTML;

    return realMove(one, oneLi, two, twoLi, three, threeLi, four, fourLi);
}

function moveToBottom(li) {
    var position = parseInt(li.getAttribute("position"));
    var fourLi = lis[position];
    var four = fourLi.innerHTML;
    var threeLi = lis[position - 4];
    var three = threeLi.innerHTML;
    var twoLi = lis[position - 8];
    var two = twoLi.innerHTML;
    var oneLi = lis[position - 12];
    var one = oneLi.innerHTML;

    return realMove(one, oneLi, two, twoLi, three, threeLi, four, fourLi);
}

/**
 * 如果有移动 就返回true
 * @param {*} one 
 * @param {*} oneLi 
 * @param {*} two 
 * @param {*} twoLi 
 * @param {*} three 
 * @param {*} threeLi 
 * @param {*} four 
 * @param {*} fourLi 
 */
function realMove(one, oneLi, two, twoLi, three, threeLi, four, fourLi) {
    if (four == '') {
        if (three == '') {
            if (two == '') {
                if (one == '') {
                    //do nothing
                    return false;
                } else {
                    fourLi.innerHTML = oneLi.innerHTML;
                    oneLi.innerHTML = '';
                }
            } else {
                if (one == '') {
                    fourLi.innerHTML = twoLi.innerHTML;
                    twoLi.innerHTML = '';
                } else {
                    if (one == two) {
                        fourLi.innerHTML = 0 + twoLi.innerHTML * 2;
                        oneLi.innerHTML = '';
                        twoLi.innerHTML = '';
                    } else {
                        threeLi.innerHTML = oneLi.innerHTML;
                        fourLi.innerHTML = twoLi.innerHTML;
                        oneLi.innerHTML = '';
                        twoLi.innerHTML = '';
                    }
                }
            }
        } else { //第三个有数据
            if (two == '') {
                if (one == '') {
                    fourLi.innerHTML = threeLi.innerHTML;
                    threeLi.innerHTML = '';
                } else {
                    // 1 3
                    if (one == three) {
                        fourLi.innerHTML = 0 + oneLi.innerHTML * 2;
                        oneLi.innerHTML = '';
                        threeLi.innerHTML = '';
                    } else {
                        fourLi.innerHTML = threeLi.innerHTML;
                        threeLi.innerHTML = oneLi.innerHTML;
                        oneLi.innerHTML = '';
                    }
                }
            } else {
                if (one == '') {
                    //32
                    if (three == two) {
                        fourLi.innerHTML = 0 + twoLi.innerHTML * 2;
                        twoLi.innerHTML = '';
                        threeLi.innerHTML = '';
                    } else {
                        fourLi.innerHTML = threeLi.innerHTML;
                        threeLi.innerHTML = twoLi.innerHTML;
                        twoLi.innerHTML = '';
                    }
                } else {
                    //321
                    if (three == two) {
                        fourLi.innerHTML = 0 + threeLi.innerHTML * 2;
                        threeLi.innerHTML = oneLi.innerHTML;
                        twoLi.innerHTML = '';
                        oneLi.innerHTML = '';
                    } else {
                        if (two == one) {
                            fourLi.innerHTML = threeLi.innerHTML;
                            threeLi.innerHTML = 0 + twoLi.innerHTML * 2;
                            twoLi.innerHTML = '';
                            oneLi.innerHTML = '';
                        } else {
                            fourLi.innerHTML = threeLi.innerHTML;
                            threeLi.innerHTML = twoLi.innerHTML;
                            twoLi.innerHTML = oneLi.innerHTML;
                            oneLi.innerHTML = '';
                        }
                    }
                }
            }
        }
    } else {
        if (three == '') {
            if (two == '') {
                if (one == '') {
                    // do nothing
                    return false;
                } else {
                    //41
                    if (four == one) {
                        fourLi.innerHTML = 0 + oneLi.innerHTML * 2;
                        oneLi.innerHTML = '';
                    } else {
                        threeLi.innerHTML = oneLi.innerHTML;
                        oneLi.innerHTML = '';
                    }
                }
            } else {
                if (one == '') {
                    //42
                    if (four == two) {
                        fourLi.innerHTML = 0 + fourLi.innerHTML * 2;
                        twoLi.innerHTML = '';
                    } else {
                        threeLi.innerHTML = twoLi.innerHTML;
                        twoLi.innerHTML = '';
                    }
                } else {
                    //421
                    if (four = two) {
                        fourLi.innerHTML = 0 + fourLi.innerHTML * 2;
                        threeLi.innerHTML = oneLi.innerHTML;
                        twoLi.innerHTML = '';
                        oneLi.innerHTML = '';
                    } else {
                        if (two == one) {
                            threeLi.innerHTML = 0 + twoLi.innerHTML * 2;
                            twoLi.innerHTML = '';
                            oneLi.innerHTML = '';
                        } else {
                            threeLi.innerHTML = twoLi.innerHTML;
                            twoLi.innerHTML = oneLi.innerHTML;
                            oneLi.innerHTML = '';
                        }
                    }
                }
            }
        } else {
            if (two == '') {
                if (one == '') {
                    //43
                    if (four == three) {
                        fourLi.innerHTML = 0 + fourLi.innerHTML * 2;
                        threeLi.innerHTML = '';
                    } else {
                        //do nothing
                        return false;
                    }
                } else {
                    //431
                    if (four == three) {
                        fourLi.innerHTML = 0 + fourLi.innerHTML * 2;
                        threeLi.innerHTML = oneLi.innerHTML;
                        oneLi.innerHTML = '';
                    } else {
                        if (three == one) {
                            threeLi.innerHTML = 0 + threeLi.innerHTML * 2;
                            oneLi.innerHTML = '';
                        } else {
                            twoLi.innerHTML = oneLi.innerHTML;
                            oneLi.innerHTML = '';
                        }
                    }
                }
            } else {
                if (one == '') {
                    //432
                    if (four == three) {
                        fourLi.innerHTML = 0 + fourLi.innerHTML * 2;
                        threeLi.innerHTML = twoLi.innerHTML;
                        twoLi.innerHTML = '';
                    } else {
                        if (three == two) {
                            threeLi.innerHTML = 0 + threeLi.innerHTML * 2;
                            twoLi.innerHTML = '';
                        } else {
                            //do nothing
                            return false;
                        }
                    }
                } else {
                    //4321
                    if (four == three) {
                        if (two == one) {
                            fourLi.innerHTML = 0 + fourLi.innerHTML * 2;
                            threeLi.innerHTML = 0 + twoLi.innerHTML * 2;
                            twoLi.innerHTML = '';
                            oneLi.innerHTML = '';
                        } else {
                            fourLi.innerHTML = 0 + fourLi.innerHTML * 2;
                            threeLi.innerHTML = twoLi.innerHTML;
                            twoLi.innerHTML = oneLi.innerHTML;
                            oneLi.innerHTML = '';
                        }
                    } else {
                        if (three == two) {
                            threeLi.innerHTML = 0 + threeLi.innerHTML * 2;
                            twoLi.innerHTML = oneLi.innerHTML;
                            oneLi.innerHTML = '';
                        } else {
                            if (two == one) {
                                twoLi.innerHTML = 0 + twoLi.innerHTML * 2;
                                oneLi.innerHTML = '';
                            } else {
                                //do nothing
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }
    return true;
}

function getRandomNum(num) {
    //获取一个随机值 0~最大值
    return parseInt(Math.random() * (num));
}

function getNewRandomNum() {
    //获取一个随机值 0~最大值
    var num = parseInt(Math.random() * (100));
    if (num < 10) {
        return 4;
    }
    return 2;
}