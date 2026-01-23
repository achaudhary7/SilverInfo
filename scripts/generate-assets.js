/**
 * Generate PWA Icons and OG Image
 * 
 * Run: node scripts/generate-assets.js
 * Requires: npm install sharp (added as devDependency)
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('⚠️  Sharp not installed. Run: npm install sharp --save-dev');
  console.log('   Then run this script again.\n');
  process.exit(1);
}

const publicDir = path.join(__dirname, '..', 'public');

// SVG for the favicon/icon (silver coin design)
const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="silver" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e8e8e8"/>
      <stop offset="50%" style="stop-color:#c0c0c0"/>
      <stop offset="100%" style="stop-color:#a8a8a8"/>
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="240" fill="url(#silver)" stroke="#888" stroke-width="8"/>
  <circle cx="256" cy="256" r="200" fill="none" stroke="#999" stroke-width="4"/>
  <text x="256" y="280" font-family="Arial, sans-serif" font-size="160" font-weight="bold" fill="#1e3a5f" text-anchor="middle">₹</text>
</svg>
`;

// OG Image SVG (1200x630)
const ogImageSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a5f"/>
      <stop offset="100%" style="stop-color:#2c5282"/>
    </linearGradient>
    <linearGradient id="silver" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e8e8e8"/>
      <stop offset="50%" style="stop-color:#c0c0c0"/>
      <stop offset="100%" style="stop-color:#a8a8a8"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Decorative circles -->
  <circle cx="100" cy="100" r="200" fill="rgba(255,255,255,0.03)"/>
  <circle cx="1100" cy="530" r="300" fill="rgba(255,255,255,0.03)"/>
  
  <!-- Silver coin icon -->
  <circle cx="200" cy="315" r="120" fill="url(#silver)" stroke="#888" stroke-width="4"/>
  <circle cx="200" cy="315" r="95" fill="none" stroke="#999" stroke-width="2"/>
  <text x="200" y="345" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="#1e3a5f" text-anchor="middle">₹</text>
  
  <!-- Text content -->
  <text x="380" y="260" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white">SilverInfo.in</text>
  <text x="380" y="340" font-family="Arial, sans-serif" font-size="36" fill="rgba(255,255,255,0.8)">Live Silver Prices in India</text>
  
  <!-- Features -->
  <text x="380" y="420" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.6)">✓ Real-time Rates</text>
  <text x="620" y="420" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.6)">✓ Price Calculator</text>
  <text x="880" y="420" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.6)">✓ City-wise Prices</text>
  
  <!-- URL -->
  <text x="600" y="580" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.5)" text-anchor="middle">silverinfo.in</text>
</svg>
`;

async function generateAssets() {
  console.log('🎨 Generating assets...\n');

  // Generate PWA icons
  const iconSizes = [
    { size: 192, name: 'icon-192.png' },
    { size: 512, name: 'icon-512.png' },
    { size: 180, name: 'apple-touch-icon.png' },
  ];

  for (const { size, name } of iconSizes) {
    const outputPath = path.join(publicDir, name);
    await sharp(Buffer.from(iconSvg))
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated ${name} (${size}x${size})`);
  }

  // Generate OG image as PNG
  const ogOutputPath = path.join(publicDir, 'og-image.png');
  await sharp(Buffer.from(ogImageSvg))
    .resize(1200, 630)
    .png()
    .toFile(ogOutputPath);
  console.log('✓ Generated og-image.png (1200x630)');

  console.log('\n✅ All assets generated successfully!');
  console.log('\n📝 Next steps:');
  console.log('   1. Update layout.tsx to use og-image.png instead of og-image.svg');
  console.log('   2. Verify images look correct in public/ folder');
}

generateAssets().catch(err => {
  console.error('❌ Error generating assets:', err);
  process.exit(1);
});
