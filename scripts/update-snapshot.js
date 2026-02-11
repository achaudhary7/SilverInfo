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

function parseArgs(argv) {
  const args = {
    comex: null,
    usdinr: null,
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
  const cli = parseArgs(process.argv.slice(2));

  let comexUsd = cli.comex;
  let usdInr = cli.usdinr;
  let change24h = cli.change;

  const hasAllCliValues =
    Number.isFinite(comexUsd) &&
    Number.isFinite(usdInr) &&
    Number.isFinite(change24h);

  if (!hasAllCliValues) {
    const rl = readline.createInterface({ input, output });
    try {
      output.write("\n=== SilverInfo Snapshot Updater ===\n");
      output.write(`Current snapshot: ₹${currentPricePerGram}/g | COMEX $${currentComex} | USD/INR ₹${currentUsdInr}\n\n`);
      output.write("Tip: non-interactive mode: npm run update:snapshot -- --comex 31.2 --usdinr 86.4 --change 1.8\n\n");

      const comexRaw = await rl.question(`COMEX silver (USD/oz) [${currentComex}]: `);
      const usdInrRaw = await rl.question(`USD/INR rate [${currentUsdInr}]: `);
      const change24hRaw = await rl.question(`24h change in INR/gram [${currentChange24h}]: `);

      comexUsd = comexRaw.trim() === "" ? currentComex : Number(comexRaw);
      usdInr = usdInrRaw.trim() === "" ? currentUsdInr : Number(usdInrRaw);
      change24h = change24hRaw.trim() === "" ? currentChange24h : Number(change24hRaw);
    } finally {
      rl.close();
    }
  } else {
    output.write("\n=== SilverInfo Snapshot Updater (Non-Interactive) ===\n");
    output.write(`Current snapshot: ₹${currentPricePerGram}/g | COMEX $${currentComex} | USD/INR ₹${currentUsdInr}\n`);
    output.write(`Input values: COMEX $${comexUsd} | USD/INR ₹${usdInr} | 24h change ₹${change24h}\n\n`);
  }

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

  if (!cli.dryRun) {
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
  }

  output.write(cli.dryRun ? "\nDry-run complete (no file changes).\n" : "\nSnapshot updated successfully.\n");
  output.write(`New price: ₹${pricePerGram}/gram | ₹${pricePer10Gram}/10g | ₹${pricePerKg}/kg\n`);
  output.write(`Change: ${change24h >= 0 ? "+" : ""}₹${formatNumber(change24h, 2)} (${changePercent24h}%)\n`);
  output.write(`Target file: ${SNAPSHOT_FILE}\n\n`);
}

main().catch((error) => {
  console.error("\nFailed to update snapshot:", error.message);
  process.exit(1);
});
