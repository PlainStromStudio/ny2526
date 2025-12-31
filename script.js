var click = false;
var timer = 1;

window.addEventListener("click", (e) => {
  if (!click) {
    document.querySelector(".sun").classList.add("animated");
    document.querySelector(".moon").classList.add("animated");
    document.querySelector(".moon-cont").classList.add("animated");
    document.querySelector(".cont").classList.add("animated");
    document.querySelector(".ground").classList.add("animated");
    document.querySelector("#text2").remove();
    document.querySelector("#text3").remove();
    let d = document.getElementsByClassName("message");
    for (const element of d) {
      element.classList.add("animated");
    }
    document.getElementById("bgMusic").play();
    timer = 1500;
    click = true;
  }
  fireworks(e);
});

function countdown() {
  if (click) timer--;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLightRgbColor() {
  const color = [
    "rgba(255, 0, 0, 1)",
    "rgba(255, 251, 0, 1)",
    "rgba(0, 247, 255, 1)",
    "rgba(30, 255, 0, 1)",
    "rgba(17, 0, 255, 1)",
    "rgba(255, 0, 234, 1)",
    "rgba(255, 0, 98, 1)",
  ];
  const c = Math.floor(Math.random() * color.length);

  return color[c];
}

function fireworks(e) {
  if (timer <= 0) {
    const fw = document.getElementById("fw-cont");
    for (let i = 0; i < getRandomInt(1, 3); i++) {
      const fire = document.createElement("div");
      fire.classList.add("fw-trail");

      fire.style.setProperty("--vely", 4 - Math.random() * 1.5);
      fire.style.setProperty("--velx", 0.01 - Math.random() * 0.02);

      fire.style.left = Math.random() * 100 + "vw";
      fire.style.bottom = 0;

      fire.style.background = generateLightRgbColor();
      fire.style.borderRadius = "50%";

      fw.appendChild(fire);
      const soundTemplate = document.getElementById("whistle");
      const newSound = soundTemplate.cloneNode();
      newSound.play();
    }
  }
}

function update() {
  let dc = document.getElementsByClassName("fw-trail");
  for (const fire of dc) {
    let currentBottom = parseFloat(fire.style.bottom) || 0;
    let currentLeft = parseFloat(fire.style.left) || 0;

    let velx = parseFloat(getComputedStyle(fire).getPropertyValue("--velx"));
    fire.style.left = currentLeft + velx + "vw";

    let vely = parseFloat(getComputedStyle(fire).getPropertyValue("--vely"));
    fire.style.bottom = currentBottom + vely + "px";
    fire.style.setProperty("--vely", vely - 0.01);

    if (vely <= 0) {
      const fw = document.getElementById("fw-cont");
      const fwExpl = getRandomInt(30, 40);
      for (let i = 0; i < fwExpl; i++) {
        const p = document.createElement("div");
        p.classList.add("fw-fire");

        // Physics properties
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 5;
        p.style.setProperty("--vx", Math.cos(angle) * speed);
        p.style.setProperty("--vy", Math.sin(angle) * speed);
        p.style.setProperty("--life", 40 + Math.random() * 60);

        // Store initial coordinates
        p.setAttribute("data-base-x", fire.style.left);
        p.setAttribute("data-base-y", fire.style.bottom);
        p.setAttribute("data-offset-x", "0");
        p.setAttribute("data-offset-y", "0");

        p.style.background = fire.style.background;
        p.style.boxShadow = `0 0 6px ${fire.style.background}`;
        fw.appendChild(p);
      }
      fire.remove();
      const soundTemplate = document.getElementById("boomSound");
      const newSound = soundTemplate.cloneNode();
      newSound.play();
    }
  }

  let particles = document.getElementsByClassName("fw-fire");
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    let life = parseFloat(p.style.getPropertyValue("--life"));
    let vx = parseFloat(p.style.getPropertyValue("--vx"));
    let vy = parseFloat(p.style.getPropertyValue("--vy"));

    // Position = Current Base (vw) + offset (px)
    let currentBaseX = p.getAttribute("data-base-x");
    let currentOffsetX = parseFloat(p.getAttribute("data-offset-x")) + vx;
    let currentOffsetY = parseFloat(p.getAttribute("data-offset-y")) + vy;

    p.style.setProperty("--vy", (vy - 0.05) * 0.95);
    p.style.setProperty("--vx", vx * 0.95);

    p.setAttribute("data-offset-x", currentOffsetX);
    p.setAttribute("data-offset-y", currentOffsetY);

    // COMBINING VW and PX
    p.style.left = `calc(${currentBaseX} + ${currentOffsetX}px)`;
    p.style.bottom = `calc(${p.getAttribute(
      "data-base-y"
    )} + ${currentOffsetY}px)`;

    p.style.opacity = life / 100;
    p.style.setProperty("--life", life - 0.5);

    if (life <= 0) p.remove();
  }
}

setInterval(countdown, 1);
setInterval(update, 1);
