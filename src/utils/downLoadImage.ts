import axios from "axios";
import fs from "fs";

export const downLoadImage = async (url: string, fileName: string) => {
  const writer = fs.createWriteStream(fileName);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise<void>((resolve, reject) => {
    writer.on("finish", () => resolve());
    writer.on("error", reject);
  });
};
