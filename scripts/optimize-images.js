const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(inputPath, outputPath, quality = 80) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`Optimizing: ${path.basename(inputPath)}`);
    console.log(`  Original size: ${fs.statSync(inputPath).size} bytes`);
    console.log(`  Dimensions: ${metadata.width}x${metadata.height}`);
    console.log(`  Format: ${metadata.format}`);
    
    // Resize if too large (max width 1920px)
    const maxWidth = 1920;
    let resizeOptions = {};
    if (metadata.width > maxWidth) {
      resizeOptions = { width: maxWidth };
    }
    
    await image
      .resize(resizeOptions)
      .webp({ quality })
      .toFile(outputPath);
    
    const optimizedSize = fs.statSync(outputPath).size;
    const reduction = ((fs.statSync(inputPath).size - optimizedSize) / fs.statSync(inputPath).size * 100).toFixed(2);
    
    console.log(`  Optimized size: ${optimizedSize} bytes`);
    console.log(`  Reduction: ${reduction}%`);
    console.log(`  Saved as: ${path.basename(outputPath)}\n`);
    
    return { original: fs.statSync(inputPath).size, optimized: optimizedSize, reduction };
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error);
    return null;
  }
}

async function optimizeAllImages() {
  const publicDir = path.join(__dirname, '..', 'public');
  const images = [
    { input: path.join(publicDir, 'fundgrow.png'), output: path.join(publicDir, 'fundgrow-optimized.webp') }
  ];
  
  console.log('Starting image optimization...\n');
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  for (const img of images) {
    if (fs.existsSync(img.input)) {
      const result = await optimizeImage(img.input, img.output);
      if (result) {
        totalOriginal += result.original;
        totalOptimized += result.optimized;
        
        // Create a backup and replace the original with optimized version
        const backupPath = img.input + '.backup';
        fs.copyFileSync(img.input, backupPath);
        console.log(`  Backup created: ${path.basename(backupPath)}`);
        
        // Copy optimized version as PNG if needed (for compatibility)
        await sharp(img.output)
          .toFormat('png')
          .toFile(img.input.replace('.png', '-optimized.png'));
      }
    } else {
      console.log(`File not found: ${img.input}`);
    }
  }
  
  const totalReduction = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(2);
  console.log('\n=== Optimization Summary ===');
  console.log(`Total original size: ${totalOriginal} bytes (${(totalOriginal / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`Total optimized size: ${totalOptimized} bytes (${(totalOptimized / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`Total reduction: ${totalReduction}%`);
}

// Run optimization
if (require.main === module) {
  optimizeAllImages().catch(console.error);
}

module.exports = { optimizeAllImages };