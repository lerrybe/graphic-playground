const canvas = document.getElementById(
  "text-outline-canvas"
) as HTMLCanvasElement;

const ctx = canvas.getContext("2d");
const DPR: number = window.devicePixelRatio || 1;
const SCALE_FACTOR = 5; // 해상도를 높이기 위한 스케일 팩터
const ADJUSTED_DPR = DPR * SCALE_FACTOR;
let canvasWidth: number = 1000;
let canvasHeight: number = 500;

const init = (): void => {
  if (!ctx) return;

  canvasWidth = 1000;
  canvasHeight = 500;
  const reflectedDPRWidth = canvasWidth * ADJUSTED_DPR;
  const reflectedDPRHeight = canvasHeight * ADJUSTED_DPR;

  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  canvas.width = reflectedDPRWidth;
  canvas.height = reflectedDPRHeight;
  ctx.setTransform(ADJUSTED_DPR, 0, 0, ADJUSTED_DPR, 0, 0);
};

const render = () => {
  if (ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 캔버스 초기화
    ctx.font = "800 100px Roboto"; // 글꼴과 크기를 설정합니다.
    ctx.fillStyle = "#FFFFFF"; // 글자 색상을 설정합니다.
    const text = "HELLO, THIS IS YEJI.";
    // 텍스트의 너비와 높이를 측정합니다.
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight =
      textMetrics.actualBoundingBoxAscent +
      textMetrics.actualBoundingBoxDescent;
    // 캔버스 중앙에 텍스트를 배치합니다.
    const x = (canvasWidth - textWidth) / 2;
    const y = (canvasHeight + textHeight) / 2;
    ctx.fillText(text, x, y);
  }
};

// 페이지 로드 시 초기화 및 렌더링 시작
window.addEventListener("load", () => {
  init();
  render();
});

// 창 크기 변경 시 캔버스 및 파티클 재설정
window.addEventListener("resize", () => {
  init();
  render(); // 리사이즈 시에도 다시 렌더링
});
