const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const content = document.getElementById("content");
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const finalScene = document.getElementById("finalScene");
const photoEl = document.getElementById("photo");

let noClicks = 0;
let fireworksStarted = false;

/* NO BUTTON CHAOS */
function moveNoButton() {
  if (noClicks >= 8) return;

  noClicks++;

  const sadEmojis = ["😟", "😢", "🥺", "😭", "💔"];
  noBtn.innerText = "No " + sadEmojis[Math.min(noClicks - 1, sadEmojis.length - 1)];

  noBtn.style.transition = `all ${Math.max(0.05, 0.3 - noClicks * 0.03)}s`;

  const padding = 20;
  const maxX = window.innerWidth - noBtn.offsetWidth - padding;
  const maxY = window.innerHeight - noBtn.offsetHeight - padding;

  noBtn.style.left = Math.random() * maxX + "px";
  noBtn.style.top = Math.random() * maxY + "px";

  if (noClicks >= 8) {
    noBtn.innerText = "Yes 😏";
    noBtn.style.background = "#ff4f8b";
    noBtn.style.color = "white";
    noBtn.onclick = yesClicked;
  }
}

function fakeNo(e) {
  e.preventDefault();
}

/* EVENTS */
noBtn.addEventListener("mouseover", moveNoButton);
noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
});
noBtn.addEventListener("click", fakeNo);

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
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

/* PHOTO SEQUENCE */
const photos = [
  "./photo1.jpg",
  "./photo2.jpg",
  "./photo3.jpg",
  "./photo4.jpg"
];

function showFinalScene() {
  finalScene.style.display = "block";
  let index = 0;

  setTimeout(showNext, 1500);

  function showNext() {
    if (index >= photos.length) return;

    photoEl.style.opacity = "0";

    setTimeout(() => {
      photoEl.src = photos[index];
      photoEl.style.opacity = "1";
      index++;
    }, 800);

    setTimeout(showNext, 2600);
  }
}
