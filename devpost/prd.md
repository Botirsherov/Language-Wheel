---
doc: prd
status: approved
---

# Word Wheel — Product Requirements

A web app for people who want a simple, hands-on way to practice vocabulary with their own words or an essential-word set.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey

1. The learner opens the main page and sees an empty wheel with an add sign in its center, and titled example sets below it.
2. They either choose an example set, which loads 15–20 words onto the wheel, or use the add sign to open the separate custom-word page.
3. On the custom-word page, they enter a word and its translation, optionally choose a color, and add entries one at a time. Added words appear below the entry area. When they have at least two, they press **Start** to begin practice.
4. On the practice wheel, they spin to select a word. The selected word appears on a card; they try to recall its translation, then tap the card to flip it and reveal the translation.
5. They mark **I got it** or **Not yet**. A word marked **I got it** leaves the current round; a word marked **Not yet** remains for another turn.
6. When all words have left the wheel, the learner can restart the round or finish.

## Screens and Layout

- **Main page / wheel:** A large wheel is the visual focus. Before a set is chosen, it is empty and has an add sign at its center. Titled essential-word example blocks sit below it. Once a set is loaded, words are shown on the wheel and a spin button is available.
- **Add words page:** A separate page with fields for a word and translation, an optional color choice, an add action, and the list of words already added below the entry area. A **Start** action begins practice when enough words have been added.
- **Practice card:** The selected word appears on a card that flips when tapped to reveal the translation. The learner's recall choices are available after checking the card.
- **Round complete:** When all words have been marked correct, the learner can choose to restart with the words restored or finish the round.

## Look and Feel

Use a clear, cheerful visual style that makes the colorful wheel the focus and keeps text and controls easy to understand. The learner asked the assistant to choose a suitable style; no specific font, palette, or visual reference was requested. The learner can optionally choose colors for their own words.

## Features and Behavior

### Choosing a word set

Source: `scope.md > The Core Loop`, `scope.md > The POC Boundary`.

- The main page offers titled, ready-made essential-word examples for English–Spanish, English–French, and English–German.
- Choosing an example loads 15–20 words for that set onto the wheel. The learner can then spin.
- The learner can instead add a custom list; custom entries need only a word and its translation, with no language selection.

### Adding custom words

Source: `scope.md > The Core Loop`, `scope.md > Inspiration & Identity`.

- Each entry requires both a word and a translation. The learner may choose a color for the word.
- The learner adds entries one by one. Each added entry appears below the entry area while the add-words page remains open for the next entry.
- The learner can start practice after adding at least two words.

### Spinning and checking recall

Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`.

- Spinning selects a word from the current set and presents it on a card.
- Tapping the card flips it to show the translation.
- After checking the translation, the learner chooses **I got it** or **Not yet**.
- **I got it** removes the word from the current round. **Not yet** keeps it on the wheel for another turn.
- When every word has left the wheel, the round is complete. The learner can restart with the words restored or finish.

## States and Boundaries

- **No set selected:** Show the empty wheel with its add sign and the example blocks below.
- **Adding words:** Show each successfully added word beneath the entry area. Both word and translation are required before adding; warn the learner and do not add an incomplete entry.
- **Too few custom words:** If the learner presses **Start** with fewer than two words, warn that at least two words must be added; do not start the round.
- **Card unrevealed / revealed:** Initially show the selected word. Tapping the card reveals its translation; the learner then marks recall.
- **Round in progress:** Correctly recalled words leave the current round; words marked **Not yet** stay.
- **Round complete:** Offer restart or finish after every word has left the current round.
- **Persistence:** Accounts and saved progress are not part of this version. No progress is promised across visits.

## Acceptance Checks

- On first opening, the learner can see the empty wheel, its central add sign, and the titled example blocks.
- Choosing any ready-made set places 15–20 words on the wheel and makes spinning available.
- The add sign opens a separate page with word and translation fields and the added-word list beneath them.
- Trying to add an entry without either required field gives a warning and does not add it.
- Adding a complete entry shows it in the list. Starting with zero or one entry warns that at least two words are required and does not start practice.
- With a set loaded, spinning selects and displays one of its words. Tapping the card reveals that word's translation.
- Marking a revealed word **I got it** removes it from the current round; marking **Not yet** leaves it available for another turn.
- Once all words have left the round, restart restores the set and finish ends the round.

## Product Decisions

- Learners choose between ready-made examples and their own words; neither path is mandatory.
- The example sets contain 15–20 words and cover English–Spanish, English–French, and English–German.
- Custom words are language-agnostic: only a word and translation are required.
- Custom entries are added one at a time, shown beneath the form, and require both fields. Starting custom practice requires at least two entries.
- Words colored by the learner is optional.
- Learners self-assess after the translation is revealed; the app does not grade answers automatically.
- The learner left visual styling to the assistant, with the wheel as the visual focus.

## What We're Building

- A main page with an empty wheel, central add sign, and example-set blocks.
- Example sets of 15–20 essential words for the three agreed English language pairs.
- A separate page for adding custom word/translation pairs, with optional colors and a visible list of added entries.
- A minimum of two custom entries before starting.
- A spin, flip-to-reveal, and self-assessment loop that removes mastered words and keeps missed words in the current round.
- A round-complete choice to restart or finish.

## Deferred From the POC

- **Accounts and saved progress:** explicitly planned for a later version, not needed to demonstrate a practice round.

## Possible Later Enhancements

Accounts could let learners save progress and return to it later.

## Non-Goals

- Automatic grading of spoken or typed translations; the learner decides whether they recalled the word.
- Account creation or progress synchronized between visits; these are outside the first proof of concept.
- A language selector for custom entries; learners provide their own word and translation.

## Open Questions

- The exact words included in each ready-made set can be chosen during the build, as the learner requested.
