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

const SNAPSHOT_FILE = path.join(process.cwd(), "src", "lib", "priceSnapshot.ts");

const OZ_TO_GRAM = 31.1035;
const TOLA_TO_GRAM = 11.6638;
const IMPORT_DUTY = 0.06;
const IGST = 0.03;
const MCX_PREMIUM = 0.03;

function parseCurrentNumber(content, key) {
  const re = new RegExp(`\\b${key}:\\s*([0-9]+(?:\\.[0-9]+)?)`, "m");
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
  if (!fs.existsSync(SNAPSHOT_FILE)) {
    throw new Error(`Snapshot file not found: ${SNAPSHOT_FILE}`);
  }

  let content = fs.readFileSync(SNAPSHOT_FILE, "utf8");
  const currentPricePerGram = parseCurrentNumber(content, "pricePerGram") || 0;
  const currentComex = parseCurrentNumber(content, "comexUsd") || 0;
  const currentUsdInr = parseCurrentNumber(content, "usdInr") || 0;
  const currentChange24h = parseCurrentNumber(content, "change24h") || 0;

  const rl = readline.createInterface({ input, output });

  try {
    output.write("\n=== SilverInfo Snapshot Updater ===\n");
    output.write(`Current snapshot: ₹${currentPricePerGram}/g | COMEX $${currentComex} | USD/INR ₹${currentUsdInr}\n\n`);

    const comexRaw = await rl.question(`COMEX silver (USD/oz) [${currentComex}]: `);
    const usdInrRaw = await rl.question(`USD/INR rate [${currentUsdInr}]: `);
    const change24hRaw = await rl.question(`24h change in INR/gram [${currentChange24h}]: `);

    const comexUsd = comexRaw.trim() === "" ? currentComex : Number(comexRaw);
    const usdInr = usdInrRaw.trim() === "" ? currentUsdInr : Number(usdInrRaw);
    const change24h = change24hRaw.trim() === "" ? currentChange24h : Number(change24hRaw);

    if (!Number.isFinite(comexUsd) || comexUsd <= 0) {
      throw new Error("Invalid COMEX value.");
    }
    if (!Number.isFinite(usdInr) || usdInr <= 0) {
      throw new Error("Invalid USD/INR value.");
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

    content = replaceSnapshotKey(content, "pricePerGram", String(pricePerGram));
    content = replaceSnapshotKey(content, "pricePerKg", String(pricePerKg));
    content = replaceSnapshotKey(content, "pricePer10Gram", String(pricePer10Gram));
    content = replaceSnapshotKey(content, "pricePerTola", String(pricePerTola));
    content = replaceSnapshotKey(content, "timestamp", `"${timestamp}"`);
    content = replaceSnapshotKey(content, "change24h", String(formatNumber(change24h, 2)));
    content = replaceSnapshotKey(content, "changePercent24h", String(changePercent24h));
    content = replaceSnapshotKey(content, "high24h", String(high24h));
    content = replaceSnapshotKey(content, "low24h", String(low24h));
    content = replaceSnapshotKey(content, "usdInr", String(formatNumber(usdInr, 2)));
    content = replaceSnapshotKey(content, "comexUsd", String(formatNumber(comexUsd, 2)));

    fs.writeFileSync(SNAPSHOT_FILE, content, "utf8");

    output.write("\nSnapshot updated successfully.\n");
    output.write(`New price: ₹${pricePerGram}/gram | ₹${pricePer10Gram}/10g | ₹${pricePerKg}/kg\n`);
    output.write(`Change: ${change24h >= 0 ? "+" : ""}₹${formatNumber(change24h, 2)} (${changePercent24h}%)\n`);
    output.write(`Updated file: ${SNAPSHOT_FILE}\n\n`);
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error("\nFailed to update snapshot:", error.message);
  process.exit(1);
});
