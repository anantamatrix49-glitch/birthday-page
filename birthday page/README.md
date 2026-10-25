# Manya Gupta Birthday Website ✨

A cinematic, full-screen, interactive birthday presentation crafted for **Manya Gupta** (26 October 2026).

---

## 🌟 Key Features

1. **Responsive Full-Screen Presentation**:
   - Sized for the full viewport, with internal scene scrolling on small screens so no content is cut off.
   - 7 independent cinematic full-screen scenes with smooth fade, blur, and scale transitions.
   - Debounced navigation to prevent accidental double-click jumps.
   - Seamless navigation: Bottom navigation pill dock, subtle `01 / 07` indicator, Back / Next buttons, and keyboard navigation (`←` and `→` arrow keys).

2. **The 7 Cinematic Scenes**:
   - **Scene 1 — The Secret Invitation**: Royal plum backdrop, floating golden star particles, glowing wax seal `M`, and "Open Your Surprise ✨" button.
   - **Scene 2 — The Birthday Reveal**: Animated typography "HAPPY BIRTHDAY, MANYA!", "26 October 2026", and celebratory confetti burst.
   - **Scene 3 — Our Story**: Interactive friendship milestones covering:
     - *Class 3: Where our story began*
     - *Class 10: When we met again*
     - *Today: A friendship I truly value*
   - **Scene 4 — Our Memories**: Full-screen showcase photo gallery (not a tall grid), featuring ambient glow backdrops, Prev/Next controls, mobile touch swipe, and a thumbnail strip.
   - **Scene 5 — A Letter for You**: Interactive 3D envelope with animated opening flap, revealing a vintage parchment letter with a 4-part readable paragraph stepper and a full-screen "Read All" modal.
   - **Scene 6 — The Happy Birthday Wall**: Deep midnight navy & blush-pink celebration wall featuring:
     - Glowing birthday cake with interactive candles (tap to blow candles! 🎂💨)
     - Floating balloons, stars, and selected photo frames
     - "Make a Wish ✨" particle fountain
     - Shared birthday music controlled by the persistent music button in the top navigation
   - **Scene 7 — The Final Message**: Quiet cinematic closing featuring a highlighted photo, the 3 exact quotes, an in-place editable signature, and replay/revisit buttons.

3. **Seamless Shared Music**:
   - Single shared audio element that persists smoothly across all pages.
   - Strictly respects browser autoplay policies (starts only after user interaction).
   - Graceful fallback: If an audio file is missing or blocked, the site continues working flawlessly without error.

---

## 🎵 How to Add or Change Your Birthday Song

1. Place your MP3 audio file inside the `assets/music/` folder:
   ```text
   assets/music/happy-birthday.mp3
   ```
   *(A fallback file in the root directory `happy-birthday.mp3` is also supported).*
2. To change the song filename or title, open `script.js` and edit lines 17-21:
   ```javascript
   const CONFIG = {
       musicFile: "assets/music/happy-birthday.mp3",
       songTitle: "Happy Birthday Manya 🎵"
   };
   ```

---

## 📸 How to Add or Change Photos

1. All memory photos are stored in the `images/` folder (`photo1.jpeg` through `photo10.jpeg`).
2. You can replace any photo by placing your file in `images/` with the same name, or update the list in `script.js` under `GALLERY_ITEMS`:
   ```javascript
   const GALLERY_ITEMS = [
       { src: "images/photo1.jpeg", caption: "❤️", subtext:
       ...
   ];
   ```

---

## ✍️ How to Customize Your Letter and Signature

- **Signature**: On Page 7, click directly on the signature name (`Anand 🤝❤️`) in your browser to edit it live! Your change is saved automatically in your browser's local storage.
- **Letter Content**: Open `index.html` and look for `<div class="letter-body-stepper">` (around line 180) to personalize any words in the 4 paragraphs or the Read All modal.

---

## 🚀 How to Open and View

Simply double-click `index.html` to open it in any web browser (Google Chrome, Microsoft Edge, Safari, Firefox).

## 🌐 Publish the Site for Free

The site is static, so it has no build or install step. For the quickest publish:

1. Open [Netlify Drop](https://app.netlify.com/drop) and sign in or create a free account.
2. Drag the project folder containing `index.html` onto the page. Keep `style.css`, `script.js`, `images`, and `assets` in that same folder; the photos and music must be included.
3. Wait for Netlify to finish deploying, then open the public URL it provides and check the scenes, photos, and music button.
4. To publish updates, drag the same updated project folder onto the site's deploy page in Netlify.

For a Git-based Netlify deployment, import your GitHub repository and use the included `netlify.toml`. No build command is needed.

The published URL is public, so anyone with the link can view the birthday page.
