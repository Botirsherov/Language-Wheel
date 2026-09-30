---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Practice an example set on the wheel**
  Becomes usable: A running local app where a learner chooses one built-in set, spins to select words, flips a card to see its translation, marks recall, and restarts or finishes a round.
  Why now: Bootstrapping is included in this first usable behavior, and the unique spin–recall–reveal kernel is proven before adding custom-entry complexity.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Choosing a word set`, `prd.md > Spinning and checking recall`, `prd.md > Acceptance Checks`
  Spec ref: `spec.md > Main Page and Word Wheel`, `spec.md > Word Set Data`, `spec.md > Shared Practice Logic`, `spec.md > Styling and Motion`, `spec.md > File Structure`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Create the static HTML/CSS/JavaScript project files and local run path. Add built-in word sets for all three language pairs. Implement the wheel, spin selection, same-page flip card, self-assessment, round completion, restart, and finish.
  Verify (mechanical): Run `node --check app.js` and `node --check word-sets.js`; start the Python HTTP server and confirm `index.html`, `add-words.html`, `styles.css`, `app.js`, and `word-sets.js` return HTTP 200.
  Learner check: Open the local app, choose an example set, spin, reveal a translation, try both recall choices, and complete a round. Tell me what feels right or confusing.
  Commit: `Build example-set wheel practice`

- [ ] **2. Add and practice custom words**
  Becomes usable: A learner can open the separate add-words page, enter at least two word/translation pairs one at a time, see the growing list, optionally color words, start practice, and keep the active words through page navigation or refresh in the same tab.
  Why now: The example-set practice loop is already usable; this adds the second path through the product and the tab-scoped data transfer it needs without delaying proof of the kernel.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Adding custom words`, `prd.md > States and Boundaries`, `prd.md > Acceptance Checks`
  Spec ref: `spec.md > The Core Journey Through the System`, `spec.md > Custom Word Entry`, `spec.md > Shared Practice Logic`, `spec.md > Data Model`, `spec.md > Important Failure Modes`
  Build: Add `add-words.html` and connect it to the wheel with `sessionStorage`. Validate both required fields, list added entries, support optional colors, prevent starting with fewer than two words, and make the custom set use the existing practice loop.
  Verify (mechanical): Run `node --check app.js` and `node --check word-sets.js`; start the Python HTTP server and confirm both HTML pages and their shared assets return HTTP 200.
  Learner check: Add one complete pair and confirm it appears below the form; try an incomplete pair and Start with only one word; then add a second pair, start, refresh the wheel page, and verify practice still has the words in this tab.
  Commit: `Add custom word practice flow`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 1, learner tried example practice and reported it was good; requested custom-word section, which is planned in slice 2.
- [ ] Final kick-the-tires exploration and feedback completed — after slice 2, try the custom and example paths, awkward inputs, restart, and finish.

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions
