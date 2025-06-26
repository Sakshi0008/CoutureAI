#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const modelDir = path.join(rootDir, 'stable_diffusion_model');

console.log('🔍 Validating Stable Diffusion Model Setup...\n');

// Check if model directory exists
if (!fs.existsSync(modelDir)) {
  console.error('❌ Model directory not found!');
  console.log(`📁 Expected location: ${modelDir}`);
  console.log('💡 Please download the model from Google Colab and place it in the root directory.');
  process.exit(1);
}

console.log('✅ Model directory found');

// Required files and their expected locations
const requiredFiles = [
  'safety_checker/model.safetensors',
  'text_encoder/model.safetensors', 
  'unet/model.safetensors',
  'vae/model.safetensors',
  'config.json'
];

let allFilesPresent = true;
let totalSize = 0;

console.log('\n📋 Checking required files:');

for (const file of requiredFiles) {
  const filePath = path.join(modelDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    totalSize += stats.size;
    console.log(`✅ ${file} (${sizeMB} MB)`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesPresent = false;
  }
}

if (!allFilesPresent) {
  console.log('\n❌ Some required files are missing!');
  console.log('💡 Please ensure all model files are properly extracted.');
  process.exit(1);
}

const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
console.log(`\n📊 Total model size: ${totalSizeGB} GB`);

if (totalSize < 4 * 1024 * 1024 * 1024) { // Less than 4GB
  console.log('⚠️  Model size seems smaller than expected. The complete model should be ~4-5GB.');
}

console.log('\n✅ Model validation successful!');
console.log('🚀 You can now run "npm run dev" to start the server.');

// Check system resources
console.log('\n💻 System Resource Check:');
const os = await import('os');
const totalMem = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
const freeMem = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);

console.log(`📊 Total RAM: ${totalMem} GB`);
console.log(`📊 Available RAM: ${freeMem} GB`);

if (parseFloat(freeMem) < 4) {
  console.log('⚠️  Low available RAM. Consider closing other applications for better performance.');
}

console.log('\n🎉 Model setup is ready for use!'); 

// This code is for checking if the model is properly set up and ready to use, if we are using the local model.