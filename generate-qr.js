import QRCode from 'qrcode';
import { createCanvas, loadImage } from 'canvas';
import { writeFileSync } from 'fs';

// Change this URL to whatever you want to encode
const URL_TO_ENCODE = 'https://straylight.github.io/xmas-non/';

// Generate QR code as PNG file with border and footer
async function generateQR() {
  try {
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(URL_TO_ENCODE, {
      width: 350,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // Create canvas with space for border and footer
    const canvas = createCanvas(400, 460);
    const ctx = canvas.getContext('2d');

    // Draw white background with rounded corners
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(5, 5, 390, 450, 20);
    ctx.fill();

    // Draw border
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(5, 5, 390, 450, 20);
    ctx.stroke();

    // Load and draw QR code
    const qrImage = await loadImage(qrDataUrl);
    ctx.drawImage(qrImage, 25, 25, 350, 350);

    // Draw footer text
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scan Me!', 200, 420);

    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    writeFileSync('qrcode.png', buffer);
    console.log('QR code saved to qrcode.png');

    // Print to terminal as well
    const terminalQR = await QRCode.toString(URL_TO_ENCODE, { type: 'terminal', small: true });
    console.log(terminalQR);
    console.log(`\nURL encoded: ${URL_TO_ENCODE}`);
  } catch (err) {
    console.error('Error generating QR code:', err);
  }
}

generateQR();
