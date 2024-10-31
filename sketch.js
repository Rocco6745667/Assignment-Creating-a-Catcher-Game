//Assignment: Creating a Catcher Game
//Rocco Ali
//218008847
//Sihwa Park
//10/30/2024

let bgMusic, destroySound;
let gameState = "title";
let catcher, comets = [];
let totalCometsCaught = 0, health = 15;
let spaceshipImg, cometImg;
let highScore = 0; // Track the highest score

function preload() {
  bgMusic = loadSound('data/background-music1.mp3');
  destroySound = loadSound('data/comet-destroyed.mp3');
  spaceshipImg = loadImage('data/spaceship.png');
  cometImg = loadImage('data/comet.png');
}

function setup() {
  createCanvas(800, 600);
  
  // Load high score from localStorage if it exists
  if (localStorage.getItem('highScore')) {
    highScore = parseInt(localStorage.getItem('highScore'));
  }
  
  initializeGame();
}

function draw() {
  background(0);
  
  if (gameState === "title") {
    displayTitleScreen();
  } else if (gameState === "playing") {
    playGame();
  } else if (gameState === "gameOver") {
    displayGameOver();
  }
}

function displayTitleScreen() {
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Welcome to Comet Blaster!", width / 2, height / 3);
  text("Press any key to start", width / 2, height / 1.5);
  textSize(20);
  text("High Score: " + highScore, width / 2, height / 1.3);
}

function playGame() {
  catcher.setLocation(mouseX, catcher.y);
  catcher.display();
  
  for (let i = comets.length - 1; i >= 0; i--) {
    comets[i].move();
    comets[i].display();
    
    if (catcher.intersect(comets[i])) {
      totalCometsCaught++;
      destroySound.play();
      comets.splice(i, 1);
    } else if (comets[i].y > height) {
      health--;
      comets.splice(i, 1);
    }
  }
  
  if (comets.length < 10) {
    comets.push(new Comet(random(width), -20, random(15, 30), random(2, 5), color(random(255), random(255), random(255))));
  }
  
  displayStats();
  
  if (health <= 0) {
    endGame();
  }
}

function displayGameOver() {
  fill(255, 0, 0);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2);
  text("Press 'R' to Restart", width / 2, height / 2 + 80);
  textSize(20);
  text("High Score: " + highScore, width / 2, height / 1.8);
}

function displayStats() {
  fill(255);
  textSize(20);
  text('                            Comets Caught: ' + totalCometsCaught, 10, 30);
  text('             Health: ' + health, 10, 60);
  text('                      High Score: ' + highScore, 10, 90);
}

function keyPressed() {
  if (gameState === "title") {
    startGame();
  } else if (gameState === "gameOver" && (key === 'r' || key === 'R')) {
    resetGame();
  }
}

function startGame() {
  gameState = "playing";
  bgMusic.loop();
}

function endGame() {
  gameState = "gameOver";
  bgMusic.stop();
  
  // Update high score if the current score is higher
  if (totalCometsCaught > highScore) {
    highScore = totalCometsCaught;
    localStorage.setItem('highScore', highScore);  // Save new high score to localStorage
  }
}

function resetGame() {
  totalCometsCaught = 0;
  health = 15;
  comets = [];
  initializeGame();
  gameState = "title";
  loop();
}

function initializeGame() {
  catcher = {
    x: width / 2,
    y: height - 60,
    r: 50,
    
    setLocation(x, y) {
      this.x = x;
      this.y = y;
    },
    
    display() {
      imageMode(CENTER);
      image(spaceshipImg, this.x, this.y, this.r * 2, this.r * 2);
    },
    
    intersect(comet) {
      let d = dist(this.x, this.y, comet.x, comet.y);
      return d < this.r + comet.r;
    }
  };
  
  for (let i = 0; i < 10; i++) {
    comets.push(new Comet(random(width), -20, random(15, 30), random(2, 5), color(random(255), random(255), random(255))));
  }
}

function Comet(x, y, r, speed, c) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.speed = speed;
  this.c = c;
  this.tx = random(1000);
  
  this.move = function() {
    this.y += this.speed;
    this.x += map(noise(this.tx), 0, 1, -2, 2);
    this.tx += 0.01;
  };
  
  this.display = function() {
    imageMode(CENTER);
    image(cometImg, this.x, this.y, this.r * 2, this.r * 2);
  };
}
