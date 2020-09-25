var panel = document.querySelector(".panel");
var games = document.querySelector(".games");
var container = document.querySelector(".container");
var column = 10;
var imagesList = [];
var host = "";
var userId = randomString(12);

var dialogBg = document.querySelector(".dialog");
var bottom = document.querySelector(".bottom");
var loadBg = document.querySelector(".load");

var gameState = 0; //0 进行中 1 已胜利

var h = document.documentElement.clientHeight;

var itemWidth = container.clientWidth / column * (column - 1);

panel.style.width = itemWidth + "px";
panel.style.height = itemWidth + "px";

panel.style.margin = container.clientWidth / column / 2 + "px";

document.body.style.height = h + "px";
dialogBg.style.height = h + "px";
bottom.style.height = h + "px";
loadBg.style.height = h + "px";

//设置容器的高度
container.style.height = document.body.clientWidth * 0.9 + "px";

initGame(column);

function initGame(columnNum) {
    gameState = 0;
    column = columnNum;
    imagesList = [];

    //设置游戏容器的大小和位置
    games.style.width = container.clientWidth + "px";
    games.style.height = container.clientWidth + "px";

    //清空panel里面的子view
    while (panel.hasChildNodes()) {
        panel.removeChild(panel.firstChild);
    }

    //清空game里面的
    while (games.hasChildNodes()) {
        games.removeChild(games.firstChild);
    }

    for (var i = 0; i < column * column; i++) {
        var li = document.createElement("li");
        li.style.height = panel.offsetWidth / column + "px";
        panel.appendChild(li);
    }

    for (var i = 0; i < (column + 1) * (column + 1); i++) {
        var liGame = document.createElement("li");
        liGame.style.height = games.offsetWidth / (column + 1) + "px";
        var img = document.createElement("img");
        img.alt = " "
        img.src = "red";
        imagesList.push(img);
        liGame.appendChild(img);

        games.appendChild(liGame);

        liGame.setAttribute("data-x", i % (column + 1));
        liGame.setAttribute("data-y", parseInt(i / (column + 1)));
        liGame.onclick = function() {
            if (gameState == 1) {
                showTips("游戏胜负已定，请重新开始游戏");
                return;
            }

            if (this.children[0].style.opacity) {
                showTips("此处已经有落子了小老弟~");
                return;
            }

            var x = this.getAttribute("data-x");
            var y = this.getAttribute("data-y");

            console.log(x + "  " + y);
            this.children[0].style.opacity = "1";
            this.children[0].src = "https://mxnzp-img-1259191366.cos.ap-chengdu.myqcloud.com/roll/wuziqi/images/white.gif"

            showLoading();
            doRequest("chess/step?x=" + x + "&y=" + y, function(data) {
                stopLoading();
                var t = eval(data);
                var returnPoint = t.data.returnPoint;
                var position = returnPoint.x + returnPoint.y * (column + 1);
                imagesList[position].style.opacity = "1";
                imagesList[position].src = "https://mxnzp-img-1259191366.cos.ap-chengdu.myqcloud.com/roll/wuziqi/images/black.gif";

                for (var i = 0; i < imagesList.length; i++) {
                    imagesList[i].style.border = "none";
                }
                imagesList[position].style.border = "1px dashed white";

                if (t.data.win) {
                    gameState = 1;
                    if (t.data.humanWin) {
                        alert("你战胜了电脑~");
                    } else {
                        alert("电脑战胜了你~");
                    }
                }
            })
        }
    }

    for (var i = 0; i < games.children.length; i++) {
        games.children[i].style.flex = 100 / (column + 1) + "%";
    }

    for (var i = 0; i < panel.children.length; i++) {
        panel.children[i].style.flex = 100 / (column) + "%";
    }

    startGame()
}

function startGame() {
    doRequest("chess/start?&boardWidth=" + (column + 1) + "&boardHeight=" + (column + 1), function(data) {
        showTips(data.msg);
    })
}

/**
 * 发送请求
 */
function doRequest(url, success) {
    if (!url.includes("?")) {
        url = host + url + "?userId=" + userId
    } else {
        url = host + url + "&userId=" + userId
    }

    $.ajax({
        type: "get",
        dataType: "Json",
        header: {
            'Access-Control-Allow-Origin': '*'
        },
        url: url,
        success: success
    });
}

function randomString(len) {　　
    len = len || 32;　　
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';　　
    var maxPos = $chars.length;　　
    var pwd = '';　　
    for (i = 0; i < len; i++) {　　　　
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
    }
    console.log(pwd);　　
    return pwd;
}

//处理设置按钮
var setting = document.querySelector(".setting");
setting.addEventListener("click", function() {
    dialogBg.style.display = "block";
})

var dialogItems = dialogBg.children[0].children;
dialogItems[0].addEventListener("click", function() {
    bottom.style.display = "block";
    //设置棋盘大小
    var bottomUl = bottom.children[0];
    //清空game里面的
    while (bottomUl.hasChildNodes()) {
        bottomUl.removeChild(bottomUl.firstChild);
    }
    var li15 = document.createElement("li")
    li15.innerHTML = "15*15";
    bottomUl.appendChild(li15);
    var li12 = document.createElement("li")
    li12.innerHTML = "13*13";
    bottomUl.appendChild(li12);
    var li10 = document.createElement("li")
    li10.innerHTML = "10*10";
    bottomUl.appendChild(li10);
    bottomUl.appendChild(dialogItems[2].cloneNode(true));

    for (var i = 0; i < bottomUl.children.length; i++) {
        bottomUl.children[i].setAttribute("index", i);
        bottomUl.children[i].onclick = function() {
            var index = this.getAttribute("index");

            if (index == 0) {
                initGame(14);
            } else if (index == 1) {
                initGame(12);
            } else if (index == 2) {
                initGame(9);
            }

            bottom.style.display = "none";
            if (index != 3) {
                dialogBg.style.display = "none";
                showTips("棋盘已重置成" + this.innerHTML + "，游戏重新开始");
            }
        }
    }
})

dialogItems[1].addEventListener("click", function() {
    console.log(column);
    initGame(column)
    dialogBg.style.display = "none";
    showTips("游戏已经开始啦，请您先落子~");
})

dialogItems[2].addEventListener("click", function() {
    dialogBg.style.display = "none";
})

function showLoading() {
    loadBg.style.display = "block";
}

function stopLoading() {
    loadBg.style.display = "none";
}

function showTips(msg) {
    var tips = document.querySelector('.tips');
    tips.innerHTML = msg;
    tips.style.display = 'block'
    setTimeout(function() {
        tips.style.display = 'none'
    }, 2000);
}