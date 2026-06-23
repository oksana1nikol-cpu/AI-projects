const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 450;
const bgMusic = new Audio(
  "https://marvellous-brown-ttr9q2e9i2.edgeone.app/Punchy%20Polygons%20(1).mp3"
);

bgMusic.loop = true;
bgMusic.volume = 0.5;

// browsers require user interaction first
window.addEventListener("click", () => {
  bgMusic.play();
}, { once: true });
// SAFE IMAGE LOADING
function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

// HERO + BOSS
const heroImg = loadImage("https://i.postimg.cc/0QNPqtMy/ket-Lr-1-removebg-preview.png");
const bossImg = loadImage("https://i.postimg.cc/2y8wGZKs/XPLYn-1-removebg-preview.png");

// ENEMY IMAGES 👾
const enemyImgs = [
  loadImage("https://i.postimg.cc/2y8wGZKs/XPLYn-1-removebg-preview.png"),
  loadImage("https://i.postimg.cc/2y8wGZKs/XPLYn-1-removebg-preview.png"),
  loadImage("https://i.postimg.cc/2y8wGZKs/XPLYn-1-removebg-preview.png")
];

// BACKGROUNDS
const backgrounds = [
  loadImage("https://i.postimg.cc/mZztq113/Chat-GPT-Image-27-apr-2026-g-20-30-53.png"),
  loadImage("https://i.postimg.cc/bvVwVqzL/Chat-GPT-Image-27-apr-2026-g-20-34-02.png"),
  loadImage("https://i.postimg.cc/vTf8m957/Chat-GPT-Image-11-maa-2026-g-20-02-54.png"),
  loadImage("https://i.postimg.cc/PrnrR3kB/Chat-GPT-Image-11-maa-2026-g-20-03-11.png"),
  loadImage("https://i.postimg.cc/RV1V57SR/o4ytc.jpg")
];


// PLAYER
const player = {
  x: 50,
  y: 300,
  w: 40,
  h: 40,
  dx: 0,
  dy: 0,
  speed: 4,
  jump: -11,
  onGround: false,
  lives: 5,
  score: 0
};

const gravity = 0.5;
let currentLevel = 0;

// INPUT
const keys = {};
addEventListener("keydown", e => keys[e.code] = true);
addEventListener("keyup", e => keys[e.code] = false);

// LEVELS
const levels = [

  // LEVEL 1
  {
    platforms: [
      {x:0,y:400,w:900,h:50},
      {x:150,y:320,w:120,h:20},
      {x:320,y:280,w:120,h:20},
      {x:500,y:240,w:120,h:20}
    ],

    enemies: [],

    bones: [
      {x:180,y:280},
      {x:520,y:200}
    ]
  },

  // LEVEL 2
  {
    platforms: [
      {x:0,y:400,w:900,h:50},
      {x:200,y:330,w:100,h:20},
      {x:350,y:280,w:100,h:20},
      {x:550,y:240,w:100,h:20},
      {x:700,y:200,w:80,h:20}
    ],

    enemies: [
      {x:400,y:360,w:40,h:40,dx:2,img:0}
    ],

    bones: [
      {x:360,y:240}
    ]
  },

  // LEVEL 3
  {
    platforms: [
      {x:0,y:400,w:900,h:50},
      {x:120,y:320,w:80,h:20},
      {x:260,y:280,w:80,h:20},
      {x:400,y:240,w:80,h:20},
      {x:540,y:200,w:80,h:20},
      {x:700,y:160,w:80,h:20}
    ],

    enemies: [
      {x:300,y:360,w:40,h:40,dx:3,img:1},
      {x:600,y:360,w:40,h:40,dx:3,img:2}
    ],

    bones: [
      {x:710,y:120}
    ]
  },

  // LEVEL 4
  {
    platforms: [
      {x:0,y:400,w:900,h:50},
      {x:180,y:330,w:70,h:20},
      {x:320,y:280,w:70,h:20},
      {x:460,y:230,w:70,h:20},
      {x:600,y:180,w:70,h:20},
      {x:750,y:140,w:60,h:20}
    ],

    enemies: [
      {x:250,y:360,w:40,h:40,dx:4,img:0},
      {x:500,y:360,w:40,h:40,dx:4,img:1}
    ],

    bones: [
      {x:760,y:100}
    ]
  },

  // LEVEL 5 (BOSS)
  {
    platforms: [
      {x:0,y:400,w:900,h:50},
      {x:300,y:300,w:120,h:20},
      {x:600,y:250,w:120,h:20}
    ],

    boss: {
      x:650,
      y:300,
      w:100,
      h:100,
      dx:2,
      health:6
    }
  }
];

// COLLISION
function collide(a,b){
  return (
    a.x < b.x+b.w &&
    a.x+a.w > b.x &&
    a.y < b.y+b.h &&
    a.y+a.h > b.y
  );
}

// RESET
function resetPlayer(){
  player.x = 50;
  player.y = 300;
  player.dy = 0;
}

// LOSE LIFE
function loseLife(){
  player.lives--;

  document.getElementById("lives").textContent = player.lives;

  if(player.lives <= 0){
    alert("Game Over!");

    player.lives = 5;
    player.score = 0;
    currentLevel = 0;

    document.getElementById("level").textContent = 1;
    document.getElementById("score").textContent = 0;
  }

  resetPlayer();
}

// INPUT
function input(){

  player.dx = 0;

  if(keys["ArrowLeft"]) player.dx = -player.speed;
  if(keys["ArrowRight"]) player.dx = player.speed;

  if((keys["ArrowUp"] || keys["Space"]) && player.onGround){
    player.dy = player.jump;
    player.onGround = false;
  }
}

// UPDATE
function update(){

  input();

  player.dy += gravity;

  player.x += player.dx;
  player.y += player.dy;

  player.onGround = false;

  let level = levels[currentLevel];

  // FALL
  if(player.y > canvas.height){
    loseLife();
  }

  // PLATFORMS
  level.platforms.forEach(p => {

    if(collide(player,p) && player.dy > 0){

      player.y = p.y - player.h;
      player.dy = 0;
      player.onGround = true;
    }

  });

  // ENEMIES
  if(level.enemies){

    level.enemies.forEach(e => {

      e.x += e.dx;

      if(e.x < 0 || e.x > canvas.width - e.w){
        e.dx *= -1;
      }

      if(collide(player,e)){
        loseLife();
      }

    });

  }

  // BONES
  if(level.bones){

    level.bones.forEach((b,i)=>{

      if(collide(player,{x:b.x,y:b.y,w:20,h:20})){

        player.score++;

        document.getElementById("score").textContent = player.score;

        level.bones.splice(i,1);
      }

    });

  }

  // BOSS
  if(level.boss){

    let b = level.boss;

    b.x += b.dx;

    if(b.x < 400 || b.x > 800){
      b.dx *= -1;
    }

    if(collide(player,b)){
      loseLife();
    }

    if(player.dy > 0 && collide(player,b)){

      b.health--;

      player.dy = -8;

      if(b.health <= 0){

        alert("🎉 You Win!");

        player.lives = 5;
        currentLevel = 0;
      }

    }

  }

  // NEXT LEVEL
  if(player.x > canvas.width - 20 && currentLevel < 4){

    currentLevel++;

    document.getElementById("level").textContent = currentLevel + 1;

    resetPlayer();
  }

}

// DRAW
function draw(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  // BACKGROUND
  let bg = backgrounds[currentLevel];

  if(bg.complete && bg.naturalWidth !== 0){

    ctx.drawImage(bg,0,0,canvas.width,canvas.height);

  } else {

    const colors = [
      "#87ceeb",
      "#f4a460",
      "#b0e0e6",
      "#2f4f4f",
      "#8b0000"
    ];

    ctx.fillStyle = colors[currentLevel];
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  let level = levels[currentLevel];

  // PLATFORMS
  ctx.fillStyle = "green";

  level.platforms.forEach(p => {
    ctx.fillRect(p.x,p.y,p.w,p.h);
  });

  // BONES
  if(level.bones){

    ctx.fillStyle = "yellow";

    level.bones.forEach(b => {
      ctx.fillRect(b.x,b.y,20,20);
    });

  }

  // ENEMIES WITH IMAGES 👾
  if(level.enemies){

    level.enemies.forEach(e => {

      const enemyImg = enemyImgs[e.img];

      if(enemyImg.complete && enemyImg.naturalWidth !== 0){

        ctx.drawImage(
          enemyImg,
          e.x,
          e.y,
          e.w,
          e.h
        );

      } else {

        ctx.fillStyle = "red";
        ctx.fillRect(e.x,e.y,e.w,e.h);

      }

    });

  }

  // BOSS
  if(level.boss){

    let b = level.boss;

    if(bossImg.complete && bossImg.naturalWidth !== 0){

      ctx.drawImage(
        bossImg,
        b.x,
        b.y,
        b.w,
        b.h
      );

    } else {

      ctx.fillStyle = "purple";
      ctx.fillRect(b.x,b.y,b.w,b.h);

    }

  }

  // PLAYER
  if(heroImg.complete && heroImg.naturalWidth !== 0){

    ctx.drawImage(
      heroImg,
      player.x,
      player.y,
      player.w,
      player.h
    );

  } else {

    ctx.fillStyle = "brown";
    ctx.fillRect(player.x,player.y,player.w,player.h);

  }

}

// LOOP
function loop(){

  update();
  draw();

  requestAnimationFrame(loop);
}

loop();
