let gameState = "START";
let difficulty = "MEDIUM";
let gapSize = 150;
let baseSpeed = 3;
let baseMissileSpeed = 4;
let birdX = 100, birdY = 300, birdVel = 0;
let pipeX = 400, pipeTop, pipeBottom;
let missileX = 400, missileY = 200;
let score = 0;
let pipeSpeed, missileSpeed;

let laserState = "INACTIVE";
let laserTimer = 0;
let laserY = 0;
let baseLaserCooldown, baseLaserWarning, baseLaserFiring;

let bgm;
let musicSlider;
let missileImg;
let pipeImg;
let bgImg;

let birdColors = [
  [255, 200, 0],  
  [255, 50, 50],  
  [50, 150, 255],  
  [50, 255, 50],  
  [200, 50, 255],  
  [255, 255, 255],
  [50, 50, 50]    
];

let primaryColorIndex = 0;
let secondaryColorIndex = 5;
let tempPrimaryIndex = 0;
let tempSecondaryIndex = 5;

function preload() {
  soundFormats('mp3', 'ogg');
  bgm = loadSound('song.mp3');
  missileImg = loadImage('—Pngtree—vector missile bomb icon simple_7516577.png');
  pipeImg = loadImage('—Pngtree—iron pipeline_4431250.png');
  bgImg = loadImage('hell-background-czu4fir9lytgyei2.jpg');
}

function setup() {
  createCanvas(400, 600);
 
  musicSlider = createSlider(0, 1, 0.5, 0.01);
  musicSlider.position(width / 2 - 65, 250);
  musicSlider.hide();
 
  resetGame();
}

function draw() {
  if (bgImg && bgImg.width > 0) {
    let bgScale = max(width / bgImg.width, height / bgImg.height);
    let scaledW = bgImg.width * bgScale;
    let scaledH = bgImg.height * bgScale;
    image(bgImg, (width - scaledW) / 2, (height - scaledH) / 2, scaledW, scaledH);
  } else {
    background(135, 206, 235);
  }

  if (bgm && bgm.isLoaded()) {
    bgm.setVolume(musicSlider.value());
  }
 
  if (gameState === "START") {
    drawStartMenu();
  } else if (gameState === "SETTINGS") {
    drawSettingsMenu();
  } else if (gameState === "COSMETICS") {
    drawCosmeticsMenu();
  } else if (gameState === "PLAYING") {
    drawGame();
  } else if (gameState === "GAMEOVER") {
    drawGameOver();
  }
}

function drawStartMenu() {
  textAlign(CENTER, CENTER);
 
  fill(255);
  textFont('Impact');
  textSize(35);
  text("FLAPPY BIRD XTREME", width / 2, 100);
 
  textFont('sans-serif');
 
  fill(0, 200, 0);
  rect(width / 2 - 75, 170, 150, 40, 10);
  fill(255);
  textSize(24);
  text("START", width / 2, 190);
 
  fill(100);
  rect(width / 2 - 75, 230, 150, 40, 10);
  fill(255);
  text("SETTINGS", width / 2, 250);
 
  fill(100);
  rect(width / 2 - 75, 290, 150, 40, 10);
  fill(255);
  text("COSMETICS", width / 2, 310);
 
  fill(255);
  textSize(20);
  text("Difficulty: " + difficulty, width / 2, 350);
 
  fill(difficulty === "EASY" ? "yellow" : "gray");
  rect(50, 380, 80, 40, 5);
  fill(0); text("EASY", 90, 400);
 
  fill(difficulty === "MEDIUM" ? "orange" : "gray");
  rect(160, 380, 80, 40, 5);
  fill(0); text("MED", 200, 400);
 
  fill(difficulty === "HARD" ? "red" : "gray");
  rect(270, 380, 80, 40, 5);
  fill(0); text("HARD", 310, 400);
 
  fill(255);
  textSize(24);
  text("HOW TO PLAY", width / 2, 480);
  textSize(16);
  text("Tap screen or press Space to jump.", width / 2, 515);
  text("Dodge the pipes, missiles, and lasers!", width / 2, 545);
}

function drawSettingsMenu() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("SETTINGS", width / 2, 100);
 
  textSize(24);
  text("Music Volume", width / 2, 200);
 
  fill(200, 0, 0);
  rect(width / 2 - 75, 400, 150, 50, 10);
  fill(255);
  text("BACK", width / 2, 425);
}

function drawCosmeticsMenu() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("COSMETICS", width / 2, 80);

  let by = 180 + sin(frameCount * 0.1) * 10;
  let pC = birdColors[tempPrimaryIndex];
  let sC = birdColors[tempSecondaryIndex];
 
  fill(pC[0], pC[1], pC[2]);
  ellipse(width / 2, by, 60, 60);
 
  fill(sC[0], sC[1], sC[2]);
  let wingFlap = sin(frameCount * 0.5) * 15;
  ellipse(width / 2 - 10, by + wingFlap, 30, 20);

  textSize(20);
 
  fill(100);
  rect(width / 2 - 100, 260, 200, 40, 10);
  fill(255);
  text("PRIMARY COLOR", width / 2, 280);
  fill(pC[0], pC[1], pC[2]);
  rect(width / 2 + 110, 265, 30, 30, 5);

  fill(100);
  rect(width / 2 - 100, 320, 200, 40, 10);
  fill(255);
  text("SECONDARY COLOR", width / 2, 340);
  fill(sC[0], sC[1], sC[2]);
  rect(width / 2 + 110, 325, 30, 30, 5);

  fill(0, 200, 0);
  rect(width / 2 - 120, 450, 100, 40, 10);
  fill(255);
  text("APPLY", width / 2 - 70, 470);

  fill(200, 0, 0);
  rect(width / 2 + 20, 450, 100, 40, 10);
  fill(255);
  text("CANCEL", width / 2 + 70, 470);
}

function drawGameOver() {
  drawGameEntities();
 
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
 
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2 - 40);
  textSize(20);
  text("Final Score: " + score, width / 2, height / 2 + 10);
 
  fill(0, 200, 0);
  rect(width / 2 - 75, height / 2 + 50, 150, 50, 10);
  fill(255);
  text("RESTART", width / 2, height / 2 + 75);
}

function drawGameEntities() {
  let pC = birdColors[primaryColorIndex];
  fill(pC[0], pC[1], pC[2]);
  ellipse(birdX, birdY, 30, 30);
 
  let sC = birdColors[secondaryColorIndex];
  fill(sC[0], sC[1], sC[2]);
  let wingFlap = sin(frameCount * 0.5) * 8;
  ellipse(birdX - 5, birdY + wingFlap, 15, 10);
 
  if (pipeImg) {
    image(pipeImg, pipeX, 0, 60, pipeTop);
   
    push();
    translate(pipeX, height);
    scale(1, -1);
    image(pipeImg, 0, 0, 60, height - pipeBottom);
    pop();
  } else {
    fill(0, 200, 0);
    rect(pipeX, 0, 60, pipeTop);
    rect(pipeX, pipeBottom, 60, height - pipeBottom);
  }
 
  if (missileImg) {
    push();
    translate(missileX + 10, missileY + 5);
    rotate(HALF_PI);
    imageMode(CENTER);
    image(missileImg, 0, 0, 40, 40);
    pop();
  }

  if (laserState === "WARNING") {
    push();
    let alpha = map(sin(frameCount * 0.2), -1, 1, 50, 255);
    noStroke();
    fill(255, 0, 0, alpha);
    rect(0, laserY - 1, width, 2);
    ellipse(25, laserY, 30, 30);
    fill(255, 255, 255, alpha);
    textSize(22);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text("!", 25, laserY);
    pop();
  } else if (laserState === "FIRING") {
    push();
    noStroke();
    fill(255, 0, 0);
    rect(0, laserY - 10, width, 20);
    fill(255, 255, 255);
    rect(0, laserY - 4, width, 8);
    pop();
  }
 
  fill(255);
  textSize(32);
  textAlign(CENTER, BASELINE);
  textStyle(NORMAL);
  text(score, width / 2, 50);
}

function drawGame() {
  birdVel += 0.6;
  birdY += birdVel;
 
  pipeX -= pipeSpeed;
  missileX -= missileSpeed;
 
  if (missileY < birdY) missileY += 2;
  if (missileY > birdY) missileY -= 2;

  if (pipeX + 60 < 0) {
    pipeX = 400;
    pipeTop = random(50, height - gapSize - 50);
    pipeBottom = pipeTop + gapSize;
    score++;
   
    pipeSpeed = baseSpeed + score * 0.2;
    missileSpeed = baseMissileSpeed + score * 0.2;
  }
 
  if (missileX < -20) {
    missileX = width + random(0, 200);
    missileY = random(0, height);
  }

  if (laserState === "INACTIVE") {
    laserTimer--;
    if (laserTimer <= 0) {
      laserState = "WARNING";
      laserTimer = baseLaserWarning;
      laserY = random(50, height - 50);
    }
  } else if (laserState === "WARNING") {
    laserTimer--;
    if (laserTimer <= 0) {
      laserState = "FIRING";
      laserTimer = baseLaserFiring;
    }
  } else if (laserState === "FIRING") {
    laserTimer--;
    if (laserTimer <= 0) {
      laserState = "INACTIVE";
      laserTimer = baseLaserCooldown + random(0, 100);
    }
  }

  let hitPipe = (birdX + 12 > pipeX + 5 && birdX - 12 < pipeX + 55) &&
                (birdY - 12 < pipeTop || birdY + 12 > pipeBottom);
  let hitBounds = (birdY > height || birdY < 0);
  let hitMissile = dist(missileX + 10, missileY + 5, birdX, birdY) < 20;
  let hitLaser = (laserState === "FIRING" && abs(birdY - laserY) < 25);

  if (hitPipe || hitBounds || hitMissile || hitLaser) {
    gameState = "GAMEOVER";
  }
 
  drawGameEntities();
}

function resetGame() {
  birdX = 100;
  birdY = 300;
  birdVel = 0;
 
  if (difficulty === "EASY") {
    gapSize = 200; baseSpeed = 2; baseMissileSpeed = 2;
    baseLaserCooldown = 300; baseLaserWarning = 120; baseLaserFiring = 45;
  }
  else if (difficulty === "MEDIUM") {
    gapSize = 150; baseSpeed = 3; baseMissileSpeed = 4;
    baseLaserCooldown = 200; baseLaserWarning = 90; baseLaserFiring = 60;
  }
  else if (difficulty === "HARD") {
    gapSize = 100; baseSpeed = 4; baseMissileSpeed = 6;
    baseLaserCooldown = 120; baseLaserWarning = 60; baseLaserFiring = 75;
  }
 
  pipeX = 400;
  pipeTop = random(50, height - gapSize - 50);
  pipeBottom = pipeTop + gapSize;
 
  missileX = width + 200;
  missileY = random(0, height);
 
  laserState = "INACTIVE";
  laserTimer = baseLaserCooldown;
 
  score = 0;
  pipeSpeed = baseSpeed;
  missileSpeed = baseMissileSpeed;
}

function mousePressed() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
 
  if (bgm && bgm.isLoaded() && !bgm.isPlaying()) {
    bgm.loop();
  }

  if (gameState === "START") {
    if (mouseX > width/2 - 75 && mouseX < width/2 + 75 && mouseY > 170 && mouseY < 210) {
      resetGame();
      gameState = "PLAYING";
    }
    else if (mouseX > width/2 - 75 && mouseX < width/2 + 75 && mouseY > 230 && mouseY < 270) {
      gameState = "SETTINGS";
      musicSlider.show();
    }
    else if (mouseX > width/2 - 75 && mouseX < width/2 + 75 && mouseY > 290 && mouseY < 330) {
      gameState = "COSMETICS";
      tempPrimaryIndex = primaryColorIndex;
      tempSecondaryIndex = secondaryColorIndex;
    }
    else if (mouseY > 380 && mouseY < 420) {
      if (mouseX > 50 && mouseX < 130) difficulty = "EASY";
      if (mouseX > 160 && mouseX < 240) difficulty = "MEDIUM";
      if (mouseX > 270 && mouseX < 350) difficulty = "HARD";
    }
  }
  else if (gameState === "COSMETICS") {
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100) {
      if (mouseY > 260 && mouseY < 300) tempPrimaryIndex = (tempPrimaryIndex + 1) % birdColors.length;
      if (mouseY > 320 && mouseY < 360) tempSecondaryIndex = (tempSecondaryIndex + 1) % birdColors.length;
    }
    if (mouseY > 450 && mouseY < 490) {
      if (mouseX > width/2 - 120 && mouseX < width/2 - 20) {
        primaryColorIndex = tempPrimaryIndex;
        secondaryColorIndex = tempSecondaryIndex;
        gameState = "START";
      }
      else if (mouseX > width/2 + 20 && mouseX < width/2 + 120) {
        gameState = "START";
      }
    }
  }
  else if (gameState === "SETTINGS") {
    if (mouseX > width/2 - 75 && mouseX < width/2 + 75 && mouseY > 400 && mouseY < 450) {
      gameState = "START";
      musicSlider.hide();
    }
  }
  else if (gameState === "GAMEOVER") {
    if (mouseX > width/2 - 75 && mouseX < width/2 + 75 && mouseY > height/2 + 50 && mouseY < height/2 + 100) {
      gameState = "START";
    }
  }
  else if (gameState === "PLAYING") {
    birdVel = -8;
  }
}

function touchStarted() {
  mousePressed();
  if (gameState === "PLAYING") {
    return false;
  }
}

function keyPressed() {
  if (gameState === "PLAYING" && key === ' ') {
    birdVel = -8;
  }
}