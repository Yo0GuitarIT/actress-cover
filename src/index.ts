import fs from "fs";

import path from "path";

import dotenv from "dotenv";

import { downLoadImage } from "./utils/downLoadImage.js";

// 載入環境變數
dotenv.config();

const main = async () => {
  console.log("程式開始執行...");

  const convertedId = (process.env.ID || "")
    .toLowerCase()
    .replace("-", "")
    .replace(/([a-z]+)([0-9]+)/, (_match, p1, p2) => {
      return p1 + p2.padStart(5, "0");
    });

  const imageBaseUrl = process.env.IMAGE_BASE_URL;
  if (!imageBaseUrl) {
    console.error("錯誤：IMAGE_BASE_URL 環境變數未設定");
    process.exit(1);
  }

  const imageUrl = `${imageBaseUrl}/${convertedId}/${convertedId}pl.jpg`;

  const saveDir = "./dist";
  const imageName = `${Date.now()}.jpg`; // 隨機產生
  const savePath = path.join(saveDir, imageName);

  console.log("圖片 URL:", imageUrl);
  console.log("儲存路徑:", savePath);

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

  console.log("開始下載圖片...");

  try {
    await downLoadImage(imageUrl, savePath);
    console.log("圖片下載完成！");
  } catch (error) {
    console.error("下載失敗：", error);
    process.exit(1);
  }
};

main();
