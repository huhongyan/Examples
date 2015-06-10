var WINDOW_WIDTH = window.innerWidth - 20;
var WINDOW_HEIGHT = window.innerHeight - 20;
var RADIUS = Math.round(WINDOW_WIDTH*4/5/108) -1;
var MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);
var MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);


var endTime = new Date;
endTime.setHours(endTime.getHours() + 1);
var curShowTimeSeconds = 0;

const colors = ['#66B2E0', '#75E066', '#D866E0', '#F5969A', '#E5E455', '#F77A6A', '#6AF7EA'];
var balls = [];

window.onload = function(){
    var canvas = document.getElementById('canvas');
    var cxt = canvas.getContext('2d');

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getCurShowTimeSeconds();
    setInterval(
        function(){
            render(cxt);
        },
        50
    );

}

function getCurShowTimeSeconds(){
    var curTime = new Date;
    //var ret = endTime.getTime() - curTime.getTime();
    var ret = curTime.getHours()*3600 + curTime.getMinutes()*60 + curTime.getSeconds();
    //ret = Math.round(ret/1000);

    //return ret >= 0 ? ret : 0;
    return ret;
}

function render(cxt){

    var hours = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hours * 3600)/60);
    var seconds = curShowTimeSeconds%60;

    var nextShowTimeSeconds = getCurShowTimeSeconds();
    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - hours * 3600)/60);
    var nextSeconds = nextShowTimeSeconds%60;

    if(nextSeconds != seconds){
        if(parseInt(hours/10) != parseInt(nextHours/10)){
            addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10));
            hours = nextHours;
        }

        if(parseInt(hours%10) != parseInt(nextHours%10)){
            addBalls(MARGIN_LEFT + 15*(RADIUS + 1), MARGIN_TOP, parseInt(hours%10));
            hours = nextHours;
        }

        if(parseInt(minutes/10) != parseInt(nextMinutes/10)){
            addBalls(MARGIN_LEFT + 39*(RADIUS + 1), MARGIN_TOP, parseInt(minutes/10));
            minutes = nextMinutes;
        }

        if(parseInt(minutes%10) != parseInt(nextMinutes%10)){
            addBalls(MARGIN_LEFT + 54*(RADIUS + 1), MARGIN_TOP, parseInt(minutes%10));
            minutes = nextMinutes;
        }

        if(parseInt(seconds/10) != parseInt(nextSeconds/10)){
            addBalls(MARGIN_LEFT + 78*(RADIUS + 1), MARGIN_TOP, parseInt(seconds/10));
        }

        if(parseInt(seconds%10) != parseInt(nextSeconds%10)){
            addBalls(MARGIN_LEFT + 93*(RADIUS + 1), MARGIN_TOP, parseInt(seconds%10));
            seconds = nextSeconds;
        }

        curShowTimeSeconds = nextShowTimeSeconds;

    }

    cxt.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);

    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), cxt);
    renderDigit(MARGIN_LEFT + 15*(RADIUS + 1), MARGIN_TOP, parseInt(hours%10), cxt);
    renderDigit(MARGIN_LEFT + 30*(RADIUS + 1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 39*(RADIUS + 1), MARGIN_TOP, parseInt(minutes/10), cxt);
    renderDigit(MARGIN_LEFT + 54*(RADIUS + 1), MARGIN_TOP, parseInt(minutes%10), cxt);
    renderDigit(MARGIN_LEFT + 69*(RADIUS + 1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 78*(RADIUS + 1), MARGIN_TOP, parseInt(seconds/10), cxt);
    renderDigit(MARGIN_LEFT + 93*(RADIUS + 1), MARGIN_TOP, parseInt(seconds%10), cxt);

    for(var i = 0; i < balls.length; i++){

        cxt.fillStyle = balls[i].color;

        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI);
        cxt.closePath();

        cxt.fill();
    }

    updateBalls();

};

function updateBalls(){
    for(var i = 0; i < balls.length; i++){
        var aBall = balls[i];

        aBall.x += aBall.vx;
        aBall.y += aBall.vy;
        aBall.vy += aBall.g;

        if(aBall.y >= WINDOW_HEIGHT - RADIUS){
            aBall.y = WINDOW_HEIGHT - RADIUS;
            aBall.vy = -aBall.vy*0.75;
        }
    }

    var cnt = 0;
    for(var i = 0; i < balls.length; i++) {
        if(balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH){
            balls[cnt++] = balls[i];
        }
    }

    while(balls.length > Math.min(300, cnt)){
        balls.pop();
    }
}

function addBalls(x, y, num){
    for(var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if(digit[num][i][j] == 1){
                var aBall = {
                    x: x + j*2*(RADIUS + 1) + RADIUS + 1,
                    y: y + i*2*(RADIUS + 1) + RADIUS + 1,
                    g:1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random()*1000))*4,
                    vy: -5,
                    color: colors[Math.floor(Math.random()*colors.length)]
                };
                balls.push(aBall);
            }
        }
    }
}

function renderDigit(x, y, num, cxt){

    cxt.fillStyle = 'rgb(0, 102, 153)';

    for(var i = 0; i < digit[num].length; i++){
        for(var j = 0; j < digit[num][i].length; j++){
            if(digit[num][i][j] == 1){
                cxt.beginPath();
                cxt.arc(x + j*2*(RADIUS + 1) + RADIUS + 1, y + i*2*(RADIUS + 1) + RADIUS + 1, RADIUS, 0, 2*Math.PI);
                cxt.closePath();

                cxt.fill();
            }
        }
    }
}