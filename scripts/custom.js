// Tools
// Render
function renderImage(image, transform) {
  context.drawImage(image,
    transform.position.x - transform.size.x / 2, transform.position.y - transform.size.y / 2,
    transform.size.x, transform.size.y);
}
function renderCollision(transform) {
  context.strokeStyle = "lime"; context.lineWidth = 10;
  context.strokeRect(
    transform.position.x - transform.size.x / 2, transform.position.y - transform.size.y / 2,
    transform.size.x, transform.size.y);
}
// Render

// Input
class Mouse extends GameObject { constructor() { super(0, 0, 1, 1); this.down = false; } collision(other) {} }
const mouse = new Mouse();
// PC input
document.addEventListener('mousemove', function(e) {
  mouse.transform.position.x = (e.clientX - canvas.offsetLeft) / (canvas.offsetWidth / canvas.width);
  mouse.transform.position.y = (e.clientY - canvas.offsetTop) / (canvas.offsetHeight / canvas.height);
});
document.addEventListener('mousedown', function(e) { mouse.down = true; });
document.addEventListener('mouseup', function(e) { mouse.down = false; });
// Mobile input
function touch(event) {
  if (event.touches.length > 0) {
    mouse.transform.position.x = (event.touches[event.touches.length - 1].clientX - canvas.offsetLeft) / (canvas.offsetWidth / canvas.width);
    mouse.transform.position.y = (event.touches[event.touches.length - 1].clientY - canvas.offsetTop) / (canvas.offsetHeight / canvas.height);
  }
}
document.addEventListener('touchmove', function(e) { touch(e); });
document.addEventListener('touchstart', function(e) { touch(e); mouse.down = true; });
document.addEventListener('touchend', function(e) { mouse.down = false; });
objects.push(mouse);
// Input

// UI
class Button extends GameObject {
  constructor(x, y, width, height) { super(x, y, width, height); this.pressed = false; }
  update() { if(!mouse.down & this.pressed) { this.pressed = false; if (this.onRelease) this.onRelease(); } }
  collision(other) { if(other.constructor.name === "Mouse" & mouse.down & !this.pressed) { this.pressed = true; if (this.onPress) this.onPress(); } }
}
// UI
// Tools

let cash = 0;
const back = new Image();
const happy = new Image();
const bomb = new Image();
const mini_happy = new Image();
const share = new Image();
const fire = new Image();
const newy = new Image();
const cher = new Image();

let currentSanta = 0;
const santas = [];
for(let u = 1; u < 5;u++){
  let santa = new Image();
  santa.src = "resources/images/santa" + u + ".png";
  santas.push(santa);
}

back.src = "resources/images/back.png";
mini_happy.src = "resources/images/mini_prezent.png";
bomb.src = "resources/images/bomb.png";
happy.src = "resources/images/prezent.png";
share.src = "resources/images/share.png";
fire.src = "resources/images/fire.png";
newy.src = "resources/images/new.png";
cher.src = "resources/images/cher.png";

class Back extends GameObject { constructor() { super(540, 540, 1080, 1080); } render() { renderImage(back, this.transform); } update() { if(this.transform.size.x > 1080) { this.transform.size.x--; this.transform.size.y--; } } }
let background = new Back();

class Fire extends GameObject {
  constructor() { super(270 + Math.random() * 540, 270 + Math.random() * 540, 0, 0); this.lifetime = 0; this.maxlifetime = 500; this.speed = 5 + Math.random() * 10; }
  update(){ this.lifetime++; this.transform.size.x+=this.speed; this.transform.size.y+=this.speed; if(this.transform.size.x >= this.maxlifetime) { this.destroyed = true; } }
  render() {
    let t = 1 - this.transform.size.x / this.maxlifetime;
    if(t < 0) t = 0;
    context.globalAlpha = t;
    renderImage(fire, this.transform);
    context.globalAlpha = 1;
  }
}
class HappyNewYear extends GameObject {
  constructor() { super(540, 540, 1080, 1080); this.recharge = 10; this.time = 0; }
  render() { renderImage(newy, this.transform); }

  update() {
    this.time++;
    if(this.time >= this.recharge) {
        objects.push(new Fire());
        this.time = 0;
    }
  }
}
class Santa extends GameObject {
  constructor() { super(0, 980, 260, 200); }
  update() { this.transform.position.x = mouse.transform.position.x; }
  render() {
    renderImage(santas[currentSanta], this.transform);
    context.font = "100px cursive";
    context.fillStyle = "black";
    context.fillText(cash + "/100", 10, 90);
  }
  collision() {}
}
class Fallen extends GameObject {
  constructor(speed, cost, fall, image) { super(Math.random() * 880 + 100, -100, 200, 200); this.speed = speed; this.image = image; this.cost = cost; this.fall = fall; }
  collision(other) { if(other.constructor.name === "Santa") { this.destroyed = true; cash += this.cost; background.transform.size.x += 15; background.transform.size.y += 15; if (cash <= 0) {cash = 0; gameOver();} }  }
  update() { this.transform.position.y += this.speed; if (this.transform.position.y > 1180) { cash += this.fall; this.destroyed = true; background.transform.size.x += 15; background.transform.size.y += 15; if (cash <= 0) {cash = 0; gameOver();} } }
  render() { renderImage(this.image, this.transform); }
}
class BigFallen extends GameObject {
  constructor(image) { super(540, -500, 1000, 1000); this.speed = 2; this.image = image; }
  collision(other) { if(other.constructor.name === "Santa") {
      while(objects.length > 0) objects.pop();
      objects.push(new HappyNewYear());
      objects.push(new Santa());
      objects.push(new Share(share));
      objects.push(mouse);
    }
  }
  update() { this.transform.position.y += this.speed; }
  render() { renderImage(this.image, this.transform); }
}
class AppleCreator extends GameObject{
  constructor(recharge) { super(0, 0, 0, 0); this.recharge = recharge; this.time = 0; }
  update() {
    this.time++;
    if(this.time >= this.recharge) {
      if(cash >= 100){
        while(objects.length > 0) objects.pop();
        objects.push(background);
        objects.push(new Santa());
        objects.push(new Share(share));
        objects.push(new BigFallen(mini_happy));
        objects.push(mouse);
      }else{
        let rand = Math.floor(Math.random() * (Math.floor(5) - Math.ceil(0) + 1)) + Math.ceil(0);
        if(rand === 0) objects.push(new Fallen(10, 3, -3, happy));
        else if(rand === 1) objects.push(new Fallen(3, -2, 0, bomb));
        else objects.push(new Fallen(5, 1, -1, mini_happy));
        this.time = 0;
      }
    }
  }
}
class Share extends Button {
  constructor(image) { super(150, 150, 300, 80); this.image = image; }
  render() { renderImage(this.image, this.transform); }
  onRelease(){
    this.transform.size.x += 10;
    this.transform.size.y += 5;
    if (navigator.share) {
      navigator.share({
        text: 'С новым годом!!! ',
        url: 'https://kholodovilya.github.io/FunnySanta/'
      }).then(() => { cash += 10; }).catch((err) => cash += 0);
    } else { alert("Извините, ваш браузер не может поделиться ссылкой!") }
  }
  onPress() {
    this.transform.size.x -= 10;
    this.transform.size.y -= 5;
  }
}

class Switch extends Button {
  constructor(image) { super(110, 250, 220, 75); this.image = image; }
  render() { renderImage(this.image, this.transform); }
  onRelease(){
    this.transform.size.x += 10;
    this.transform.size.y += 5;
    currentSanta++;
    if(currentSanta === santas.length) currentSanta = 0;
  }
  onPress() {
    this.transform.size.x -= 10;
    this.transform.size.y -= 5;
  }
}

objects.push(background);
objects.push(new Santa());
objects.push(new Share(share));
objects.push(new Switch(cher));
objects.push(new AppleCreator(60));

function gameOver() {
  while(objects.length > 0) objects.pop();
  objects.push(background);
  objects.push(new Santa());
  objects.push(new Share(share));
  objects.push(new Switch(cher));
  objects.push(mouse);
  alert("Конец!")
  objects.push(new AppleCreator(60));
}
