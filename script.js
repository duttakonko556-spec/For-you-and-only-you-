const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const content = document.getElementById("content");
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const finalScene = document.getElementById("finalScene");
const photoEl = document.getElementById("photo");

/* ---------- CANVAS SETUP ---------- */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* ---------- NO BUTTON (CIRCULAR MOTION) ---------- */
let angle = 0;
let noClicks = 0;

const emojiCycle = [":(", ':"(', ':")', "🥺", "😭"];

function moveNoInCircle() {
  if (noClicks >= 8) return;
  noClicks++;

  const radius = 120;
  angle += Math.PI / 4;

  const centerX = content.offsetWidth / 2;
  const centerY = 120;

  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  noBtn.innerText = "No " + emojiCycle[noClicks % emojiCycle.length];
  noBtn.style.transition = "left 0.7s ease, top 0.7s ease";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
  noBtn.style.transform = "none";

  if (noClicks === 8) {
    noBtn.innerText = "Yes 😏";
    noBtn.style.background = "#ff4f8b";
    noBtn.style.color = "white";
    noBtn.addEventListener("click", yesClicked, { once: true });
  }
}

noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoInCircle();
});

yesBtn.addEventListener("click", yesClicked);

/* ---------- YES CLICK ---------- */
function yesClicked() {
  document.body.style.background = "black";
  content.style.display = "none";

  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  startHeartFireworks();
  showFinalScene();
}

/* ---------- HEART FIREWORKS (BULLETPROOF) ---------- */
let particles = [];
let fireworksStarted = false;

function heartFormula(t) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y:
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t),
  };
}

function spawnHeart() {
  const cx = Math.random() * canvas.width;
  const cy = Math.random() * canvas.height * 0.6;

  for (let i = 0; i < 160; i++) {
    const t = Math.random() * Math.PI * 2;
    const h = heartFormula(t);

    particles.push({
      x: cx,
      y: cy,
      vx: h.x * 0.35,
      vy: -h.y * 0.35,
      life: 160,
      size: 4,
      color: `hsl(${330 + Math.random() * 30}, 100%, 65%)`,
    });
  }
}

function startHeartFireworks() {
  if (fireworksStarted) return;
  fireworksStarted = true;

  /* visible starter spark (forces render) */
  particles.push({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 0,
    vy: 0,
    life: 200,
    size: 6,
    color: "hotpink",
  });

  spawnHeart();
  setInterval(spawnHeart, 900);
  requestAnimationFrame(animate);
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter((p) => p.life > 0);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.02;
    p.life--;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

/* ---------- PHOTOS ---------- */
const photos = [
  "photo1.jpeg",
  "photo2.jpeg",
  "photo3.jpeg",
  "photo4.jpeg",
];

function showFinalScene() {
  finalScene.style.display = "block";
  let i = 0;

  setTimeout(function next() {
    if (i >= photos.length) return;

    photoEl.style.opacity = "0";
    setTimeout(() => {
      photoEl.src = photos[i];
      photoEl.style.opacity = "1";
      i++;
    }, 600);

    setTimeout(next, 2400);
  }, 1200);
}

