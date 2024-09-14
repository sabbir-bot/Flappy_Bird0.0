//Board
let board;
let boardHeight = 640;
let boardWidth = 360;
let context;

//Bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let Bird = {
    width : birdWidth,
    height : birdHeight,
    x : birdX,
    y : birdY
}

// Pipe
let pipeArr = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//Physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let bestScore = 0;



window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "flappybird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg ,Bird.x, Bird.y, Bird.width, Bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "toppipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "bottompipe.png";


    requestAnimationFrame(update);
    setInterval(setPipes, 1500);
    document.addEventListener("click", moveBird);
}

function update(){
    requestAnimationFrame(update);

    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    Bird.y = Math.max(velocityY + Bird.y , 0);
    context.drawImage(birdImg ,Bird.x, Bird.y, Bird.width, Bird.height);

    if (Bird.y > board.height)  gameOver = true;
    
    for (let i = 0; i < pipeArr.length; i++){
        let pipe = pipeArr[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && Bird.x > pipe.x + pipe.width){
            score += 0.5; //there are two pipes
            pipe.passed = true;
        }

         if (detectCollision(Bird, pipe)){
            gameOver = true;
         }
    }

    //clear pipes
    while(pipeArr.length > 0 && pipeArr[0].x < -pipeWidth){
        pipeArr.shift();
    }

    // Score
    context.fillstyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 80);
    context.fillText("Best:"+bestScore, 5, 45);

    if(gameOver){
        context.fillText("GAME OVER", 40, 320);
    }
}

function setPipes(){
    if (gameOver)return;

    let randomPipeY = pipeY - pipeHeight / 4 -Math.random() *(pipeHeight/2);
    let openingSpace = boardHeight / 4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArr.push(topPipe);

    let bottomPipe ={
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArr.push(bottomPipe);
}

function moveBird(){ 
    velocityY = -6;  //Jump
    if(gameOver){
        Bird.y = birdY;
        pipeArr =[];
        bestScore = Math.max(score, bestScore);
        score = 0; 
        gameOver = false; 
    }
 
}

function detectCollision(bird, pip){
    return   bird.x < pip.x + pip.width &&
             pip.x < bird.x + bird.width &&
             bird.y < pip.y + pip.height &&
             pip.y < bird.y + bird.height;
           
}

