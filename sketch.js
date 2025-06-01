let beats = [
  { time: 1.0, x: 200 },
  { time: 1.5, x: 600 },
  { time: 2.0, x: 200 },
  { time: 2.5, x: 600 },
  // ...可依音樂節奏繼續增加
];
let startTime;

function setup() {
  createCanvas(800, 600);
  startTime = millis();
}

function draw() {
  // 灰色半透明背景
  background(60, 60, 60, 180);

  // 加入花邊裝飾（例如四角圓點與漸層邊框）
  noStroke();
  for (let i = 0; i < 4; i++) {
    let x = i % 2 === 0 ? 30 : width - 30;
    let y = i < 2 ? 30 : height - 30;
    fill(180 + 40 * sin(frameCount * 0.02 + i), 180, 255, 180);
    ellipse(x, y, 40 + 10 * sin(frameCount * 0.03 + i), 40 + 10 * sin(frameCount * 0.03 + i));
  }

  // 漸層邊框
  for (let t = 0; t < 10; t++) {
    let alpha = map(t, 0, 9, 80, 0);
    noFill();
    stroke(180, 180, 255, alpha);
    strokeWeight(8 - t * 0.7);
    rect(10 + t * 2, 10 + t * 2, width - 20 - t * 4, height - 20 - t * 4, 30);
  }

  // 輔助白線（假設有 beats 陣列和 startTime 變數）
  if (typeof beats !== "undefined" && typeof startTime !== "undefined") {
    let now = (millis() - startTime) / 1000;
    for (let beat of beats) {
      // 計算鼓點目前 y 位置（需與鼓點落下速度一致）
      let y = (now - beat.time + 1) * 300;
      stroke(255, 180);
      strokeWeight(2);
      line(beat.x - 35, y, beat.x + 35, y);
    }
  }
}