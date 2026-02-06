const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const content = document.getElementById("content");
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const finalScene = document.getElementById("finalScene");
const photoEl = document.getElementById("photo");

let noClicks = 0;
let fireworksStarted = false;

/* ---------- CANVAS ---------- */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* ---------- NO BUTTON ---------- */
function moveNoButton() {
  if (noClicks >= 8) return;
  noClicks++;

  const emojis = ["😟", "😢", "🥺", "😭", "💔"];
  noBtn.innerText =
    "No " + emojis[Math.min(noClicks - 1, emojis.length - 1)];

  const padding = 20;

  const maxX =
    window.innerWidth - noBtn.offsetWidth - padding;
  const maxY =
    window.innerHeight - noBtn.offsetHeight - padding;

  const safeX = Math.max(
    padding,
    Math.min(Math.random() * maxX, maxX)
  );
  const safeY = Math.max(
    padding,
    Math.min(Math.random() * maxY, maxY)
  );

  noBtn.style.left = safeX + "px";
  noBtn.style.top = safeY + "px";
  noBtn.style.transform = "none";

  if (noClicks === 8) {
    noBtn.innerText = "Yes 😏";
    noBtn.style.background = "#ff4f8b";
    noBtn.style.color = "white";
    noBtn.addEventListener("click", yesClicked, { once: true });
  }
}

/* Use pointer events (mobile + desktop safe) */
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

  resizeCanvas();
  startFireworks();
  showFinalScene();
}

/* ---------- FIREWORKS ---------- */
let particles = [];

function startFireworks() {
  if (fireworksStarted) return;
  fireworksStarted = true;

  function spawn() {
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 0.5) * 7,
        life: 120,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`,
      });
    }
  }

  spawn();
  setInterval(spawn, 700);

  requestAnimationFrame(animate);
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter((p) => p.life > 0);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
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
