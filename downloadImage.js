const fs = require("fs");
const https = require("https");
const path = require("path");
const puppeteer = require("puppeteer");
const urls = require("./json_second/ght9x-iuomj.json");
const filepath = path.resolve(__dirname, "image");
async function downloadWithLinks() {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(
    "https://media-exp1.licdn.com/dms/image/C560BAQFd07Py8Vl_sw/company-logo_200_200/0/1539663973461?e=1643241600&v=beta&t=59YG0Hma8omPR2tSpgiJb3ZPE38Hnr4CNdizusNUTPA"
  );

  for (let i = 0, total_urls = urls.length; i < total_urls; i++) {
    try {
      await page.goto(urls[i].logo, { waitUntil: "load" });

      const imgUrl = await page.$eval("body > img", (img) => img.src);
      const userUrl = await  new URL(imgUrl);

      const uniqueUrl = await userUrl.protocol === "http:" ? http : https;

      await uniqueUrl.get(imgUrl, (res) => {
        const stream = fs.createWriteStream(
          path.resolve(filepath, `${urls[i].company.replace(/[^a-zA-Z ]/g, "")}.png`)
        );
        res.pipe(stream);
        stream.on("finish", () => {
          stream.close();
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  console.log('no more links');

  await browser.close();
}

downloadWithLinks();
