# 📸 PhotoBeam

**Anonymous photo → QR sharing app**  
Built with React + Vite + TypeScript + Tailwind.

---

## 🚀 Overview

PhotoBeam lets you share a photo in person without exchanging contact details.  
The app uploads your photo to a temporary host, generates a link, and displays it as a QR code.

### Core Flow
1. Select a photo
2. (Optional) Strip EXIF metadata
3. Upload to [file.io](https://www.file.io) (temporary hosting)
4. Receive a share link
5. Display and download a QR code for others to scan

---

## ✨ Features

- ✅ Photo preview before upload  
- ✅ Strip EXIF metadata by re-encoding image  
- ✅ Expiry presets: 30 minutes, 1 hour, 24 hours, 7 days  
- ✅ Download limits: single (1) or group (~20 downloads)  
- ✅ Copy link / open link in browser  
- ✅ Download QR code as SVG  
- ✅ Reset and upload another file  

---

## 📂 Project Structure
```

## 🛠️ Getting started

Prerequisites

- Node.js 18+ (or compatible LTS)
- npm, yarn, or pnpm

Install

```bash
# using npm
npm install

# using pnpm
pnpm install

# using yarn
yarn
```

Run locally (development)

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev
```

Build for production

```bash
npm run build
npm run preview
```

Notes

- The project uses Vite. If you use a different package manager, adapt commands accordingly.
- If your environment requires specific environment variables (for example a different file hosting endpoint or API key), create a `.env` or `.env.local` file at the project root and restart the dev server.

---

## ⚙️ Configuration & environment

The app uploads files to file.io by default. If you wish to swap providers or add an API key, add Vite env vars (prefixed with `VITE_`) and update the upload client accordingly.

Recommended env variables (assumed names; update code if your app uses different keys):

- `VITE_FILEIO_BASE_URL` — base URL for the upload endpoint (default: https://file.io)
- `VITE_FILEIO_API_KEY` — optional API key (if you move to a provider that requires one)

Add these to `.env.local`:

```bash
# .env.local
VITE_FILEIO_BASE_URL=https://file.io
# VITE_FILEIO_API_KEY=your_key_here
```

Under-specification note: I assumed the project uses Vite env var conventions and client-side uploads to file.io. If the repo uses different names/config, tell me and I will update this README accordingly.

---

## 🧭 How it works (technical summary)

- The app reads the selected file in the browser, displays a preview, and can re-encode the image to strip EXIF metadata.
- The file is uploaded to a temporary hosting service (file.io) with configurable expiry and download limits.
- The service returns a share URL which the app converts into a QR code (SVG) for easy in-person sharing.

---

## 🔒 Privacy & security

- EXIF stripping: re-encoding removes embedded metadata (GPS, timestamps) from images when enabled.
- Temporary hosting: files are uploaded to a short-lived host; choose expiry and download limits to reduce exposure.
- No contact discovery: the app is intended for ad-hoc sharing and does not create or store persistent user profiles.

---

## 🧪 Tests

If the repository contains tests, run them with your package manager. Example:

```bash
npm test
```

If there are no tests yet, consider adding a small unit test for the upload client and a component test for the main UI flow.

---

## 🤝 Contributing

- Fork the repo, create a feature branch, and open a PR describing your changes.
- Keep changes small and focused. Include tests for new behavior.
- For UI/UX changes, provide screenshots or a short GIF.

---

## 🚢 Deployment

You can deploy the built app to any static hosting (Netlify, Vercel, GitHub Pages, S3 + CloudFront). Build output is in `dist/`.

---

## 📄 License

MIT — see the `LICENSE` file for details.

---

## ❓ Where to go from here

- Add a live demo link or GitHub Pages preview
- Add tests and CI (GitHub Actions)
- Add E2E tests for the upload + QR generation flow

---

If you'd like, I can also:

- add a demo screenshot to the README
- detect exact env var names from the codebase and update the configuration section
- add a tiny CONTRIBUTING.md and ISSUE_TEMPLATE

# 📸 PhotoBeam

**Anonymous photo → QR sharing app**  
Built with React + Vite + TypeScript + Tailwind.

---

## 🚀 Overview

PhotoBeam lets you share a photo in person without exchanging contact details.  
The app uploads your photo to a temporary host, generates a link, and displays it as a QR code.

### Core Flow
1. Select a photo
2. (Optional) Strip EXIF metadata
3. Upload to [file.io](https://www.file.io) (temporary hosting)
4. Receive a share link
5. Display and download a QR code for others to scan

---

## ✨ Features

- ✅ Photo preview before upload  
- ✅ Strip EXIF metadata by re-encoding image  
- ✅ Expiry presets: 30 minutes, 1 hour, 24 hours, 7 days  
- ✅ Download limits: single (1) or group (~20 downloads)  
- ✅ Copy link / open link in browser  
- ✅ Download QR code as SVG  
- ✅ Reset and upload another file  

---

## 📂 Project Structure