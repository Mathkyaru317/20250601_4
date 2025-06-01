let video;
let handpose;
let predictions = [];
let beats = [];
let beatIndex = 0;
let beatInterval = 600; // 根據音樂節奏調整
let lastBeatTime = 0;
let assistLineY = 0;

function setup() {
  createCanvas(800, 600);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", results => {
    predictions = results;
  });

  // 產生鼓點資料
  for (let i = 0; i < 20; i++) {
    beats.push({ y: -i * 120, color: color(0, 120, 255), hit: false });
  }
}

function modelReady() {
  console.log("Handpose model loaded!");
}

function draw() {
  // 半透明灰色背景
  background(60, 60, 60, 180);

  // 花邊裝飾
  drawDecorations();

  // 輔助白線
  stroke(255, 180);
  strokeWeight(2);
  assistLineY = (millis() % beatInterval) / beatInterval * height;
  line(0, assistLineY, width, assistLineY);

  // 鼓點
  for (let i = 0; i < beats.length; i++) {
    let beat = beats[i];
    beat.y += 2; // 鼓點下落速度
    fill(beat.color);
    ellipse(width / 2, beat.y, 60, 60);

    // 判定區域
    if (!beat.hit && abs(beat.y - assistLineY) < 30) {
      if (detectFist(predictions)) {
        beat.hit = true;
        beat.color = color(0, 255, 0); // 擊中變色
      }
    }
  }

  // 畫出手部關鍵點
  drawHands();
}

function drawDecorations() {
  noFill();
  stroke(200, 200, 255, 80);
  strokeWeight(4);
  for (let i = 0; i < 10; i++) {
    ellipse(width / 2, height / 2, 700 - i * 40, 500 - i * 30);
  }
}

function drawHands() {
  for (let i = 0; i < predictions.length; i++) {
    let hand = predictions[i];
    for (let j = 0; j < hand.landmarks.length; j++) {
      let [x, y] = hand.landmarks[j];
      fill(255, 0, 0);
      noStroke();
      ellipse(x, y, 10, 10);
    }
  }
}

// 偵測是否握拳
function detectFist(preds) {
  if (preds.length === 0) return false;
  let hand = preds[0];
  // 以拇指與食指距離判斷（簡化版）
  let thumb = hand.landmarks[4];
  let index = hand.landmarks[8];
  let d = dist(thumb[0], thumb[1], index[0], index[1]);
  return d < 40;
}
