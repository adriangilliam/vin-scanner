# VIN Barcode Scanner

A web application that uses your mobile device's camera to scan VIN (Vehicle Identification Number) barcodes and display the VIN number.

## Features

- 📱 Mobile-friendly camera interface
- 📸 Real-time barcode scanning using ZXing library
- ✅ VIN validation (17-character length)
- 🔒 Secure camera access with permission handling
- 📱 Responsive design optimized for mobile devices

## Tech Stack

- Next.js 15 with TypeScript
- Tailwind CSS for styling
- ZXing library for barcode scanning
- Browser MediaDevices API for camera access

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Important Notes

- **HTTPS Required**: Camera access requires HTTPS in production. This app will work on:
  - localhost (HTTP is allowed)
  - Vercel deployment (automatic HTTPS)
  - Any HTTPS domain

- **Mobile Optimization**: The app is designed primarily for mobile devices with cameras. It will attempt to use the rear-facing camera when available.

- **Browser Compatibility**: Modern browsers with WebRTC support are required.

## Deployment on Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Connect your repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Click "Deploy"

3. Vercel will automatically:
   - Detect it's a Next.js project
   - Install dependencies
   - Build and deploy
   - Provide HTTPS by default

## Usage

1. Open the app on your mobile device
2. Tap "Start Scanning" 
3. Allow camera permissions when prompted
4. Point your camera at a VIN barcode
5. The app will automatically detect and display the VIN when found
6. Tap "Scan Another VIN" to scan additional codes

## License

MIT License
