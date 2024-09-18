import { Particle } from "./particle";

const canvas = document.getElementById("snow-particles") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const DPR: number = window.devicePixelRatio;
const FPS: number = 60;
const INTERVAL: number = 1000 / FPS;

const time: {
  now: number;
  delta: number;
  then: number;
} = {
  now: 0,
  delta: 0,
  then: Date.now(),
};

let canvasWidth: number = window.innerWidth;
let canvasHeight: number = window.innerHeight;
let particles: Particle[] = [];

const randomNumBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const createParticle = (): Particle => {
  const x = randomNumBetween(0, canvasWidth);
  const y = randomNumBetween(0, canvasHeight);
  const radius = randomNumBetween(
    (1 * canvasWidth) / 100,
    (5 * canvasWidth) / 100
  );
  const vy = randomNumBetween(1, 5);
  const acc = 1.02;

  return new Particle({ x, y, radius, vy, acc });
};

const init = (): void => {
  if (!ctx) return;

  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  const reflectDPRWidth = canvasWidth * DPR;
  const reflectDPRHeight = canvasHeight * DPR;

  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  canvas.width = reflectDPRWidth;
  canvas.height = reflectDPRHeight;
  ctx.scale(DPR, DPR);

  particles = [];
  const TOTAL = canvasWidth / 20;

  for (let i = 0; i < TOTAL; i++) {
    particles.push(createParticle());
  }
};

const render = (): void => {
  if (!ctx) return;

  requestAnimationFrame(render);
  time.now = Date.now();
  time.delta = time.now - time.then;

  if (time.delta < INTERVAL) return;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  particles.forEach(particle => {
    particle.update();
    particle.draw(ctx);

    if (particle.y - particle.radius > canvasHeight) {
      particle.x = randomNumBetween(0, canvasWidth);
      particle.y = -particle.radius;

      particle.radius = randomNumBetween(
        (1 * canvasWidth) / 100,
        (5 * canvasWidth) / 100
      );
      particle.vy = randomNumBetween(1, 5);
    }
  });
};

window.addEventListener("load", () => {
  init();
  render();
});

window.addEventListener("resize", () => {
  init();
});
