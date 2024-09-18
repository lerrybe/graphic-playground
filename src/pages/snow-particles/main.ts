import { Particle } from "./particle";
import dat from "dat.gui";

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

// 전역 설정 객체: 파티클 및 효과에 대한 설정 값을 저장
const settings = {
  totalCount: 50, // 파티클의 총 개수 (Total number of particles)
  acc: 1.02, // 파티클의 가속도 (Acceleration of particles)

  /**
   * @desc
   *
   * 높은 alphaChannel 값:
   * 파티클의 투명도를 낮추어 더 선명하고 뚜렷하게 보임, 파티클들이 서로 겹칠 때 합쳐지는 효과가 강화됨
   *
   * alphaOffset 조절:
   * 투명도를 미세하게 조정하여 구이 효과의 강도를 세밀하게 조절할 수 있음
   * 음수 값을 사용하면 투명도를 증가시켜 파티클이 더 부드럽게 합쳐짐
   * 양수 값을 사용하면 투명도를 감소시켜 파티클의 개별성이 강조됨
   */

  blurValue: 20, // 블러 효과의 정도 (Blur effect intensity)
  alphaChannel: 40, // 알파 채널 값 (Alpha channel value for transparency)
  alphaOffset: -23, // 알파 오프셋 값 (Alpha offset value for transparency adjustment)
};

const initializeControls = () => {
  const gui = new dat.GUI();

  // 파티클 수 및 가속도 조절을 위한 폴더 생성
  const numericOfParticles = gui.addFolder("Number of Particles");
  numericOfParticles.open();

  // 파티클의 총 개수를 조절하는 슬라이더
  numericOfParticles
    .add(settings, "totalCount", 1, 200)
    .step(1)
    .onChange(() => init()); // 값이 변경되면 파티클을 재생성하기 위해 init() 호출

  // 파티클의 가속도를 조절하는 슬라이더
  numericOfParticles
    .add(settings, "acc", 1, 1.1)
    .step(0.01)
    .onChange(() => init());

  // 파티클의 구이(Gooey) 효과를 조절하기 위한 폴더 생성
  const effectsOfParticles = gui.addFolder("Gooey Effects Of Particles");
  effectsOfParticles.open();

  // SVG 필터 요소들을 선택하여 변수에 저장

  /**
   * @desc
   *
   * @feGaussianBlur
   * 이미지를 흐리게 만들어 파티클 간의 경계를 흐릿하게 함
   * @feColorMatrix
   * 색상 및 투명도를 조절하여 파티클의 시각적 특성을 변경, 특히 알파 채널의 조정은 투명도와 구이 효과의 강도를 직접적으로 제어함
   */

  const feGaussianBlur = document.querySelector("feGaussianBlur")!;
  const feColorMatrix = document.querySelector("feColorMatrix")!;

  // 블러 효과의 강도를 조절하는 슬라이더
  effectsOfParticles.add(settings, "blurValue", 0, 100).onChange(v => {
    feGaussianBlur.setAttribute("stdDeviation", v.toString());
  });

  // 알파 채널 값을 조절하여 투명도를 변경하는 슬라이더
  effectsOfParticles.add(settings, "alphaChannel", 1, 200).onChange(v => {
    feColorMatrix.setAttribute(
      "values",
      `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${v} ${settings.alphaOffset}`
    );
  });

  // 알파 오프셋 값을 조절하여 투명도 보정하는 슬라이더
  effectsOfParticles.add(settings, "alphaOffset", -40, 40).onChange(v => {
    feColorMatrix.setAttribute(
      "values",
      `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${settings.alphaChannel} ${v}`
    );
  });
};

// 최소값과 최대값 사이에서 랜덤한 숫자를 생성하는 함수
const randomNumBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// 파티클을 생성하는 함수
const createParticle = (): Particle => {
  const x = randomNumBetween(0, canvasWidth);
  const y = randomNumBetween(0, canvasHeight);
  const radius = randomNumBetween(
    (1 * canvasWidth) / 100,
    (5 * canvasWidth) / 100
  );
  const vy = randomNumBetween(1, 5);
  const acc = settings.acc; // 설정된 가속도 값 적용

  return new Particle({ x, y, radius, vy, acc });
};

// 초기화 함수: 캔버스 설정 및 파티클 생성
const init = (): void => {
  if (!ctx) return;

  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  const reflectedDPRWidth = canvasWidth * DPR;
  const reflectedDPRHeight = canvasHeight * DPR;

  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  canvas.width = reflectedDPRWidth;
  canvas.height = reflectedDPRHeight;
  ctx.scale(DPR, DPR);

  particles = [];
  const TOTAL = settings.totalCount; // 설정된 파티클 수 사용

  for (let i = 0; i < TOTAL; i++) {
    particles.push(createParticle());
  }
};

// 렌더링 함수: 파티클을 업데이트하고 그림
const render = (): void => {
  if (!ctx) return;

  requestAnimationFrame(render);
  time.now = Date.now();
  time.delta = time.now - time.then;

  if (time.delta < INTERVAL) return;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  particles.forEach(particle => {
    particle.acc = settings.acc; // 가속도 업데이트
    particle.update();
    particle.draw(ctx);

    // 파티클이 화면 아래로 나가면 재설정
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

  time.then = time.now - (time.delta % INTERVAL);
};

// 페이지 로드 시 초기화 및 렌더링 시작
window.addEventListener("load", () => {
  initializeControls(); // GUI 컨트롤 초기화
  init();
  render();
});

// 창 크기 변경 시 캔버스 및 파티클 재설정
window.addEventListener("resize", () => {
  init();
});
