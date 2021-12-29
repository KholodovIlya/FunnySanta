const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d"); context.imageSmoothingEnabled = false;
const fps = 60; const fpsInterval = 1000 / fps;
const objects = [];

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Transform {
  constructor(x, y, width, height) {
    this.position = new Vector2(x, y);
    this.size = new Vector2(width, height);
  }
}
class GameObject {
  constructor(x, y, width, height) {
    this.transform = new Transform(x, y, width, height);
    this.destroyed = false;
  }
}

function update() {
  objects.forEach((object, i) => {
    if(object.destroyed) { objects.splice(i, 1); }
    else{ if(object.update) { object.update(); } }
  });
}
function collisions() {
  for(let i = 0; i < objects.length; i++) {
    const obj_1 = objects[i];
    if(obj_1.collision) {
      for(let q = objects.length - 1; q > i; q--) {
        const obj_2 = objects[q];
        if(obj_2.collision) {
          if(Math.abs(obj_1.transform.position.x - obj_2.transform.position.x) < (obj_1.transform.size.x + obj_2.transform.size.x) / 2 &
             Math.abs(obj_1.transform.position.y - obj_2.transform.position.y) < (obj_1.transform.size.y + obj_2.transform.size.y) / 2) {
            obj_1.collision(obj_2);
            obj_2.collision(obj_1);
          }
        }
      }
    }
  }
}
function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  objects.forEach(object => { if(object.render) object.render(); });
}

async function mainLoop() {
  const startTime = performance.now();
  await update(); await collisions(); await render();
  let sleepTime = fpsInterval - Math.abs(startTime - performance.now()); if (sleepTime < 0) sleepTime = 0;
  setTimeout(mainLoop, sleepTime);
}
setTimeout(mainLoop, 0);
