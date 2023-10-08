const pr = console.log
var w;
var h;
var cellSize;
var n_cells_x;
var n_cells_y;

var cellArr;


function draw_arr(ctx){
    for(let i = 0; i < cellArr[0].length; i++)
        for (let j = 0; j < cellArr.length; j++)
            if (cellArr[j][i])
                ctx.fillRect(j*cellSize, i*cellSize, cellSize, cellSize)
}

function num_n(x, y){
    var n = 0;


    var xn = x-1;
    var xp = x+1;
    var yn = y-1;
    var yp = y+1;
    if (xn < 0) xn = n_cells_x-1;
    if (yn < 0) yn = n_cells_y-1;
    if (xp >= n_cells_x) xp = 0;
    if (yp >= n_cells_y) yp = 0;

    n += cellArr[yn][xn];
    n += cellArr[yn][x] ;
    n += cellArr[yn][xp];
                                 
    n += cellArr[y][xn];
    n += cellArr[y][xp];
                                 
    n += cellArr[yp][xn];
    n += cellArr[yp][x] ;
    n += cellArr[yp][xp];

    //if (!n) pr(x, y)
    return n;
}

function update_arr(){
    // hacky and whacky let's get it (deepcopy)
    var new_arr = cellArr.map(a => {return [...a]});

    for (let x = 0; x < cellArr[0].length; x++)
        for (let y = 0; y < cellArr.length; y++){
            let n = num_n(x, y);

            if (cellArr[y][x]==1 && (n < 2 || n > 3))
                new_arr[y][x] = 0;

            if (cellArr[y][x]==0 && n == 3)
                new_arr[y][x] = 1;
        }
    cellArr = new_arr;

}

function gcd(n1, n2){
    return n2?gcd(n2,n1%n2):n1;
}

function init() {
    const canvas = document.getElementById("c");
    const bcr = canvas.getBoundingClientRect();
    
    w = canvas.getBoundingClientRect().width;
    h = canvas.getBoundingClientRect().height;

    if (w%10 == 0 && h%10 == 0)
        cellSize = 10;
    else
        //backup, just use the largest one u can find
        cellSize = gcd(w,h);
    
    // fill with 0s
    cellArr = [];
    for (let i = 0; i < w/cellSize; i++){
        cellArr.push([]);
        for (let j = 0; j < h/cellSize; j++)
            cellArr[i].push(0);
    }

    n_cells_x = cellArr[0].length;
    n_cells_y = cellArr.length;
    cellArr[3][2] = 1;
    cellArr[3][3] = 1;
    cellArr[3][4] = 1;
    cellArr[2][4] = 1;
    cellArr[1][3] = 1;
    pr(w, h, cellSize);

    window.requestAnimationFrame(draw);
}

var i = 0;
function draw() {
    const canvas = document.getElementById("c");
    const ctx = canvas.getContext("2d");
    
    i = (i+1) % (n_cells_y*n_cells_x);
    update_arr();
    cellArr[i%n_cells_y][Math.floor(i/n_cells_y)] = 1;

    ctx.fillStyle = 'Black';
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = 'White';
    draw_arr(ctx);

    window.requestAnimationFrame(draw);
}

init();
