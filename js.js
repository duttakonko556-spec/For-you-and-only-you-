const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const content = document.getElementById("content");
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const finalScene = document.getElementById("finalScene");
const photoEl = document.getElementById("photo");

let noClicks = 0;
let fireworksStarted = false;

/* CANVAS RESIZE */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* NO BUTTON — GITHUB PAGES SAFE */
function moveNoButton() {
  if (noClicks >= 8) return;
  noClicks++;

  const emojis = ["😟", "😢", "🥺", "😭", "💔"];
  noBtn.innerText = "No " + emojis[Math.min(noClicks - 1, emojis.length - 1)];

  const padding = 20;
  const maxX = window.innerWidth - noBtn.offsetWidth - padding;
  const maxY = window.innerHeight - noBtn.offsetHeight - padding;

  noBtn.style.left = Math.max(10, Math.random() * maxX) + "px";
  noBtn.style.top = Math.max(10, Math.random() * maxY) + "px";
  noBtn.style.transform = "none";

  if (noClicks === 8) {
    noBtn.innerText = "Yes 😏";
    noBtn.style.background = "#ff4f8b";
    noBtn.style.color = "white";
    noBtn.addEventListener("click", yesClicked, { once: true });
  }
}

/* USE POINTER EVENTS — NOT mouseover */
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoButton();
});

yesBtn.addEventListener("click", yesClicked);

/* YES CLICK */
function yesClicked() {
  document.body.style.background = "black";
  content.style.display = "none";
  canvas.style.display = "block";
  startFireworks();
  showFinalScene();
}

/* FIREWORKS */
let particles = [];

function startFireworks() {
  if (fireworksStarted) return;
  fireworksStarted = true;

  setInterval(() => {
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 100,
        color: `hsl(${Math.random() * 360},100%,60%)`
      });
    }
  }, 600);

  animate();
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    if (p.life <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animate);
}

/* PHOTOS */
const photos = [
  "./photo1.jpg",
  "./photo2.jpg",
  "./photo3.jpg",
  "./photo4.jpg"
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
