# Biblioteca de las Rosas

An offline Spanish reading library: tap a sentence for its translation, explanation and audio; tap a word for its definition, part of speech, lemma, example and a Save button. Includes chapter quizzes that unlock the next chapter, a vocabulary notebook, an offline tutor, a progress dashboard and settings.

**Status of the Android APK: not built.** The environment this app was written in has no Android SDK and cannot reach Google's build servers, so no APK exists yet. The Android project is generated and ready; the steps below build it.

## Folder layout

| Path | What it is |
|---|---|
| `www/` | The whole app (HTML, CSS, JS, fonts, icons, service worker) |
| `src/` | Source copies of the story and lexicon files |
| `tools/build.py` | Regenerates `www/sw.js` and `www/version.json` after any change |
| `tools/check.js`, `tools/extract.js` | Check that every story word has a definition |
| `tests/` | Playwright tests (`smoke.py`, `full.py`, `offline.py`) |
| `capacitor/` | Capacitor config and the generated Android project |
| `.github/workflows/build-apk.yml` | Builds a debug APK in GitHub's cloud |

## Option A: install as an app from the browser (no build, works now)

1. Put the contents of `www/` on any static host (GitHub Pages works).
2. Open the page in Chrome on your Android phone.
3. Open the Chrome menu and choose **Add to Home screen** (or **Install app**).
4. Open it once while online so the service worker caches everything. After that it runs with no connection.

## Option B: build the APK in the browser with GitHub Actions

1. Create a **new, separate** GitHub repository and upload this whole folder (drag and drop in the GitHub web page).
2. Open the **Actions** tab, choose **Build debug APK**, and press **Run workflow**.
3. When it finishes, open the run and download the artifact `biblioteca-de-las-rosas-debug-apk`. Unzip it to get `app-debug.apk`.

## Installing the APK on Android

1. Send `app-debug.apk` to your phone (Drive, email or USB).
2. Open it. If Android asks, allow installs from that source (Files or Chrome) in Settings.
3. Install and open **Biblioteca de las Rosas**.

## Option C: build on a computer with Android Studio

1. Install Node and Android Studio.
2. In `capacitor/`, run `npm install`, then `npx cap sync android`, then `npx cap open android`.
3. Choose **Build > Build APK(s)**.

## Updating the app

After changing anything in `www/`, bump `APP_VERSION` in `www/js/core.js`, run `python3 tools/build.py`, and rebuild. Installed copies show a "new version available" banner when `version.json` changes (online hosting only; the APK gets updates by installing a new APK).

## The library (v1.1.0)

12 books, A1 to C2: Book 1 "La familia del reino de las rosas" (12 chapters), plus 11 shorter books of 2 to 3 chapters each. Every chapter has a quiz with reading questions written by hand and vocabulary, sentence, matching, fill-in and writing questions generated from the chapter's own text.

To add a book, copy the pattern in `www/data/book3.js` (each line is `Spanish ## English ## optional note`, with hand-written `qs` reading questions), add every new word to `www/data/lexicon3.js`, run `node tools/check.js` until it reports nothing missing, bump `APP_VERSION`, and run `python3 tools/build.py`.

## Known limits

- Chapters are short: about 100 to 300 words for most books, not 800 to 1500.
- Only Book 1 has more than 3 chapters. Higher levels (B1 to C2) have 2 books or fewer each.
- The tutor is rule-based and works offline. No AI API is connected.
- Spoken audio uses the phone's Spanish text-to-speech voice. If none is installed, install one in Android's text-to-speech settings.
