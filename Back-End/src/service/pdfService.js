import puppeteer from "puppeteer";

export async function generatePdfFromHtml(html) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,

      margin: {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm",
      },
    });

    return pdf;
  } finally {
    await browser.close();
  }
}