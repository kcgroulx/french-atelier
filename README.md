# Élan · French, for real

A focused, challenging French practice app: typed recall, listening, reading, useful corrections, and spaced review. Original design and content; no account, paid API, or server required.

**Live app:** https://kcgroulx.github.io/french-atelier/

## What is here

- Twelve short, explicit lessons spanning A1–B1-oriented grammar and everyday situations.
- Original authored exercises: translation, missing-word grammar, error correction, dictation, connected reading, and listening comprehension.
- A short starting-point check. Its recommendation is **not a validated placement test or CEFR certification**.
- Daily mixed practice, any-unit practice, due review, a harder A2–B1 challenge, and a mistake notebook.
- French typing by default, accepted authored variants, accent-specific feedback, contextual hints, and delayed repairs.
- Browser French text-to-speech with normal/slower replay, labeled synthetic speech. If unavailable, an explicit reading fallback receives no listening credit.
- Progress by unit and practice mode, local-calendar streaks, and optional daily goals. XP rewards effort, not proficiency.
- Local-only progress with versioned JSON backup/import, import validation, and confirmed reset.
- Responsive layouts, keyboard submission, character insertion, visible focus, modal focus management, screen-reader status, and reduced-motion support.

## Run locally

Node 22 or newer is recommended.

```sh
npm ci
npm run dev
```

Open the URL Vite prints. If a constrained environment disallows network-interface enumeration, run `npx vite --host 127.0.0.1` instead. To make a production build:

```sh
npm run check
npm run preview
```

The production files are in `dist/`. Vite's relative base (`./`) supports GitHub Pages project paths and other static hosting. No environment variables or secrets are required.

## Test

```sh
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

The Node suite tests content integrity, authored answers, normalization, accents, scheduler boundaries, same-day repetition, delayed recall, timezone-sensitive streaks, state import/export, and DOM interactions including audio fallback, repair grading, and persistence. The Playwright suite covers actual desktop/mobile rendering, routes, typed answers, hints, unavailable-audio fallback, and persistence using a deterministic no-voice environment. French TTS quality remains device-dependent and needs a real French system voice to hear.

CI runs the Node tests, production build, and Chromium desktop/mobile smoke tests before deploying. `.github/workflows/deploy.yml` deploys to GitHub Pages on a push to `main`; configure the repository's Pages source as **GitHub Actions**.

## How the learning logic works

This is a transparent scheduling heuristic, not a fitted memory model or an experimentally validated app:

- Wrong answer: revisit later in the same session and due again in 10 minutes.
- Hinted answer, immediate repair, or accent-only near-match: assisted practice, due in 4 hours.
- Unaided success: due in 1 day, then 3 days, then roughly 7 days, with increasing gaps capped at 90 days. Recognition expands more conservatively.
- Repeated successes within 24 hours do not inflate the spaced interval, review streak, or due date.
- “Recalled after a gap” requires successful unaided production on separate local dates at least 24 hours apart. Same-session repairs never establish retention.
- First-attempt session results exclude retries; recognition, typed production, and listening stay separate.
- Daily practice draws from the next incomplete unit and up to four due items, mixing question formats within the introduced material.

Answer checking normalizes case, ordinary punctuation, apostrophe style, and whitespace. It uses explicit accepted answers, **not an AI semantic evaluator**. Near spellings are not silently accepted as valid French. A legitimate unlisted wording may be marked incorrect; the prompt is deliberately constrained and accepted variants can be expanded in `src/content.js`.

## Casual entry screen

The requested client-side access screen uses the entry code `french101`. It is a convenience screen, **not secure authentication**: the code, static content, and source remain public and can be inspected or bypassed. Do not use it to protect private data or reuse a real password.

The open/closed flag is held in `sessionStorage`, separately from learning progress. A same-tab reload stays open; the Settings lock button closes the screen without deleting progress. The form does not send the entered code to a server. If session storage is unavailable, access lasts only until the page reloads. No GitHub repository permissions, Pages access settings, or authentication services are changed.

## Privacy and honest limits

There are no analytics, accounts, API calls, or remote progress storage. Static hosting receives ordinary page requests. Your browser or operating system may use a voice service for synthetic speech; only authored learning text is spoken. There is no microphone, audio recording, fake pronunciation score, or AI conversation simulation.

Progress lives in this browser's local storage. It does not sync across devices. Clearing site data removes it; export a backup first. Backup files can contain your typed attempts and should be treated as private. Invalid stored data is preserved under a recovery key rather than silently overwritten. Import replaces current progress only after confirmation.

A small exercise bank is **not comprehensive fluency training**. Use it alongside authentic listening, reading, conversation, and feedback from people. A1–B1 labels describe content orientation, not attained proficiency. The source and public site contain no user's private learning history.

## Research-informed design

`docs/research.md` describes the evidence and where the implementation goes beyond it. Key sources:

- [Kim & Webb (2022), L2 spacing meta-analysis](https://onlinelibrary.wiley.com/doi/abs/10.1111/lang.12479)
- [Karpicke & Roediger (2008), retrieval and delayed recall](https://doi.org/10.1126/science.1152408)
- [Shintani, Li & Ellis (2013), comprehension and production](https://onlinelibrary.wiley.com/doi/10.1111/lang.12001)
- [Webb (2009), receptive and productive learning](https://journals.sagepub.com/doi/10.1177/0033688209343854)
- [Lyster & Saito (2010), classroom corrective feedback](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/abs/oral-feedback-in-classroom-sla/4999EE1C8379B2BF026B148EAF373CA1)
- [Vandergrift & Tafaghodtari (2010), guided French listening](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9922.2009.00559.x)
- [Council of Europe (2020), CEFR Companion Volume](https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4)

Evidence supports the broad principles. It does not validate this app's exact content, ratios, intervals, or starting-point recommendation. Classroom feedback findings are an informed basis for the design, not direct proof about automatic typed feedback.

## Project map

- `src/content.js`: deterministic curriculum and accepted responses, separate from UI
- `src/core.js`: pure grading, scheduling, queue selection, and state validation
- `src/main.js`: views, interactions, speech, and persistence
- `src/style.css`: responsive design and accessibility styling
- `src/icons.js`: original inline vector interface/illustration assets
- `tests/`: regression tests and Playwright smoke suite
- `docs/research.md`: research evidence and limits

## Attribution

Linked papers and other external works retain their respective owners' rights. Dependencies retain their own licenses. This project is independent and is not affiliated with Duolingo or the Council of Europe.
