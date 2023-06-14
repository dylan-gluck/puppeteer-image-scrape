# Puppeteer Image Scraper

The Website Image Scraper is a Node.js script that allows you to scrape a website for images. It provides a flexible and customizable way to collect images from a specified URL, along with optional parameters for selectors and pagination. This script is particularly useful for data collection purposes, such as gathering images for training stable diffusion models.

## Prerequisites

To use the Website Image Scraper, ensure that you have the following software installed on your machine:

- Node.js (v12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone this repository to your local machine or download the source code as a ZIP file.
2. Navigate to the project directory in your terminal.
3. Run the following command to install the required dependencies:

```
npm install
```

## Usage

To run the Website Image Scraper, use the following command:

```
node ./index.js -u <url> [-s <imageSelector>] [-n <nextLinkSelector>] [-l <limit>]
```

Replace the placeholders with the appropriate values for your scraping needs:

- `<url>`: The base URL of the website you want to scrape.
- `<imageSelector>` (optional): CSS selector for identifying the images on the page. If not provided, it defaults to `"img"`.
- `<nextLinkSelector>` (optional): CSS selector for identifying the link to the next page. If not provided, pagination is not performed.
- `<limit>` (optional): The maximum number of images to download. If not provided, all available images will be downloaded.

### Usage Examples

Scrape a website for images using the default settings:

```
node ./index.js -u https://example.com
```

Scrape a website for images using custom selectors and limit:

```
node ./index.js -u https://example.com -s ".custom-image-selector" -n ".pagination-link" -l 50
```

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [Node.js](https://nodejs.org) - JavaScript runtime environment
- [puppeteer](https://github.com/puppeteer/puppeteer) - Headless Chrome Node.js API

---

Feel free to customize the README based on your project's specific details and requirements.
