let ball, paddle, blocks; // Deklarace globálních proměnných pro míč, pálku a bloky
let level = 1; // Počáteční úroveň hry
let menu = true; // Příznak, zda se zobrazuje menu
let isLeftKeyHeld = false; // Příznak držení levé šipky
let isRightKeyHeld = false; // Příznak držení pravé šipky
let lives = 3; // Počet životů hráče
let score = 0; // Počáteční skóre

function setup() {
  createCanvas(400, 600); // Vytvoření plátna o rozměrech 400x600 pixelů
  initializeGame(); // Inicializace hry
}

function draw() {
  if (menu) {
    displayMenu(); // Zobrazování menu
  } else {
    background(200, 220, 255); // Nastavení pozadí hry
    paddle.show(); // Zobrazení pálky
    ball.show(); // Zobrazení míče
    ball.update(); // Aktualizace pozice míče
    checkCollision(); // Kontrola kolizí
    showBlocks(); // Zobrazení bloků
    displayLives(); // Zobrazení počtu životů
    displayScore(); // Zobrazení skóre

    if (blocks.length === 0) {
      nextLevel(); // Přechod na další úroveň po zničení všech bloků
    }
  }

  if (isLeftKeyHeld) {
    paddle.move(-1); // Pohyb pálky doleva při stisknuté klávese
  } else if (isRightKeyHeld) {
    paddle.move(1); // Pohyb pálky doprava při stisknuté klávese
  }
}

function keyPressed() {
  if (keyCode === 32 && menu) {
    menu = false;
    initializeGame(); // Start hry po stisku mezerníku
  }

  if (!menu) {
    if (key === 'ArrowLeft' || key === 'a') {
      isLeftKeyHeld = true; // Aktivace pohybu doleva při stisknutí klávesy šipky doleva nebo 'A'
    } else if (key === 'ArrowRight' || key === 'd') {
      isRightKeyHeld = true; // Aktivace pohybu doprava při stisknutí klávesy šipky doprava nebo 'D'
    }
  }
}

function keyReleased() {
  if (!menu) {
    if (key === 'ArrowLeft' || key === 'a') {
      isLeftKeyHeld = false; // Zastavení pohybu doleva po uvolnění klávesy
    } else if (key === 'ArrowRight' || key === 'd') {
      isRightKeyHeld = false; // Zastavení pohybu doprava po uvolnění klávesy
    }
  }
}

function initializeGame() {
  ball = new Ball(); // Inicializace nové instance míče
  paddle = new Paddle(); // Inicializace nové instance pálky
  blocks = createBlocks(level); // Vytvoření bloků pro aktuální úroveň
}

function displayMenu() {
  background(0); // Nastavení pozadí menu na černou
  fill(255); // Nastavení barvy textu na bílou
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Block Breaker", width / 2, height / 2 - 50); // Zobrazení názvu hry
  textSize(16);
  text("Press SPACE to start", width / 2, height / 2); // Zobrazení instrukcí
  text("Use arrow keys or A/D to move the paddle", width / 2, height / 2 + 30);
  text("Break all blocks to advance to the next level", width / 2, height / 2 + 60);
}

function createBlocks(level) {
  let blocks = [];
  let rows = 5;
  let cols = 8;
  let blockWidth = 50;
  let blockHeight = 20;

  let xOffset = (width - cols * blockWidth) / 2;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let type = floor(random(3)) + 1; // Náhodný typ bloku (1, 2 nebo 3)
      let block = new Block(xOffset + j * blockWidth, i * blockHeight + 50, type);
      blocks.push(block);
    }
  }

  return blocks; // Vytvoření bloků pro aktuální úroveň a jejich vrácení
}

function showBlocks() {
  for (let block of blocks) {
    block.show(); // Zobrazení všech bloků
  }
}

function checkCollision() {
  if (ball.intersects(paddle)) {
    ball.reflect(paddle); // Odrážení míče od pálky při kolizi
  } else {
    if (ball.y + ball.radius > height) {
      loseLife(); // Ztráta života při dopadu míče na spodní část obrazovky
    }
  }

  for (let i = blocks.length - 1; i >= 0; i--) {
    if (ball.intersects(blocks[i])) {
      ball.reflect(blocks[i]); // Odrážení míče od bloku při kolizi
      if (blocks[i].hit()) {
        blocks.splice(i, 1); // Odstranění zničeného bloku
      }
    }
  }
}

function nextLevel() {
  level++; // Přechod na další úroveň
  ball.reset(); // Resetování pozice míče
  paddle.reset(); // Resetování pozice pálky
  blocks = createBlocks(level); // Vytvoření bloků pro novou úroveň
}

function gameOver() {
  menu = true; // Nastavení příznaku pro zobrazení menu
  level = 1; // Resetování úrovně
  lives = 3; // Resetování počtu životů
  score = 0; // Resetování skóre
  initializeGame(); // Inicializace hry
}

function displayLives() {
  fill(255);
  textSize(16);
  textAlign(RIGHT, TOP);
  text(`Lives: ${lives}`, width - 10, 10); // Zobrazení počtu zbývajících životů v pravém horním rohu
}

function displayScore() {
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Score: ${score}`, 10, 10); // Zobrazení skóre v levém horním rohu
}

function loseLife() {
  lives--; // Snížení počtu životů
  if (lives <= 0) {
    gameOver(); // Konec hry po ztrátě všech životů
  } else {
    ball.reset(); // Resetování pozice míče
    paddle.reset(); // Resetování pozice pálky
  }
}

// Třída reprezentující míč
class Ball {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.radius = 10;
    this.speed = 5;
    this.direction = createVector(1, -1).normalize(); // Normalizace směru míče
  }

  show() {
    fill(255, 150, 150);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2); // Zobrazení míče
  }

  update() {
    this.x += this.direction.x * this.speed; // Aktualizace pozice míče podle směru a rychlosti
    this.y += this.direction.y * this.speed;

    if (this.x - this.radius <= 0 || this.x + this.radius >= width) {
      this.direction.x *= -1; // Odrážení míče od bočních stěn
    }

    if (this.y - this.radius <= 0) {
      this.direction.y *= -1; // Odrážení míče od horní stěny
    }
  }

  intersects(obj) {
    let closestX = constrain(this.x, obj.x, obj.x + obj.width);
    let closestY = constrain(this.y, obj.y, obj.y + obj.height);
    let distanceX = this.x - closestX;
    let distanceY = this.y - closestY;
    let distance = sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < this.radius) {
        if (obj instanceof Paddle) {
            // Výpočet relativní pozice kolize na pálce
            let relativeIntersect = map(this.x, obj.x, obj.x + obj.width, -1, 1);
            // Mapování relativní pozice na úhel odrazu
            let bounceAngle = map(relativeIntersect, -1, 1, radians(-60), radians(60));
            // Nastavení nového směru míče podle odrazového úhlu
            this.direction = p5.Vector.fromAngle(bounceAngle);
            return true;
        } else {
            return closestY === obj.y + obj.height;
        }
    }

    return false;
  }

  reflect(obj) {
    if (obj instanceof Paddle) {
      let relativeIntersect = (this.x - obj.x) / obj.width; // Relativní pozice kolize na pálce
      let bounceAngle = map(relativeIntersect, 0, 1, radians(-60), radians(60)); // Mapování relativní pozice na úhel odrazu
      this.direction = p5.Vector.fromAngle(bounceAngle); // Nastavení nového směru míče podle odrazového úhlu
    } else {
      if (this.x > obj.x && this.x < obj.x + obj.width) {
        this.direction.y *= -1; // Odrážení míče od horní nebo spodní hrany bloku
      } else {
        this.direction.x *= -1; // Odrážení míče od boční hrany bloku
      }
    }
  }

  reset() {
    this.x = width / 2; // Resetování pozice míče do středu
    this.y = height / 2;
    this.direction = createVector(1, -1).normalize(); // Resetování směru míče
  }
}

// Třída reprezentující pálku
class Paddle {
  constructor() {
    this.width = 180; // Šířka pálky
    this.height = 10; // Výška pálky
    this.x = (width - this.width) / 2; // Pozice pálky na začátku hry
    this.y = height - this.height - 20; // Výška pálky od spodní hrany plátna         
    this.speed = 10; // Rychlost pohybu pálky
  }

  show() {
    fill(0, 150, 255);
    rect(this.x, this.y, this.width / 2, this.height); // Zobrazení pálky
    fill(255);
    rect(0, height - 5, width, 5); // Zobrazení bariéry na spodní hraně plátna
  }

  reset() {
    this.x = (width - this.width) / 2; // Resetování pozice pálky do středu
  }

  move(dir) {
    this.x += this.speed * dir; // Pohyb pálky v závislosti na směru a rychlosti
    this.x = constrain(this.x, 0, width - this.width / 2); // Omezení pohybu pálky do mezí plátna
  }
}

// Třída reprezentující blok
class Block {
  constructor(x, y, type) {
    this.width = 50; // Šířka bloku
    this.height = 20; // Výška bloku
    this.x = x; // Pozice bloku
    this.y = y;
    this.type = type; // Typ bloku (1 = zelený, 2 = červený, 3 = modrý)
    this.lives = (type === 3) ? 2 : 1; // Počet životů bloku (modrý má 2 životy)
  }

  show() {
    stroke(0); // Černé okraje bloku
    strokeWeight(1);
    if (this.type === 1) {
      fill(0, 255, 0); // Zelený blok
    } else if (this.type === 2) {
      fill(255, 0, 0); // Červený blok
    } else if (this.type === 3) {
      fill(0, 0, 255); // Modrý blok
    }
    rect(this.x, this.y, this.width, this.height); // Zobrazení bloku

    if (this.type === 3) {
      fill(255); // Bílá barva pro text
      textSize(12);
      textAlign(CENTER, CENTER);
      text(this.lives, this.x + this.width / 2, this.y + this.height / 2); // Zobrazení počtu životů uprostřed modrého bloku
    }
  }

  hit() {
    this.lives--; // Snížení počtu životů bloku
    score += 10; // Přidání bodů za zásah

    if (this.lives <= 0) {
      if (this.type === 2) {
        score += 20; // Přidání extra bodů za červený blok
        // Implementace výbuchu (můžete přidat animaci nebo jiné efekty)
      }
      return true; // Blok je zničen
    }

    return false; // Blok není zničen
  }
}
