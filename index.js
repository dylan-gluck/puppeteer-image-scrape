import * as fs from "fs";
import axios from "axios";
import puppeteer from "puppeteer";
import { program } from "commander";

// Define Options
program
  .requiredOption(
    "-u, --url <string>",
    "The base URL to use for crawl (required)"
  )
  .option("-s, --select <string>", "CSS selector for images", "img")
  .option("-n, --next <string>", "CSS selector for link to next page")
  .option("-l, --limit <int>", "Maximum number of pages to crawl", 10)
  .option("-v, --verbose")
  .parse();

// Get Options
const { url: baseUrl, select, next, limit, verbose } = program.opts();

// Verbose Logging
if (verbose) console.log("Verbose logging enabled");

// Download Function
async function download(url, filepath) {
  try {
    // Verbose Logging
    if (verbose) console.log("Downloading img:", url);

    // Fetch asset
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });
    await new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(filepath))
        .on("error", reject)
        .once("close", () => resolve(filepath));
    });
  } catch (error) {
    console.error("Error downloading img:", url);
    console.error(error);
  }
}

(async () => {
  // Set Current Page Index = 0
  let index = 0;

  // Scrape Page Function
  async function scrapePage(url, selector, page) {
    try {
      // Load page
      await page.goto(url);

      // Basic Logging
      console.log("Starting on:", url);

      // Wait for selector
      await page.waitForSelector(selector);

      // Get the image URLs
      const imageUrls = await page.evaluate((selector) => {
        const images = Array.from(document.querySelectorAll(selector));
        return images.map((image) => image.src);
      }, selector);

      // Basic Logging
      console.log(`Found ${imageUrls.length} images`);

      // Download images in parallel
      await Promise.all(
        imageUrls.map((imageUrl) => {
          const filename = imageUrl.split("/").pop();
          const localPath = `./images/${filename}`;
          return download(imageUrl, localPath);
        })
      );

      // Basic Logging
      console.log(`Completed page ${index}`);

      // Crawl?
      if (next && index < limit) {
        // Increment index
        index++;
        // Get URL
        const nextUrl = await page.evaluate((next) => {
          return document.querySelector(next).href;
        }, next);
        // Scrape Next Page
        await scrapePage(nextUrl, select, page);
      }
    } catch (error) {
      console.error("Error scraping page:", url);
      console.error(error);
    }
  }

  // Init Puppeteer
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    // Scrape Base Page
    await scrapePage(baseUrl, select, page);
  } catch (error) {
    console.error("Error during scraping:");
    console.error(error);
  } finally {
    // Done
    console.log("Crawl complete, exiting.");
    await browser.close();
    process.exit();
  }
})();
