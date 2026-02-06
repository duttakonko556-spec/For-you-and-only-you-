const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const content = document.getElementById("content");
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const finalScene = document.getElementById("finalScene");
const photoEl = document.getElementById("photo");

/* AUDIO */
const fireworkSound = new Audio("fireworks.mp3");
fireworkSound.volume = 0.6;

let noClicks = 0;
let fireworksStarted = false;

/* ---------- CANVAS ---------- */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* ---------- NO BUTTON (SLOW + NEARBY) ---------- */
function moveNoButton() {
  if (noClicks >= 8) return;
  noClicks++;

  const emojis = ["😟", "😢", "🥺", "😭", "💔"];
  noBtn.innerText =
    "No " + emojis[Math.min(noClicks - 1, emojis.length - 1)];

  const padding = 20;

  const currentX = noBtn.offsetLeft;
  const currentY = noBtn.offsetTop;

  // small movement radius (nearby)
  const deltaX = (Math.random() - 0.5) * 120;
  const deltaY = (Math.random() - 0.5) * 120;

  const maxX = window.innerWidth - noBtn.offsetWidth - padding;
  const maxY = window.innerHeight - noBtn.offsetHeight - padding;

  const nextX = Math.min(
    maxX,
    Math.max(padding, currentX + deltaX)
  );
  const nextY = Math.min(
    maxY,
    Math.max(padding, currentY + deltaY)
  );

  noBtn.style.transition = "left 0.6s ease, top 0.6s ease";
  noBtn.style.left = nextX + "px";
  noBtn.style.top = nextY + "px";
  noBtn.style.transform = "none";

  if (noClicks === 8) {
    noBtn.innerText = "Yes 😏";
    noBtn.style.background = "#ff4f8b";
    noBtn.style.color = "white";
    noBtn.addEventListener("click", yesClicked, { once: true });
  }
}

/* Pointer-safe */
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoButton();
});

yesBtn.addEventListener("click", yesClicked);

/* ---------- YES CLICK ---------- */
function yesClicked() {
  document.body.style.background = "black";
  content.style.display = "none";
  canvas.style.display = "block";

  fireworkSound.currentTime = 0;
  fireworkSound.play().catch(() => {});

  resizeCanvas();
  startFireworks();
  showFinalScene();
}

/* ---------- FIREWORKS ---------- */
let particles = [];

function startFireworks() {
  if (fireworksStarted) return;
  fireworksStarted = true;

  function spawnFirework() {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height * 0.6;

    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;

      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 120,
        color: `hsl(${Math.random() * 360},100%,60%)`,
      });
    }
  }

  spawnFirework();
  setInterval(spawnFirework, 900);

  requestAnimationFrame(animate);
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter((p) => p.life > 0);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04; // gravity
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
  let index = 0;

  setTimeout(function next() {
    if (index >= photos.length) return;

    photoEl.style.opacity = "0";

    setTimeout(() => {
      photoEl.src = photos[index];
      photoEl.style.opacity = "1";
      index++;
    }, 600);

    setTimeout(next, 2400);
  }, 1200);
}

