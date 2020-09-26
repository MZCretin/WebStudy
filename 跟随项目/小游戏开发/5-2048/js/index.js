var panel = document.querySelector(".panel");

var container = document.querySelector(".container");

container.style.transform = "translateX(-50%) translateY(-50%)";
container.style.top = "50%";
container.style.length = "50%";

panel.style.height = panel.offsetWidth + "px";

//设置数字
var lis = panel.querySelectorAll("li");
for (var i = 0; i < lis.length; i++) {
    lis[i].innerHTML = i;
}