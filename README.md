# Happy Birthday Romantic Scrapbook Website 🎂💌

A romantic vintage scrapbook-style birthday website inspired by the scrapbook template, structured into 10 distinct interactive page endpoints.

## 🌟 Page Endpoints

Each slide from the template is hosted at its own endpoint:

1. **[`/index.html`](index.html)** (or `/page1.html`): **Cover Card** - Vintage scalloped card *"Happy Birthday My Love"* on red & white gingham.
2. **[`/letter.html`](letter.html)** (or `/page2.html`): **The Love Letter** - *"Dear, My Love"* emerging from an envelope on rich damask wallpaper with red lilies.
3. **[`/surprise.html`](surprise.html)** (or `/page3.html`): **Little Surprise** - Vintage postcard *"you gave me all the love i missed in this world"* & heart locket keepsake.
4. **[`/question.html`](question.html)** (or `/page4.html`): **The Question** - *"Would You Like To See It ?"* with hanging kraft tag, [Yes] button and a playful runaway [No] button.
5. **[`/yay.html`](yay.html)** (or `/page5.html`): **Yay, Finally You Are Here!** - Cute cuddling bears animation in a lace frame.
6. **[`/gifts.html`](gifts.html)** (or `/page6.html`): **Gifts Hub** - *"These are for you - Click To Open It"* with 4 clickable heart stamps leading to Scrapbook, Bouquet, Moments, and Song.
7. **[`/scrapbook.html`](scrapbook.html)** (or `/page7.html`): **Scrapbook Collage** - *"Love of my life"*, polaroid pictures, Scrabble tiles, and an interactive vintage camera with real flash.
8. **[`/flowers.html`](flowers.html)** (or `/page8.html`): **Flower Bouquet** - *"Flowers For You, My Sweetheart"* with vintage hands holding roses & interactive love note pills that pop floating hearts.
9. **[`/memories.html`](memories.html)** (or `/page9.html`): **Memories & Playlist** - *"You're So Handsome Just Like This Song"*, spinning vinyl record, vintage Samsung digicam, and photobooth film strip.
10. **[`/song.html`](song.html)** (or `/page10.html`): **The Finale & Song** - *"Song that reminds me of you"*, retro music player connected to `music.mp3`, final birthday wish letter modal, and celebratory confetti cannon!

---

## ✨ Features

- **Continuous Background Music**: The retro music pill in the top-right keeps track of `music.mp3` playback state and timestamp seamlessly across page transitions via `localStorage`.
- **Navigation Controls**: Full backward/forward navigation links, quick-jump pagination dots (1 through 10), and restart controls on all pages.
- **Pure Responsive CSS & SVG**: Crisp textures (red/white gingham, vintage damask, scalloped borders, deckle edges) formatted for mobile, tablet, and desktop screens.
- **Interactivity**:
  - Playful runaway [No] button on Page 4.
  - Camera flash effect on Page 7.
  - Floating heart bursts when clicking bouquet compliments on Page 8.
  - Interactive vinyl record player on Page 9 and custom playback scrubber on Page 10.
  - Full celebratory Confetti blast on Page 10.

---

## 🚀 Running Locally

You can open `index.html` directly in your browser, or start the local development server:

```bash
python3 server.py
# Open http://localhost:8000
```
