const axios = require("axios");
const fs = require("fs");
const path = require("path");

const downloadImage = async (url, savePath) => {
  const response = await axios({ url, responseType: "stream" });
  const writer = fs.createWriteStream(savePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

module.exports = { downloadImage };
