---
doc: spec
status: approved
---

# Word Wheel — Technical Spec

## How This Works, In Plain Language

The app is a small set of HTML, CSS, and JavaScript files that run in the learner's browser. HTML provides the main wheel page and the separate add-words page; CSS makes the colorful wheel and flip card; JavaScript responds to spins, card taps, and recall choices. The word sets for the three examples live in a JavaScript file in the project.

The browser has a short-term notebook for this site called `sessionStorage`. The app puts the current word set there when someone adds words or chooses an example. That lets the words travel between the two pages and survive a refresh in the same tab. The notebook is cleared when the tab is closed, so it is not account-based or a promise to save progress for another visit.

The pages will be served from the learner's computer using Python's built-in web server. There is no separate online server, account, database, or external service to set up. This is the smallest approach that supports the planned demo, with the tradeoff that a new tab or later visit starts fresh.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. The learner opens `index.html` through the local web server. The page draws an empty wheel with a central add sign and shows the example sets below it.
2. Choosing an example reads its words from `word-sets.js`, stores the chosen set in the current tab's `sessionStorage`, and shows the words on the wheel. Choosing the add sign opens `add-words.html`.
3. On `add-words.html`, JavaScript checks that both text fields are filled, adds each complete pair to the current tab's word list, and displays the list below the fields. **Start** copies the custom set into the active practice set and returns to `index.html`; fewer than two entries produces a warning instead.
4. On the wheel page, JavaScript chooses a word from the words still in the round, animates the wheel, and shows the word on a card. Tapping the card reveals the translation.
5. **I got it** removes the selected word from the active round; **Not yet** leaves it available. The updated round is written to `sessionStorage`, so navigating or refreshing in the tab does not lose the current round.
6. When no words remain, the page offers restart (restore the full set) or finish (clear the active round and show the empty wheel and examples).

## Stack

- **HTML** — page structure for the main wheel and custom-word entry. [MDN HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- **CSS** — responsive layout, colored wheel and segments, card flip, and spin animation. [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **Vanilla JavaScript** — interactions, input checks, wheel selection, and browser-tab storage; no framework or third-party packages. [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- **Browser `sessionStorage`** — temporary storage scoped to the same browser tab and site origin, used for the custom list and active round. It survives reloads in that tab and is normally cleared when the tab closes. [MDN sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
- **Python built-in HTTP server** — serves the static files at a local address; no application backend or package installation is required. [Python http.server](https://docs.python.org/3/library/http.server.html)

The learner agreed to this simple browser approach and left the implementation choices to the assistant where they were unfamiliar.

## Where It Runs and How Someone Tries It

- **Runs:** In a desktop browser, served from the learner's computer. No network connection is needed after the files are present.
- **Prerequisite:** Python 3 installed. No API keys, account, or package installation.
- **Start:** From the project folder, run `py -m http.server 8000` in a terminal. If the `py` command is unavailable, use `python -m http.server 8000`.
- **Open:** Visit `http://localhost:8000/` in the browser.
- **Try and record:** Choose an example set or add at least two custom word/translation pairs; spin, recall, flip, mark both outcomes, then show restart/finish. The hackathon submission still needs a short demo video and a public GitHub repository. Deployment is optional.

Serving on one local origin keeps `sessionStorage` available across the main and add-words pages; opening separate HTML files directly from disk is not the supported run path.

## Look and Feel

Carry forward `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`: use a clear, cheerful style, with the colorful wheel as the visual focus and easy-to-understand text and controls. Keep the central add sign prominent on an empty wheel; use a simple flip animation for the selected-word card. Use a readable system font and a small, coordinated palette; custom word colors can vary. These are implementation choices because the learner asked the assistant to choose an appropriate style rather than specifying particular fonts or colors.

## Components

### Main Page and Word Wheel

`index.html` hosts the empty wheel, example blocks, loaded practice wheel, selected-word card, and round-complete actions. JavaScript renders the wheel segments and selection using the active set. The card stays on the wheel page so the learner keeps the wheel context while checking a word.
PRD ref: `prd.md > Screens and Layout`, `prd.md > Choosing a word set`, `prd.md > Spinning and checking recall`.

### Custom Word Entry

`add-words.html` hosts the word and translation fields, optional color control, add action, visible list, and Start action. JavaScript rejects incomplete pairs with a warning and prevents starting with fewer than two entries.
PRD ref: `prd.md > Screens and Layout`, `prd.md > Adding custom words`, `prd.md > States and Boundaries`.

### Word Set Data

`word-sets.js` provides the ready-made English–Spanish, English–French, and English–German examples as small, static arrays of 15–20 word/translation pairs. No API or network lookup is needed.
PRD ref: `prd.md > Choosing a word set`.

### Shared Practice Logic

`app.js` reads the current page, manages adding and choosing sets, draws and spins the wheel, flips the card, applies the recall choice, handles round restart/finish, and reads/writes the tab's session data. It uses plain DOM APIs and text content for learner-provided words.
PRD ref: `prd.md > The Core Journey`, `prd.md > Features and Behavior`, `prd.md > Acceptance Checks`.

### Styling and Motion

`styles.css` holds shared responsive styles for the wheel, colored segments, add-word form, word list, flip card, feedback, and round controls.
PRD ref: `prd.md > Look and Feel`, `prd.md > Screens and Layout`.

## Data Model

Each word is a small object: `{ id, word, translation, color }`. The example word arrays are fixed in `word-sets.js`; custom entries originate in the add-word form.

The current tab stores a custom draft list and the active practice session in `sessionStorage`, serialized as JSON. The active session includes the full set (for restart), the IDs still in this round, the selected word ID (if any), whether the card has been revealed, and its source. Adding a custom entry updates the draft list; choosing **Start** establishes the active session. Marking a word updates the remaining IDs. Restart restores the full set; finish clears the active session. Because both pages use the same local server origin, they can read the same tab storage. Closing the tab clears it; there is no long-term save.

## File Structure

```text
Build with ai/
├── index.html             # Main page, example sets, and practice wheel
├── add-words.html         # Separate custom-word entry page
├── styles.css             # Shared layout, wheel, card, and responsive styling
├── word-sets.js           # Built-in essential-word pairs for three language sets
├── app.js                 # Page interactions, practice logic, and sessionStorage
└── devpost/               # Learner profile and approved planning documents
```

## External Services and Dependencies

There are no external APIs, databases, hosting services, or third-party JavaScript dependencies. The app runs locally with Python's standard-library HTTP server. Reference documentation: [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML), [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS), [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage), and [Python http.server](https://docs.python.org/3/library/http.server.html).

## Important Failure Modes

- **Incomplete custom entry** → show a clear warning; do not add the entry unless both word and translation are present.
- **Fewer than two custom words when Start is pressed** → explain that at least two words are required; remain on the add-words page.
- **No current set or a tab session cannot be read** → show the empty wheel and example choices, and explain that the learner can choose a set or add words again. Do not show success-shaped empty practice.

## What Was Simplified and Why

- **Static built-in word arrays** instead of a vocabulary API — the three examples are enough to demonstrate the loop without network dependency, keys, or service failures.
- **Browser-tab storage** instead of accounts or a database — custom words must survive page navigation and refresh for the demo, but persistent multi-visit progress is explicitly deferred.
- **Local Python web server** instead of deployment — local running is sufficient for a screen-recorded demo and avoids hosting setup.

## Decisions and Open Issues

- **Learner choice:** Accepted a simple HTML/CSS/JavaScript browser app, served locally; this uses familiar front-end concepts and avoids a backend, with no saved progress across visits.
- **Learner choice:** Delegated how temporary words should be carried between pages; browser `sessionStorage` was explained as tab-scoped storage that survives page changes and refreshes but clears when the tab closes.
- **Learner choice:** Delegated the visual design; use a cheerful, readable treatment that centers the wheel.
- **Implementation choice derived from the PRD:** Keep the flip card on the wheel page so checking a word does not take the learner away from the wheel.
- **Learner learning intention:** Wants to understand how to build useful projects with AI. The session-storage behavior is a useful concrete concept to observe when testing refresh, page navigation, and closing the tab.
- **Open for build:** Select the exact 15–20 word/translation pairs for each built-in example set.
- **Run assumption:** Python 3 is available as recommended. Verify `py` or `python` in the terminal at the beginning of the build; the standard-library server needs no installation.
