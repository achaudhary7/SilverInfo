#!/usr/bin/env node
/**
 * Update home price snapshot values interactively.
 *
 * Usage:
 *   npm run update:snapshot
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");

const HOME_SNAPSHOT_FILE = path.join(process.cwd(), "src", "lib", "priceSnapshot.ts");
const SHANGHAI_SNAPSHOT_FILE = path.join(process.cwd(), "src", "lib", "shanghaiSnapshot.ts");

const OZ_TO_GRAM = 31.1035;
const TOLA_TO_GRAM = 11.6638;
const IMPORT_DUTY = 0.06;
const IGST = 0.03;
const MCX_PREMIUM = 0.03;
const KG_TO_OZ = 32.1507;
const DEFAULT_SHANGHAI_PREMIUM_PERCENT = 4;
const INDIA_COMPARISON_FACTOR = 1.24;

function parseArgs(argv) {
  const args = {
    comex: null,
    usdinr: null,
    usdcny: null,
    premium: null,
    change: null,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (token.startsWith("--comex=")) {
      args.comex = Number(token.split("=")[1]);
      continue;
    }
    if (token === "--comex" && argv[i + 1]) {
      args.comex = Number(argv[i + 1]);
      i += 1;
      continue;
    }

    if (token.startsWith("--usdinr=")) {
      args.usdinr = Number(token.split("=")[1]);
      continue;
    }
    if (token.startsWith("--usdcny=")) {
      args.usdcny = Number(token.split("=")[1]);
      continue;
    }
    if (token === "--usdcny" && argv[i + 1]) {
      args.usdcny = Number(argv[i + 1]);
      i += 1;
      continue;
    }

    if (token.startsWith("--premium=")) {
      args.premium = Number(token.split("=")[1]);
      continue;
    }
    if (token === "--premium" && argv[i + 1]) {
      args.premium = Number(argv[i + 1]);
      i += 1;
      continue;
    }
    if (token === "--usdinr" && argv[i + 1]) {
      args.usdinr = Number(argv[i + 1]);
      i += 1;
      continue;
    }

    if (token.startsWith("--change=")) {
      args.change = Number(token.split("=")[1]);
      continue;
    }
    if (token === "--change" && argv[i + 1]) {
      args.change = Number(argv[i + 1]);
      i += 1;
    }
  }

  return args;
}

function parseCurrentNumber(content, key) {
  const re = new RegExp(`\\b${key}:\\s*(-?[0-9]+(?:\\.[0-9]+)?)`, "m");
  const match = content.match(re);
  if (!match) return null;
  return Number(match[1]);
}

function replaceSnapshotKey(content, key, valueLiteral) {
  const re = new RegExp(`(\\b${key}:\\s*)([^,\\n]+)(,)`, "m");
  if (!re.test(content)) {
    throw new Error(`Could not find key "${key}" in HOME_PRICE_SNAPSHOT.`);
  }
  return content.replace(re, `$1${valueLiteral}$3`);
}

function formatNumber(value, decimals = 2) {
  return Number(value.toFixed(decimals));
}

async function main() {
  if (!fs.existsSync(HOME_SNAPSHOT_FILE)) {
    throw new Error(`Home snapshot file not found: ${HOME_SNAPSHOT_FILE}`);
  }
  if (!fs.existsSync(SHANGHAI_SNAPSHOT_FILE)) {
    throw new Error(`Shanghai snapshot file not found: ${SHANGHAI_SNAPSHOT_FILE}`);
  }

  let homeContent = fs.readFileSync(HOME_SNAPSHOT_FILE, "utf8");
  let shanghaiContent = fs.readFileSync(SHANGHAI_SNAPSHOT_FILE, "utf8");
  const currentPricePerGram = parseCurrentNumber(homeContent, "pricePerGram") || 0;
  const currentComex = parseCurrentNumber(homeContent, "comexUsd") || 0;
  const currentUsdInr = parseCurrentNumber(homeContent, "usdInr") || 0;
  const currentChange24h = parseCurrentNumber(homeContent, "change24h") || 0;
  const currentUsdCny = parseCurrentNumber(shanghaiContent, "usdCny") || 6.91;
  const currentPremium = parseCurrentNumber(shanghaiContent, "premiumPercent") || DEFAULT_SHANGHAI_PREMIUM_PERCENT;
  const cli = parseArgs(process.argv.slice(2));

  let comexUsd = cli.comex;
  let usdInr = cli.usdinr;
  let usdCny = cli.usdcny;
  let premiumPercent = cli.premium;
  let change24h = cli.change;

  const hasAllCliValues =
    Number.isFinite(comexUsd) &&
    Number.isFinite(usdInr) &&
    Number.isFinite(change24h);

  if (!hasAllCliValues) {
    const rl = readline.createInterface({ input, output });
    try {
      output.write("\n=== SilverInfo Snapshot Updater ===\n");
      output.write(`Current home snapshot: ₹${currentPricePerGram}/g | COMEX $${currentComex} | USD/INR ₹${currentUsdInr}\n`);
      output.write(`Current shanghai snapshot: USD/CNY ${currentUsdCny} | premium ${currentPremium}%\n\n`);
      output.write("Tip: non-interactive mode: npm run update:snapshot -- --comex 31.2 --usdinr 86.4 --change 1.8 --usdcny 6.91 --premium 4\n\n");

      const comexRaw = await rl.question(`COMEX silver (USD/oz) [${currentComex}]: `);
      const usdInrRaw = await rl.question(`USD/INR rate [${currentUsdInr}]: `);
      const usdCnyRaw = await rl.question(`USD/CNY rate [${currentUsdCny}]: `);
      const premiumRaw = await rl.question(`Shanghai premium % over COMEX [${currentPremium}]: `);
      const change24hRaw = await rl.question(`24h change in INR/gram [${currentChange24h}]: `);

      comexUsd = comexRaw.trim() === "" ? currentComex : Number(comexRaw);
      usdInr = usdInrRaw.trim() === "" ? currentUsdInr : Number(usdInrRaw);
      usdCny = usdCnyRaw.trim() === "" ? currentUsdCny : Number(usdCnyRaw);
      premiumPercent = premiumRaw.trim() === "" ? currentPremium : Number(premiumRaw);
      change24h = change24hRaw.trim() === "" ? currentChange24h : Number(change24hRaw);
    } finally {
      rl.close();
    }
  } else {
    output.write("\n=== SilverInfo Snapshot Updater (Non-Interactive) ===\n");
    output.write(`Current home snapshot: ₹${currentPricePerGram}/g | COMEX $${currentComex} | USD/INR ₹${currentUsdInr}\n`);
    output.write(`Current shanghai snapshot: USD/CNY ${currentUsdCny} | premium ${currentPremium}%\n`);
    output.write(`Input values: COMEX $${comexUsd} | USD/INR ₹${usdInr} | USD/CNY ${Number.isFinite(usdCny) ? usdCny : currentUsdCny} | premium ${Number.isFinite(premiumPercent) ? premiumPercent : currentPremium}% | 24h change ₹${change24h}\n\n`);
  }

  if (!Number.isFinite(usdCny)) {
    usdCny = currentUsdCny;
  }
  if (!Number.isFinite(premiumPercent)) {
    premiumPercent = currentPremium;
  }

  if (!Number.isFinite(comexUsd) || comexUsd <= 0) {
    throw new Error("Invalid COMEX value.");
  }
  if (!Number.isFinite(usdInr) || usdInr <= 0) {
    throw new Error("Invalid USD/INR value.");
  }
  if (!Number.isFinite(usdCny) || usdCny <= 0) {
    throw new Error("Invalid USD/CNY value.");
  }
  if (!Number.isFinite(premiumPercent) || premiumPercent < 0) {
    throw new Error("Invalid Shanghai premium value.");
  }
  if (!Number.isFinite(change24h)) {
    throw new Error("Invalid 24h change value.");
  }

  const pricePerOzInr = comexUsd * usdInr;
  const basePrice = pricePerOzInr / OZ_TO_GRAM;
  const withDuty = basePrice * (1 + IMPORT_DUTY);
  const withIgst = withDuty * (1 + IGST);
  const finalPrice = withIgst * (1 + MCX_PREMIUM);

  const pricePerGram = formatNumber(finalPrice, 2);
  const pricePerKg = Math.round(pricePerGram * 1000);
  const pricePer10Gram = formatNumber(pricePerGram * 10, 2);
  const pricePerTola = formatNumber(pricePerGram * TOLA_TO_GRAM, 2);
  const previousPrice = pricePerGram - change24h;
  const changePercent24h = previousPrice > 0 ? formatNumber((change24h / previousPrice) * 100, 2) : 0;
  const high24h = formatNumber(Math.max(pricePerGram, previousPrice), 2);
  const low24h = formatNumber(Math.min(pricePerGram, previousPrice), 2);
  const timestamp = new Date().toISOString();
  const premiumFactor = 1 + premiumPercent / 100;

  // Shanghai snapshot calculations
  const shanghaiPerOzUsd = formatNumber(comexUsd * premiumFactor, 2);
  const shanghaiPerOzCny = formatNumber(shanghaiPerOzUsd * usdCny, 2);
  const shanghaiPerKgCny = formatNumber(shanghaiPerOzCny * KG_TO_OZ, 2);
  const shanghaiPerGramCny = formatNumber(shanghaiPerKgCny / 1000, 2);
  const shanghaiPerGramUsd = formatNumber(shanghaiPerOzUsd / OZ_TO_GRAM, 2);
  const shanghaiPerKgUsd = formatNumber(shanghaiPerGramUsd * 1000, 2);
  const cnyInr = formatNumber(usdInr / usdCny, 4);
  const shanghaiPerGramInr = formatNumber(shanghaiPerGramCny * cnyInr, 2);
  const shanghaiPerKgInr = formatNumber(shanghaiPerKgCny * cnyInr, 2);
  const shanghaiPerOzInr = formatNumber(shanghaiPerOzCny * cnyInr, 2);
  const premiumUsd = formatNumber(shanghaiPerOzUsd - comexUsd, 2);
  const indiaRatePerGram = formatNumber((comexUsd * usdInr / OZ_TO_GRAM) * INDIA_COMPARISON_FACTOR, 2);

  if (!cli.dryRun) {
    homeContent = replaceSnapshotKey(homeContent, "pricePerGram", String(pricePerGram));
    homeContent = replaceSnapshotKey(homeContent, "pricePerKg", String(pricePerKg));
    homeContent = replaceSnapshotKey(homeContent, "pricePer10Gram", String(pricePer10Gram));
    homeContent = replaceSnapshotKey(homeContent, "pricePerTola", String(pricePerTola));
    homeContent = replaceSnapshotKey(homeContent, "timestamp", `"${timestamp}"`);
    homeContent = replaceSnapshotKey(homeContent, "change24h", String(formatNumber(change24h, 2)));
    homeContent = replaceSnapshotKey(homeContent, "changePercent24h", String(changePercent24h));
    homeContent = replaceSnapshotKey(homeContent, "high24h", String(high24h));
    homeContent = replaceSnapshotKey(homeContent, "low24h", String(low24h));
    homeContent = replaceSnapshotKey(homeContent, "usdInr", String(formatNumber(usdInr, 2)));
    homeContent = replaceSnapshotKey(homeContent, "comexUsd", String(formatNumber(comexUsd, 2)));

    shanghaiContent = replaceSnapshotKey(shanghaiContent, "pricePerKgCny", String(shanghaiPerKgCny));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "pricePerGramCny", String(shanghaiPerGramCny));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "pricePerOzCny", String(shanghaiPerOzCny));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "pricePerOzUsd", String(shanghaiPerOzUsd));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "pricePerGramUsd", String(shanghaiPerGramUsd));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "pricePerKgUsd", String(shanghaiPerKgUsd));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "pricePerGramInr", String(shanghaiPerGramInr));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "pricePerKgInr", String(shanghaiPerKgInr));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "pricePerOzInr", String(shanghaiPerOzInr));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "indiaRatePerGram", String(indiaRatePerGram));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "comexUsd", String(formatNumber(comexUsd, 2)));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "premiumPercent", String(formatNumber(premiumPercent, 2)));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "premiumUsd", String(premiumUsd));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "usdCny", String(formatNumber(usdCny, 4)));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "usdInr", String(formatNumber(usdInr, 2)));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "cnyInr", String(cnyInr));
    shanghaiContent = replaceSnapshotKey(shanghaiContent, "timestamp", `"${timestamp}"`);

    fs.writeFileSync(HOME_SNAPSHOT_FILE, homeContent, "utf8");
    fs.writeFileSync(SHANGHAI_SNAPSHOT_FILE, shanghaiContent, "utf8");
  }

  output.write(cli.dryRun ? "\nDry-run complete (no file changes).\n" : "\nSnapshot updated successfully.\n");
  output.write(`Home: ₹${pricePerGram}/gram | ₹${pricePer10Gram}/10g | ₹${pricePerKg}/kg\n`);
  output.write(`Home change: ${change24h >= 0 ? "+" : ""}₹${formatNumber(change24h, 2)} (${changePercent24h}%)\n`);
  output.write(`Shanghai: ¥${shanghaiPerKgCny}/kg | $${shanghaiPerOzUsd}/oz | +${formatNumber(premiumPercent, 2)}% premium\n`);
  output.write(`Files: ${HOME_SNAPSHOT_FILE}\n       ${SHANGHAI_SNAPSHOT_FILE}\n\n`);
}

main().catch((error) => {
  console.error("\nFailed to update snapshot:", error.message);
  process.exit(1);
});
