!function(){
    function n(n,e,t){return n.getAttribute(e)||t}
    function e(n){return document.getElementsByTagName(n)}
    function t(){var t=e("script"),o=t.length,i=t[o-1];return{l:o,z:n(i,"zIndex",-1),o:n(i,"opacity",0.7),c:n(i,"color","255,255,255"),n:n(i,"count",300)}}
    function o(){a=m.width=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,c=m.height=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight}
    function i(){
        r.clearRect(0,0,a,c);
        var n,e,t,o,m,l;
        s.forEach(function(i,x){
            var dx = y.x - i.x, dy = y.y - i.y;
            var distance = Math.sqrt(dx*dx + dy*dy);
            var angleToMouse = Math.atan2(dy, dx);
            var angle = Math.PI / 90; // 逆时针旋转角度

            //if (distance < 150) { // 150为鼠标吸引半径
                var force = 2.5 / distance; // 反比于距离的引力
                i.xa += force * Math.cos(angleToMouse);
                i.ya += force * Math.sin(angleToMouse);
            //}

            // 添加相对于鼠标的逆时针旋转力场
            var rotationForce = 2 / distance; // 旋转力与距离成反比
            var cos = Math.cos(rotationForce), sin = Math.sin(rotationForce);
            var relX = i.x - y.x;
            var relY = i.y - y.y;
            var newX = relX * cos + relY * sin;
            var newY = -relX * sin + relY * cos;
            i.x = y.x + newX;
            i.y = y.y + newY;

            i.x += i.xa;
            i.y += i.ya;

            // 处理点的边界
            i.xa *= i.x > a || i.x < 0 ? -1 : 1;
            i.ya *= i.y > c || i.y < 0 ? -1 : 1;

            // 记录点的轨迹
            if (!i.history) i.history = [];
            i.history.push({x: i.x, y: i.y});
            if (i.history.length > 50) i.history.shift(); // 保留最近的轨迹

            // 绘制点的轨迹
            for (var j = 1; j < i.history.length; j++) {
                var start = i.history[j-1];
                var end = i.history[j];
                var alpha = j / i.history.length;
                r.beginPath();
                r.lineWidth = 2 * i.size;
                r.strokeStyle = `rgba(${i.color[0]}, ${i.color[1]}, ${i.color[2]}, ${alpha})`; // 颜色渐变
                r.moveTo(start.x, start.y);
                r.lineTo(end.x, end.y);
                r.stroke();
                r.closePath();
            }

            // 绘制点
            r.beginPath();
            r.arc(i.x, i.y, i.size, 0, 2 * Math.PI);
            r.fillStyle = `rgba(${i.color[0]}, ${i.color[1]}, ${i.color[2]}, 1)`; // 点的颜色
            r.fill();
            r.closePath();
        }), x(i)
    }
    var a,c,u,m=document.createElement("canvas"),d=t(),l="c_n"+d.l,r=m.getContext("2d"),x=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(n){window.setTimeout(n,1e3/45)},w=Math.random,y={x:null,y:null,max:2e4};
    m.id=l,m.style.cssText="position:fixed;top:0;left:0;z-index:"+d.z+";opacity:"+d.o,e("body")[0].appendChild(m),o(),window.onresize=o,window.onmousemove=function(n){n=n||window.event,y.x=n.clientX,y.y=n.clientY},window.onmouseout=function(){y.x=null,y.y=null};
    for(var s=[],f=0;d.n>f;f++){
        var h=w()*a, g=w()*c, v=2*w()-1, p=2*w()-1;
        var size = 1 + Math.random() * 5; // 点的大小随机初始化
        var red = 255;
        var green = 255;
        var blue = 0;
    
        if (Math.random() < 0.1) { // 10% 几率生成纯白色
            green = 255;
            blue = 255;
        } else {
            green = 200 + Math.floor(55 * Math.random()); // 减少绿色的比例，确保黄色较浅
            blue = Math.floor(105 * Math.random()); // 蓝色从0到55随机
        }
        
        s.push({x:h, y:g, xa:v, ya:p, max:6e3, size:size, color:[red, green, blue]});
    }
    
    u=s.concat([y]),setTimeout(function(){i()},100)
}();
