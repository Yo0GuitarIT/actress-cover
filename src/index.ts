import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import readline from "readline";

import { downLoadImage } from "./utils/downLoadImage.js";

// 載入 .env 檔案
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const imageBaseUrl = process.env.IMAGE_COVER_URL;
if (!imageBaseUrl) {
  console.error("錯誤：IMAGE_COVER_URL 環境變數未設定");
  process.exit(1);
}

const askId = () => {
  return new Promise<string>((resolve) => {
    rl.question("請輸入號碼: ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
};

const main = async () => {
  console.log("程式開始執行...");
  const inputId = await askId();
  const convertedId = inputId
    .toLowerCase()
    .replace("-", "")
    .replace(/([a-z]+)([0-9]+)/, (_match, p1, p2) => {
      return p1 + p2.padStart(5, "0");
    });

  const coverImgUrl = `${imageBaseUrl}/${convertedId}/${convertedId}pl.jpg`;
  const saveDir = "./dist";

  console.log("圖片 URL:", coverImgUrl);

  // 確保資料夾存在
  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
    console.log("已建立資料夾:", saveDir);
  }

  // 清空 dist 資料夾
  const files = fs.readdirSync(saveDir);
  console.log("清空資料夾前的檔案數量:", files.length);
  files.forEach((file) => {
    fs.unlinkSync(path.join(saveDir, file));
  });

  console.log("開始下載封面圖片...");

  // 下載封面圖片
  try {
    const coverSavePath = path.join(saveDir, `${convertedId}_cover.jpg`);
    await downLoadImage(coverImgUrl, coverSavePath);
    console.log("封面圖片下載完成！");
  } catch (error) {
    console.error("封面下載失敗：", error);
    process.exit(1);
  }

  // 下載細節圖片
  console.log("開始下載細節圖片...");
  let detailIndex = 1;
  let successCount = 0;

  while (true) {
    const detailsUrl = `${imageBaseUrl}/${convertedId}/${convertedId}jp-${detailIndex}.jpg`;
    const detailSavePath = path.join(
      saveDir,
      `${convertedId}_detail-${detailIndex}.jpg`,
    );

    try {
      console.log(`正在下載第 ${detailIndex} 張細節圖片...`);
      await downLoadImage(detailsUrl, detailSavePath);
      console.log(`第 ${detailIndex} 張細節圖片下載完成！`);
      successCount++;
      detailIndex++;
    } catch (error) {
      console.log(`第 ${detailIndex} 張細節圖片不存在，停止下載`, error);
      // 刪除下載失敗時可能產生的空檔案
      if (fs.existsSync(detailSavePath)) {
        fs.unlinkSync(detailSavePath);
      }
      break;
    }
  }

  console.log(`\n下載完成！總共下載了 ${successCount} 張細節圖片`);
};

main();
