const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const content = document.getElementById("content");
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const finalScene = document.getElementById("finalScene");
const photoEl = document.getElementById("photo");

/* AUDIO (optional) */
const fireworkSound = new Audio("fireworks.mp3");
fireworkSound.volume = 0.6;

let angle = 0;
let noClicks = 0;
let fireworksStarted = false;

const emojis = [":(", ':"(', ':")', "🥺", "😭"];

/* ---------- CANVAS ---------- */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* ---------- NO BUTTON (CIRCLE MOTION) ---------- */
function moveNoButtonCircle() {
  if (noClicks >= 8) return;
  noClicks++;

  const radius = 120; // circle size
  angle += Math.PI / 4; // move around circle

  const centerX = content.offsetWidth / 2;
  const centerY = 140; // around question text

  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  noBtn.innerText = "No " + emojis[noClicks % emojis.length];
  noBtn.style.transition = "left 0.8s ease, top 0.8s ease";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  if (noClicks === 8) {
    noBtn.innerText = "Yes 😏";
    noBtn.style.background = "#ff4f8b";
    noBtn.style.color = "white";
    noBtn.addEventListener("click", yesClicked, { once: true });
  }
}

noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoButtonCircle();
});

yesBtn.addEventListener("click", yesClicked);

/* ---------- YES CLICK ---------- */
function yesClicked() {
  document.body.style.background = "black";
  content.style.display = "none";

  canvas.style.display = "block";
  canvas.style.zIndex = "5";

  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fireworkSound.currentTime = 0;
  fireworkSound.play().catch(() => {});

  startHeartFireworks();
  showFinalScene();
}

/* ---------- HEART FIREWORKS ---------- */
let particles = [];

function heartShape(t) {
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

  for (let i = 0; i < 120; i++) {
    const t = Math.random() * Math.PI * 2;
    const p = heartShape(t);

    particles.push({
      x: cx,
      y: cy,
      vx: p.x * 0.12,
      vy: -p.y * 0.12,
      life: 120,
      color: `hsl(${330 + Math.random() * 30}, 100%, 65%)`,
    });
  }
}

function startHeartFireworks() {
  if (fireworksStarted) return;
  fireworksStarted = true;

  spawnHeart();
  setInterval(spawnHeart, 1000);
  requestAnimationFrame(animate);
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter((p) => p.life > 0);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.03;
    p.life--;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
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

