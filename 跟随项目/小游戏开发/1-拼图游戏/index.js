//随机生成1-9的数字
var panel = document.querySelector(".panel");

var width = (panel.clientWidth) / 3;
var count = 0;
var timer = null;
var time = 0;
var gameState = 0; //0 未开始 1 一开始 2 暂停 3 游戏胜利
var picUrl = '';
var isInit = false;
var random = 0;
var content = document.querySelector(".content");
var imageCover = document.querySelector(".imageCover");

var rank = 0; //0 是最简单的 1 中单 2 大师
var currentNum = 9;

var successResult = [];
var arr = [];
var lis = []; //存放li

//先随机一张图片
random = parseInt(Math.random() * (33) + 1);
picUrl = 'url("https://mxnzp-img-1259191366.cos.ap-chengdu.myqcloud.com/roll/pintu/tupian' + (random - 1) + '.jpg") no-repeat';

content.style.height = 80 + "px";

reset();

showData();

function convert(index, x, y) {
    var column = Math.sqrt(currentNum);

    //计算左边的位置
    if (x - 1 >= 0) {
        var temp = (x - 1) + y * column;
        if (arr[temp] == currentNum - 1) {
            //左边的是空位置
            arr = wrap(arr, temp, x + y * column);
            count++;
        }
    }

    if (x + 1 <= column) {
        var temp = (x + 1) + y * column;
        if (arr[temp] == currentNum - 1) {
            //左边的是空位置
            arr = wrap(arr, temp, x + y * column);
            count++;
        }
    }

    if (y - 1 >= 0) {
        var temp = x + (y - 1) * column;
        if (arr[temp] == currentNum - 1) {
            //左边的是空位置
            arr = wrap(arr, temp, x + y * column);
            count++;
        }
    }

    if (y + 1 <= column) {
        var temp = x + (y + 1) * column;
        if (arr[temp] == currentNum - 1) {
            //左边的是空位置
            arr = wrap(arr, temp, x + y * column);
            count++;
        }
    }

    showData()

    checkoutData()
}

function showData() {
    for (var i = 0; i < lis.length; i++) {
        var aim = arr[i];
        var li = lis[i];
        var column = Math.sqrt(currentNum);
        li.style.background = picUrl;
        var x = (aim % column);
        var y = parseInt(aim / column);
        if (aim != currentNum - 1) {
            li.style.backgroundPosition = "-" + (x * width) + "px -" + (y * width) + "px";
        } else {
            li.style.backgroundPosition = width * column + "px " + width * column + "px";
        }

        li.style.backgroundSize = width * column + "px " + width * column + "px";
        li.index = aim;
        li.x = i % column;
        li.y = parseInt(i / column);

        li.onclick = function(i) {
            if (gameState == 1) {
                convert(this.index, this.x, this.y)
            } else {
                if (gameState == 0) {
                    alert("游戏未开始~~")
                } else {
                    alert("游戏已暂停~~")
                }
            }
        }
    }

    var countSpan = document.querySelector(".step")
    countSpan.innerHTML = count + " 步"

    var img = document.querySelector(".imageCover");
    img.src = 'https://mxnzp-img-1259191366.cos.ap-chengdu.myqcloud.com/roll/pintu/tupian' + (random - 1) + '.jpg';
}

function wrap(arr, before, after) {
    var temp = arr[before];
    arr[before] = arr[after];
    arr[after] = temp;
    return arr;
}

var start = document.querySelector(".start");
var newgame = document.querySelector(".newgame");
var change = document.querySelector(".change");
start.onclick = function() {
    if (gameState == 0) {
        //还没开始
        gameState = 1;
        count = 0;
        time = 0;
        if (timer != null) {
            clearInterval(timer);
            timer = null;
        }
        this.innerHTML = "暂停游戏"

        if (isInit == true)
            reset();
        showData();

        timer = setInterval(function() {
            time++;
            var timeSpan = document.querySelector(".time")
            timeSpan.innerHTML = time + " 秒"
        }, 1000);

        newgame.style.display = 'block';

        var countSpan = document.querySelector(".step")
        countSpan.innerHTML = count + " 步"

        var timeSpan = document.querySelector(".time")
        timeSpan.innerHTML = time + " 秒"

        showTips("开始新游戏");
    } else if (gameState == 1) {
        //暂停
        gameState = 2;
        if (timer != null) {
            clearInterval(timer);
            timer = null;
        }
        this.innerHTML = "继续游戏"

        showTips("游戏已暂停");
    } else {
        gameState = 1;
        //继续游戏
        timer = setInterval(function() {
            time++;
            var timeSpan = document.querySelector(".time")
            timeSpan.innerHTML = time + " 秒"
        }, 1000);
        this.innerHTML = "暂停游戏"

        showTips("游戏已继续");
    }
    isInit = true;
}
change.onclick = function() {
    random = parseInt(Math.random() * (16 - 1 + 1) + 1);
    picUrl = 'url("https://mxnzp-img-1259191366.cos.ap-chengdu.myqcloud.com/roll/pintu/tupian' + (random - 1) + '.jpg") no-repeat';

    reset();

    showData();

    gameState = 0;
    start.innerHTML = "开始游戏";

    newgame.style.display = 'none';

    if (timer != null) {
        clearInterval(timer);
        timer = null;
    }

    var countSpan = document.querySelector(".step")
    countSpan.innerHTML = 0 + " 步"

    var timeSpan = document.querySelector(".time")
    timeSpan.innerHTML = 0 + " 秒"

    isInit = false;

    showTips("素材已更换");
}
newgame.onclick = function() {
    gameState = 0;
    start.innerHTML = "开始游戏";
    this.style.display = 'none';

    if (timer != null) {
        clearInterval(timer);
        timer = null;
    }

    showTips("游戏已结束");
}

var nandu = document.querySelector(".nandu");
nandu.onclick = function() {
    var newRank = (rank + 1) % 3;
    rank = newRank;
    var rankView = document.querySelector(".rank");
    if (rank == 0) {
        rankView.innerHTML = "初级难度";
        currentNum = 9;
    } else if (rank == 1) {
        rankView.innerHTML = "中级难度";
        currentNum = 16;
    } else if (rank == 2) {
        rankView.innerHTML = "大师难度";
        currentNum = 25;
    }
    reset();
    showData();

    var countSpan = document.querySelector(".step")
    countSpan.innerHTML = 0 + " 步"

    var timeSpan = document.querySelector(".time")
    timeSpan.innerHTML = 0 + " 秒"

    gameState = 0;
    start.innerHTML = "开始游戏";
    newgame.style.display = 'none';

    if (timer != null) {
        clearInterval(timer);
        timer = null;
    }

    isInit = false;

    showTips("难度已设置，请重新开始游戏");
}

function reset() {
    arr = [];
    lis = [];
    successResult = [];

    width = (panel.clientWidth) / Math.sqrt(currentNum);

    while (arr.length < currentNum) {
        var random = getRandomNum(currentNum);
        if (arr.indexOf(random) == -1) {
            arr.push(random);
        }
    }

    for (var i = 0; i < currentNum; i++) {
        successResult.push(i);
    }

    //清空panel里面的子view
    while (panel.hasChildNodes()) {
        panel.removeChild(panel.firstChild);
    }

    for (var i = 0; i < currentNum; i++) {
        var liItem = document.createElement("li");
        liItem.style.flex = 100 / Math.sqrt(currentNum) + "%";
        liItem.style.height = width + "px";
        lis.push(liItem);
        panel.appendChild(liItem);
    }
}

function checkoutData() {
    for (var i = 0; i < successResult.length; i++) {
        if (successResult[i] != arr[i]) {
            return
        }
    }
    //游戏完成
    alert("恭喜您拼图成功~");
    gameState = 0;
    start.innerHTML = "开始游戏";
    newgame.style.display = 'none';

    //游戏完成之后把最后一个图拼上
    var aim = arr[arr.length - 1];
    var column = Math.sqrt(currentNum);
    var x = (aim % column);
    var y = parseInt(aim / column);
    lis[arr.length - 1].style.backgroundPosition = "-" + (x * width) + "px -" + (y * width) + "px";

    if (timer != null) {
        clearInterval(timer);
        timer = null;
    }
}

function showTips(msg) {
    var tips = document.querySelector('.tips');
    tips.innerHTML = msg;
    tips.style.display = 'block'
    setTimeout(function() {
        tips.style.display = 'none'
    }, 2000);
}

function getRandomNum(num) {
    return parseInt(Math.random() * (num) + 1) - 1;
}