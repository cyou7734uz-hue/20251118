let spriteSheet1, spriteSheet2, spriteSheet3, spriteSheet4;
let animation1 = [], animation2 = [], animation3 = [], animation4 = [];

// 角色1 的設定
const frameWidth1 = 2353 / 18;
const frameHeight1 = 126;
const frameCountTotal1 = 18;
let currentFrame1 = 0;

// 角色2 的設定
const frameWidth2 = 478 / 7;
const frameHeight2 = 111;
const frameCountTotal2 = 7;
let currentFrame2 = 0;

// 角色3 的設定
const frameWidth3 = 622 / 11;
const frameHeight3 = 30;
const frameCountTotal3 = 11;
let currentFrame3 = 0;

// 角色4 的設定
const frameWidth4 = 1325 / 14;
const frameHeight4 = 122;
const frameCountTotal4 = 14;
let currentFrame4 = 0;

// 新增縮放比例
const scaleFactor = 1.5;

// 新增一個變數來控制動畫是否播放
let isAnimating = false;

// -- 音訊相關變數 --
let music;
let amplitude;
let lastFrameUpdateTime = 0; // 記錄上一次動畫幀更新的時間

function preload() {
  // 預先載入圖片精靈
  // 請確保路徑是正確的
  spriteSheet1 = loadImage('角色1/all.png');
  spriteSheet2 = loadImage('角色2/all.png');
  spriteSheet3 = loadImage('角色3/all.png');
  spriteSheet4 = loadImage('角色4/all.png');

  // 預先載入音樂檔案，請將 'sound/music.mp3' 換成您的檔案路徑
  music = loadSound('sound/music.mp3');
}

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // 將圖片精靈切割成個別的幀
  // 處理角色1
  for (let i = 0; i < frameCountTotal1; i++) {
    let x = i * frameWidth1;
    let img = spriteSheet1.get(x, 0, frameWidth1, frameHeight1);
    animation1.push(img);
  }

  // 處理角色2
  for (let i = 0; i < frameCountTotal2; i++) {
    let x = i * frameWidth2;
    let img = spriteSheet2.get(x, 0, frameWidth2, frameHeight2);
    animation2.push(img);
  }

  // 處理角色3
  for (let i = 0; i < frameCountTotal3; i++) {
    let x = i * frameWidth3;
    let img = spriteSheet3.get(x, 0, frameWidth3, frameHeight3);
    animation3.push(img);
  }

  // 處理角色4
  for (let i = 0; i < frameCountTotal4; i++) {
    let x = i * frameWidth4;
    let img = spriteSheet4.get(x, 0, frameWidth4, frameHeight4);
    animation4.push(img);
  }

  // 建立一個振幅分析器
  amplitude = new p5.Amplitude();
  
}

function draw() {
  // 設定背景顏色
  background('#90e0ef');

  // 計算縮放後的大小
  let scaledWidth1 = frameWidth1 * scaleFactor;
  let scaledHeight1 = frameHeight1 * scaleFactor;
  let scaledWidth2 = frameWidth2 * scaleFactor;
  let scaledHeight2 = frameHeight2 * scaleFactor;
  let scaledWidth3 = frameWidth3 * scaleFactor;
  let scaledHeight3 = frameHeight3 * scaleFactor;
  let scaledWidth4 = frameWidth4 * scaleFactor;
  let scaledHeight4 = frameHeight4 * scaleFactor;

  // 重新計算位置，讓所有角色群組置中
  const spacing = 20; // 角色間的間距
  const totalWidth = scaledWidth1 + scaledWidth2 + scaledWidth3 + scaledWidth4 + (spacing * 3);
  let startX = width / 2 - totalWidth / 2;

  // 顯示角色4 (最左邊)
  let char4X = startX;
  let char4Y = height / 2 - scaledHeight4 / 2;
  image(animation4[currentFrame4], char4X, char4Y, scaledWidth4, scaledHeight4);

  // 顯示角色3 (在角色4的右邊)
  let char3X = char4X + scaledWidth4 + spacing;
  let char3Y = height / 2 - scaledHeight3 / 2;
  image(animation3[currentFrame3], char3X, char3Y, scaledWidth3, scaledHeight3);

  // 顯示角色1 (在角色3的右邊)
  let char1X = char3X + scaledWidth3 + spacing;
  let char1Y = height / 2 - scaledHeight1 / 2;
  image(animation1[currentFrame1], char1X, char1Y, scaledWidth1, scaledHeight1);

  // 顯示角色2 (在角色1的右邊)
  let char2X = char1X + scaledWidth1 + spacing;
  let char2Y = height / 2 - scaledHeight2 / 2;
  image(animation2[currentFrame2], char2X, char2Y, scaledWidth2, scaledHeight2);

  // --- 根據音樂振幅更新動畫 ---
  if (isAnimating) {
    // 獲取當前振幅 (0 到 1)
    let level = amplitude.getLevel();
    
    // 將振幅大小映射到動畫幀的更新延遲時間 (單位：毫秒)
    // 振幅越大(level=1)，延遲越短(40ms, 約25fps)
    // 振幅越小(level=0)，延遲越長(500ms, 約2fps)
    let frameDelay = map(level, 0, 1, 500, 40);

    // 檢查是否已超過延遲時間，如果超過了就更新幀
    if (millis() - lastFrameUpdateTime > frameDelay) {
      // 更新所有角色的幀
      currentFrame1 = (currentFrame1 + 1) % frameCountTotal1;
      currentFrame2 = (currentFrame2 + 1) % frameCountTotal2;
      currentFrame3 = (currentFrame3 + 1) % frameCountTotal3;
      currentFrame4 = (currentFrame4 + 1) % frameCountTotal4;

      // 重設上次更新時間
      lastFrameUpdateTime = millis();
    }
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 當滑鼠點擊時，切換動畫的播放/暫停狀態
function mousePressed() {
  isAnimating = !isAnimating; 
  if (isAnimating) {
    if (!music.isPlaying()) {
      music.loop(); // 如果音樂沒在播放，就開始循環播放
    }
  } else {
    music.pause(); // 如果動畫暫停，音樂也暫停
  }
}
