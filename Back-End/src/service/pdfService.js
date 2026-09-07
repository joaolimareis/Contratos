import puppeteer from "puppeteer";

let browser = null;
let browserPromise = null;

async function getBrowser() {
  // Se já existe um navegador funcionando, reutiliza.
  if (browser && browser.connected) {
    return browser;
  }

  // Evita que duas requisições tentem iniciar dois Chromes
  // simultaneamente.
  if (browserPromise) {
    return browserPromise;
  }

  console.log("[PUPPETEER] Iniciando Chrome...");

  browserPromise = puppeteer
    .launch({
      headless: true,

      timeout: 30000,

      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    })
    .then((newBrowser) => {
      browser = newBrowser;

      console.log("[PUPPETEER] Chrome iniciado.");

      browser.on("disconnected", () => {
        console.log("[PUPPETEER] Chrome desconectado.");

        browser = null;
      });

      return browser;
    })
    .catch((error) => {
      console.error("[PUPPETEER] Erro ao iniciar Chrome:");
      console.error(error);

      browser = null;

      throw error;
    })
    .finally(() => {
      browserPromise = null;
    });

  return browserPromise;
}

export async function generatePdfFromHtml(html) {
  const browser = await getBrowser();

  let page;

  try {
    console.log("[PUPPETEER] Criando página...");

    page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    console.log("[PUPPETEER] Gerando PDF...");

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

    console.log("[PUPPETEER] PDF gerado.");

    return pdf;
  } finally {
    if (page) {
      await page.close().catch((error) => {
        console.error("[PUPPETEER] Erro ao fechar página:", error);
      });
    }
  }
}