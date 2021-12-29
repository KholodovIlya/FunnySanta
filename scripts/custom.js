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

// Mouse input
class Mouse extends GameObject { constructor() { super(0, 0, 1, 1); this.down = false; } collision(other) {} }
const mouse = new Mouse();
document.addEventListener('mousemove', function(e) {
  mouse.transform.position.x = (e.clientX - canvas.offsetLeft) / (canvas.offsetWidth / canvas.width);
  mouse.transform.position.y = (e.clientY - canvas.offsetTop) / (canvas.offsetHeight / canvas.height);
});
document.addEventListener('mousedown', function(e) { mouse.down = true; });
document.addEventListener('mouseup', function(e) { mouse.down = false; });

document.addEventListener('touchmove', function(e) {
  mouse.transform.position.x = (e.changedTouches[0].clientX - canvas.offsetLeft) / (canvas.offsetWidth / canvas.width);
  mouse.transform.position.y = (e.changedTouches[0].clientY - canvas.offsetTop) / (canvas.offsetHeight / canvas.height);
});
document.addEventListener('touchstart', function(e) { mouse.down = true; });
document.addEventListener('touchend', function(e) { mouse.down = false; });
objects.push(mouse);
// Mouse input

// UI
class Button extends GameObject {
  constructor(x, y, width, height) { super(x, y, width, height); this.pressed = false; }
  update() { if(!mouse.down & this.pressed) { this.pressed = false; if (this.onRelease) this.onRelease(); } }
  collision(other) { if(mouse.down & !this.pressed) { this.pressed = true; if (this.onPress) this.onPress(); } }
}
// UI
// Tools

let cash = 0;
const back = new Image();
const santa = new Image();
const happy = new Image();
const bomb = new Image();
const mini_happy = new Image();
const share = new Image();
back.src = "resources/images/back.png";
santa.src = "resources/images/santa.png";
mini_happy.src = "resources/images/mini_prezent.png";
bomb.src = "resources/images/bomb.png";
happy.src = "resources/images/prezent.png";
share.src = "resources/images/share.png";

class Back extends GameObject { constructor() { super(540, 540, 1080, 1080); } render() { renderImage(back, this.transform); } update() { if(this.transform.size.x > 1080) { this.transform.size.x--; this.transform.size.y--; } } }
let background = new Back();
class Santa extends GameObject {
  constructor(image) { super(0, 980, 260, 200); this.image = image; }
  update() { this.transform.position.x = mouse.transform.position.x; }
  render() {
    renderImage(this.image, this.transform);
    context.font = "100px cursive";
    context.fillStyle = "black";
    context.fillText(cash, 10, 90);
  }
  collision() {}
}
class Fallen extends GameObject {
  constructor(speed, cost, fall, image) { super(Math.random() * 880 + 100, -100, 200, 200); this.speed = speed; this.image = image; this.cost = cost; this.fall = fall; }
  collision(other) { if(other.constructor.name === "Santa") { this.destroyed = true; cash += this.cost; background.transform.size.x += 15; background.transform.size.y += 15; if (cash < 0) cash = 0; }  }
  update() { this.transform.position.y += this.speed; if (this.transform.position.y > 1180) { cash += this.fall; this.destroyed = true; background.transform.size.x += 15; background.transform.size.y += 15; if (cash < 0) cash = 0; } }
  render() { renderImage(this.image, this.transform); }
}
class AppleCreator extends GameObject{
  constructor(recharge) { super(0, 0, 0, 0); this.recharge = recharge; this.time = 0; }
  update() { this.time++;
    if(this.time >= this.recharge) {
      let rand = Math.floor(Math.random() * (Math.floor(5) - Math.ceil(0) + 1)) + Math.ceil(0);
      if(rand === 0) objects.push(new Fallen(10, 3, -3, happy));
      else if(rand === 1) objects.push(new Fallen(3, -2, 0, bomb));
      else objects.push(new Fallen(5, 1, -1, mini_happy));
      this.time = 0;
    }
  }
}
class Share extends Button {
  constructor(image) { super(50, 125, 100, 50); this.image = image; }
  render() { renderImage(this.image, this.transform); }
  onRelease(){
    this.transform.size.x += 10;
    this.transform.size.y += 5;
  }
  onPress() {
    this.transform.size.x -= 10;
    this.transform.size.y -= 5;
    if (navigator.share) {
    navigator.share({
      text: 'С новым годом!!! ',
      url: 'https://kholodovilya.github.io/FunnySanta/'
    }).then(() => { cash += 10; }).catch((err) => console.error(err));
    } else { alert("The current browser does not support the share function. Please, manually share the link") }
  }
}

objects.push(background);
objects.push(new Santa(santa));
objects.push(new Share(share));
objects.push(new AppleCreator(60));
