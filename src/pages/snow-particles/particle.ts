export class Particle {
  x: number;
  y: number;
  radius: number;
  vy: number;
  acc: number;

  constructor({
    x,
    y,
    radius,
    vy,
    acc,
  }: {
    x: number;
    y: number;
    radius: number;
    vy: number;
    acc: number;
  }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vy = vy;
    this.acc = acc;
  }

  update = (): void => {
    this.vy *= this.acc;
    this.y += this.vy;
  };

  draw = (ctx: CanvasRenderingContext2D): void => {
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, (Math.PI / 180) * 360);
    ctx.fillStyle = "skyblue";
    ctx.fill();
    ctx.closePath();
  };
}
