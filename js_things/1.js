var w = 0;
var h = 0;




function init() {
    const canvas = document.getElementById("c");
    const bcr = canvas.getBoundingClientRect()

    w = canvas.getBoundingClientRect().width;
    h = canvas.getBoundingClientRect().height;


    window.requestAnimationFrame(draw);
}


const pr = console.log
const speed = 3;
const size = [30, 30];
const c1 = 'red'
const c2 = 'blue'
var curr_c = c1;
var pos = [0, 0];
var dir = [1, 1];

function switch_colors() {
    curr_c = curr_c == c1 ? c2: c1;
}

function draw() {
    const canvas = document.getElementById("c");
    const ctx = canvas.getContext("2d"); 
    if (size[0] >= w || size[1] > h) return;
    
    // move
    pos = [pos[0]+dir[0]*speed, pos[1]+dir[1]*speed];
    

    // collision
    s_c = false;
    if (pos[0] < 0){
        dir[0] = 1;
        s_c = true;
    }
    if (pos[0] + size[0] > w){
        dir[0] = -1;
        s_c = true;
    }
    if (pos[1] < 0) {
        dir[1] = 1;
        s_c = true;
    }
    if (pos[1] + size[1] > h){
        dir[1] = -1;
        s_c = true;
    }

    if(s_c) switch_colors();

    // draw
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = curr_c;
    ctx.fillRect(pos[0], pos[1], size[0], size[1]);

    window.requestAnimationFrame(draw);
}

init();
