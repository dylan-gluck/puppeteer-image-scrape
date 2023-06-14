import * as fs from "fs";
import axios from "axios";
import puppeteer from "puppeteer";
import { program } from "commander";

// Download Function
async function download(url, filepath) {
  console.log("Downloading img:", url);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on("error", reject)
      .once("close", () => resolve(filepath));
  });
}

(async () => {
  // Define Options
  program
    .requiredOption(
      "-u, --url <string>",
      "The base URL to use for crawl (required)"
    )
    .option("-s, --select <string>", "CSS selector for images", "img")
    .parse();

  // Get Options
  const options = program.opts();

  const baseUrl = options.url;
  const select = options.select;

  // Scrape Page Function
  async function scrapePage(url, selector, page) {
    // Load page
    await page.goto(url);
    console.log("Starting on: ", url);

    // Wait for selector
    await page.waitForSelector(selector);

    // Get the image URLs
    const imageUrls = await page.evaluate((selector) => {
      const images = Array.from(document.querySelectorAll(selector));
      return images.map((image) => image.src);
    }, selector);

    console.log(`Found ${imageUrls.length} images`);

    // Download images
    for (const imageUrl of imageUrls) {
      const filename = imageUrl.split("/").pop();
      const localPath = `./images/${filename}`;

      // Download image
      await download(imageUrl, localPath);
    }

    console.log("Completed page");
  }

  // Init Puppeteer
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Scrape Base Page
  await scrapePage(baseUrl, select, page);

  // Done
  await browser.close();
  process.exit();
})();