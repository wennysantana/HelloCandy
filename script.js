document.addEventListener('DOMContentLoaded', () => {
    let character;
    let scoreDisplay;
    let isJumping = false;
    let gravity = 0.9;
    let isGameOver = false;
    let score = 0;
    let speed = 5; 

    const startButton = document.getElementById('start-button');
    const menuContainer = document.querySelector('.menu-container');
    const gameContainer = document.querySelector('.game-container');

    
    const menuMusic = new Audio('audios/menu.mp3');
    const gameMusic = new Audio('audios/game.mp3');
    const gameOverMusic = new Audio('audios/gameover.mp3');

    
    menuMusic.loop = true;
    gameMusic.loop = true;
    gameOverMusic.loop = true;

    
    function stopAllMusic() {
        menuMusic.pause();
        menuMusic.currentTime = 0;
        gameMusic.pause();
        gameMusic.currentTime = 0;
        gameOverMusic.pause();
        gameOverMusic.currentTime = 0;
    }

    startButton.addEventListener('click', startGame); 

    function startGame() {
        stopAllMusic();
        gameMusic.play();

        menuContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        gameContainer.innerHTML = `
            <div class="background"></div>
            <div class="score">Pontuação: 0</div>
            <div class="clouds"></div>
            <div class="character"></div>
            <div class="obstacles"></div>
            <div class="candies"></div>
        `;

        character = document.querySelector('.character');
        scoreDisplay = document.querySelector('.score');
        score = 0;
        isGameOver = false;
        speed = 5;
        scoreDisplay.innerHTML = 'Pontuação: 0';

        document.addEventListener('keyup', control);
        generateObstacle();
        generateCloud();
        generateCandy();
        increaseDifficulty();
    }

    function control(e) {
        if (e.keyCode === 32 && !isJumping) { 
            jump();
        }
    }

    function jump() {
        let position = 0;
        isJumping = true;
        character.classList.add('jumping');

        let upTimerId = setInterval(() => {
            if (position >= 250) {
                clearInterval(upTimerId);
                let downTimerId = setInterval(() => {
                    if (position <= 0) {
                        clearInterval(downTimerId);
                        isJumping = false;
                        character.classList.remove('jumping');
                    }
                    position -= 5;
                    position *= gravity;
                    character.style.bottom = position + 'px';
                }, 20);
            }
            position += 70;
            position *= gravity;
            character.style.bottom = position + 'px';
        }, 20);
    }

    function generateObstacle() {
        let randomTime = Math.random() * 4000;
        let obstaclePosition = 800;
        const obstacle = document.createElement('div');
        if (!isGameOver) obstacle.classList.add('obstacle');
        document.querySelector('.obstacles').appendChild(obstacle);
        obstacle.style.left = obstaclePosition + 'px';

        let timerId = setInterval(() => {
            if (obstaclePosition > 0 && obstaclePosition < 50 && !isJumping) {
                clearInterval(timerId);
                isGameOver = true;
                gameOver();
            }
            obstaclePosition -= speed;
            obstacle.style.left = obstaclePosition + 'px';
        }, 20);

        if (!isGameOver) setTimeout(generateObstacle, randomTime);
    }

    function generateCloud() {
        let randomTime = Math.random() * 10000;
        const cloudType = Math.random() > 0.5 ? 'cloud' : 'cloud2';
        const cloud = document.createElement('div');
        cloud.classList.add(cloudType);
        cloud.style.left = `${Math.random() * 100}%`;
        cloud.style.top = `-${Math.random() * 40}%`;
        document.querySelector('.clouds').appendChild(cloud);
        cloud.style.animationDuration = `${Math.random() * 40 + 40}s`;

        if (!isGameOver) setTimeout(generateCloud, randomTime);
    }

    function generateCandy() {
        let randomTime = Math.random() * 6000;
        let candyPosition = 800;
        const candyType = Math.random() > 0.5 ? 'candy1' : 'candy2';
        const candy = document.createElement('div');
        candy.classList.add(candyType);
        document.querySelector('.candies').appendChild(candy);
        candy.style.left = candyPosition + 'px';

        let timerId = setInterval(() => {
            if (candyPosition > 0 && candyPosition < 100 && isJumping) { 
                score += 10;
                scoreDisplay.innerHTML = 'Pontuação: ' + score;
                candy.remove();
            }
            candyPosition -= speed;
            candy.style.left = candyPosition + 'px';
        }, 20);

        if (!isGameOver) setTimeout(generateCandy, randomTime);
    }

    function increaseDifficulty() {
        if (!isGameOver) {
            speed += 0.3; 
            setTimeout(increaseDifficulty, 1000);
        }
    }

    function gameOver() {
        stopAllMusic();
        gameOverMusic.play();

        gameContainer.innerHTML = `
            <div class="game-over-container">
                <h1>Game Over</h1>
                <button class="restart-button" onclick="restartGame()">Reiniciar Jogo</button>
            </div>
        `;
        document.removeEventListener('keyup', control);
    }

    window.restartGame = function() {
        startGame();
    };

    
    menuMusic.play();
});
