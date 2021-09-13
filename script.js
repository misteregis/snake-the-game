let canvas = document.getElementById("snake"), // criar elemento que irá rodar o jogo
    eatenInfo = document.querySelector('span:first-child b:nth-child(2)'),
    speedInfo = document.querySelector('span:last-child b'),
    level = document.querySelector('span:first-child b'),
    r = Math.round(Math.random() * (3 - 1) + 1),
    div = document.querySelector('div'),
    h1 = document.querySelector('h1'),
    context = canvas.getContext("2d"),
    currentLevel = 1,
    nextLevel = 3,
    nextFood = nextLevel,
    box = 32,
    snake = [], // criar cobrinha como lista, já que ela vai ser uma série de coordenadas, que quando pintadas, criam os quadradinhos
    speed = 4,
    eaten = 0,
    max = 9;

let direction = "right", food;

// criando elementos de imagens
let ground = document.createElement('img'),
    snakeup = document.createElement('img'),
    snakeright = document.createElement('img'),
    snakedown = document.createElement('img'),
    snakeleft = document.createElement('img'),
    rat1 = document.createElement('img'),
    rat2 = document.createElement('img'),
    rat3 = document.createElement('img');

// setando imagem
ground.src = 'img/ground.jpg';
snakeup.src = 'img/snakeup.png';
snakeright.src = 'img/snakeright.png';
snakedown.src = 'img/snakedown.png';
snakeleft.src = 'img/snakeleft.png';
rat1.src = 'img/rat1.png';
rat2.src = 'img/rat2.png';
rat3.src = 'img/rat3.png';

function criarBG() {
    context.drawImage(ground, 0, 0, canvas.width, canvas.height);
}

function criarCobrinha (){
    for(i = 0; i < snake.length; i++){
        if (i === 0) {
            context.drawImage(eval('snake' + direction), snake[i].x, snake[i].y, box, box);
        } else {
            context.fillStyle = "#94396B";
            context.fillRect(snake[i].x, snake[i].y, box, box);
        }
    }
}

function drawFood (){
    context.drawImage(eval('rat' + r), food.x, food.y, box, box);
}

// quando um evento acontece, detecta e chama uma função
document.addEventListener('keydown', update);

// aceita as setas e as teclas A,S,D,W
function update(event){
    let alpha = {a: 'left', w: 'up', d: 'right', s: 'down'};
    let dir = event.key.toLowerCase().replace('arrow', '');
    dir = alpha[dir] ? alpha[dir] : dir;

    if(dir == 'left' && direction != 'right') direction = 'left';
    if(dir == 'up' && direction != 'down') direction = 'up';
    if(dir == 'right' && direction != 'left') direction = 'right';
    if(dir == 'down' && direction != 'up') direction = 'down';
}

function iniciarJogo(){
    let canvas = document.querySelector('canvas'),
        w = canvas.width,
        square_minus_one = w/box-1,
        square = w/box;

    let xY = Math.floor(w/2/32)*32;
    if (typeof snake[0] === 'undefined') snake.push({x:xY, y: xY});
    if (typeof food === 'undefined') food = {
        x: Math.floor(Math.random() * square_minus_one +1) * box,
        y: Math.floor(Math.random() * square_minus_one +1) * box
    };

    if(snake[0].x > square_minus_one*box && direction == "right") snake[0].x = 0;
    if(snake[0].x < 0 && direction == 'left') snake[0].x = square * box;
    if(snake[0].y > square_minus_one*box && direction == "down") snake[0].y = 0;
    if(snake[0].y < 0 && direction == 'up') snake[0].y = square * box;

    for(i = 1; i < snake.length; i++){
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
            div.style.backgroundColor = 'red';
            h1.style.color = 'red';
            clearInterval(jogo);
            setTimeout(()=>{
                alert('Game Over :(');
                h1.style.color = 'green';
                div.style.backgroundColor = '#38454F';
            }, 100);
        }
    }

    criarBG();
    criarCobrinha();
    drawFood();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(direction == "right") snakeX += box;
    if(direction == "left") snakeX -= box;
    if (direction == "up") snakeY -= box;
    if(direction == "down") snakeY += box;

    if(snakeX != food.x || snakeY != food.y){
        snake.pop(); // pop tira o último elemento da lista
    } else {
        nextFood--;
        food.x = Math.floor(Math.random() * square_minus_one +1) * box;
        food.y = Math.floor(Math.random() * square_minus_one +1) * box;
        r = Math.round(Math.random() * (3 - 1) + 1);
        eaten++;
    }

    if (eaten >= nextLevel && speed > 0) {
        speed--;
        currentLevel++;
        nextLevel = eaten*3;

        clearInterval(jogo);

        let ms = speed === 0 ? 50 : (
            speed === 1 ? 100 : (
                speed === 2 ? 150 : (speed-1) * 100
            )
        );

        jogo = setInterval(iniciarJogo, ms);

        if (speed <= 0) nextLevel = '&infin;';

        level.textContent = currentLevel;
        speedInfo.textContent = ms;
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    eatenInfo.innerHTML = eaten + '/' + nextLevel;

    snake.unshift(newHead); // método unshift adiciona como primeiro quadradinho da cobrinha
}

let jogo = setInterval(iniciarJogo, (speed-1) * 100);

speedInfo.textContent = (speed-1) * 100;
level.textContent = currentLevel;
