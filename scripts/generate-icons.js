const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if ImageMagick is installed
try {
  execSync('convert -version', { stdio: 'ignore' });
} catch (error) {
  console.error('Error: ImageMagick is not installed. Please install it to generate icons.');
  console.error('You can install it with:');
  console.error('  - macOS: brew install imagemagick');
  console.error('  - Ubuntu/Debian: sudo apt-get install imagemagick');
  console.error('  - Windows: Download from https://imagemagick.org/script/download.php');
  process.exit(1);
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const svgPath = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate icons for each size
sizes.forEach(size => {
  const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
  try {
    execSync(`convert -background none -size ${size}x${size} ${svgPath} ${outputPath}`);
    console.log(`Generated: ${outputPath}`);
  } catch (error) {
    console.error(`Error generating icon size ${size}x${size}:`, error.message);
  }
});

console.log('Icon generation complete!'); 