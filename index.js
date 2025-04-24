const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
app.use(express.json());

app.post("/scrape", async (req, res) => {
  const url = req.body.url;
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: "new"
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

  const content = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("p"))
      .map(p => p.innerText.trim())
      .filter(text => text.length > 30)
      .join("\n\n");
  });

  await browser.close();
  res.send({ content });
});

app.listen(3000, () => console.log("Server started on port 3000"));
