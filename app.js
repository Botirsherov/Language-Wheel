(function () {
  "use strict";

  const STORAGE_KEY = "wordWheel.activeSession";
  const SEGMENT_COLORS = ["#f6b66b", "#91d8c0", "#9f9bf0", "#f28f9d", "#8dc9e8", "#f0d56f"];
  const wheel = document.getElementById("wheel");
  const wheelLabels = document.getElementById("wheel-labels");
  const spinButton = document.getElementById("spin-button");
  const addWordsLink = document.getElementById("add-words-link");
  const examplesSection = document.getElementById("examples-section");
  const exampleSets = document.getElementById("example-sets");
  const wheelMessage = document.getElementById("wheel-message");
  const practicePanel = document.getElementById("practice-panel");
  const completePanel = document.getElementById("complete-panel");
  const wordCard = document.getElementById("word-card");
  const cardWord = document.getElementById("card-word");
  const cardTranslation = document.getElementById("card-translation");
  const cardHint = document.getElementById("card-hint");
  const recallActions = document.getElementById("recall-actions");
  const recallMessage = document.getElementById("recall-message");
  let activeSession = readSession();
  let spinTimer;

  function readSession() {
    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      wheelMessage.textContent = "This tab could not restore its practice. Choose an example set to start again.";
      return null;
    }
  }

  function saveSession() {
    try {
      if (activeSession) {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(activeSession));
      } else {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      wheelMessage.textContent = "This tab could not save the round. Keep this page open while practicing.";
    }
  }

  function makeWords(entries, sourceId) {
    return entries.map(function (entry, index) {
      return {
        id: sourceId + "-" + index,
        word: entry[0],
        translation: entry[1],
        color: entry[2] || SEGMENT_COLORS[index % SEGMENT_COLORS.length]
      };
    });
  }

  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function renderExamples() {
    exampleSets.innerHTML = "";
    window.WORD_SETS.forEach(function (set) {
      const button = document.createElement("button");
      button.className = "example-card";
      button.type = "button";
      button.innerHTML =
        '<span class="example-swatch" aria-hidden="true"></span>' +
        '<span class="example-card-copy"><strong>' + escapeText(set.title) + "</strong>" +
        "<small>" + escapeText(set.description) + "</small></span>" +
        '<span class="example-arrow" aria-hidden="true">→</span>';
      button.addEventListener("click", function () {
        startSession(makeWords(set.words, set.id), set.id);
      });
      exampleSets.appendChild(button);
    });
  }

  function startSession(words, source) {
    activeSession = {
      source: source,
      words: words,
      remainingIds: words.map(function (word) { return word.id; }),
      selectedId: null,
      revealed: false
    };
    saveSession();
    render();
    wheel.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderWheel() {
    wheelLabels.innerHTML = "";
    if (!activeSession || activeSession.remainingIds.length === 0) {
      wheel.style.background = "conic-gradient(#f3f1ff 0deg 360deg)";
      wheel.style.transform = "rotate(0deg)";
      wheel.setAttribute("aria-label", "An empty vocabulary wheel");
      addWordsLink.hidden = false;
      spinButton.hidden = true;
      return;
    }

    const visibleWords = activeSession.words.filter(function (word) {
      return activeSession.remainingIds.indexOf(word.id) !== -1;
    });
    const segmentSize = 360 / visibleWords.length;
    const stops = [];
    const radius = 37;
    visibleWords.forEach(function (word, index) {
      const start = index * segmentSize;
      const end = start + segmentSize;
      const color = word.color || SEGMENT_COLORS[index % SEGMENT_COLORS.length];
      stops.push(escapeText(color) + " " + start + "deg " + end + "deg");

      const centerAngle = (start + segmentSize / 2 - 90) * Math.PI / 180;
      const label = document.createElement("span");
      label.className = "wheel-label";
      label.textContent = word.word;
      label.style.left = (50 + radius * Math.cos(centerAngle)) + "%";
      label.style.top = (50 + radius * Math.sin(centerAngle)) + "%";
      wheelLabels.appendChild(label);
    });

    wheel.style.background = "conic-gradient(" + stops.join(", ") + ")";
    wheel.setAttribute("aria-label", "Vocabulary wheel with " + visibleWords.length + " remaining words");
    addWordsLink.hidden = true;
    spinButton.hidden = false;
  }

  function renderCard() {
    const selectedWord = activeSession && activeSession.words.find(function (word) {
      return word.id === activeSession.selectedId;
    });
    if (!selectedWord) {
      practicePanel.hidden = true;
      return;
    }

    practicePanel.hidden = false;
    cardWord.textContent = selectedWord.word;
    cardTranslation.textContent = selectedWord.translation;
    wordCard.classList.toggle("is-flipped", activeSession.revealed);
    wordCard.setAttribute("aria-pressed", activeSession.revealed ? "true" : "false");
    wordCard.setAttribute("aria-label", activeSession.revealed ? "Translation revealed" : "Reveal translation");
    cardTranslation.setAttribute("aria-hidden", activeSession.revealed ? "false" : "true");
    cardHint.textContent = activeSession.revealed
      ? "Choose how well you remembered the translation."
      : "Take a moment to remember it, then tap the card.";
    recallActions.hidden = !activeSession.revealed;
  }

  function render() {
    const complete = Boolean(activeSession && activeSession.remainingIds.length === 0);
    const hasSession = Boolean(activeSession);
    practicePanel.hidden = true;
    completePanel.hidden = !complete;
    examplesSection.hidden = hasSession;
    wheelMessage.textContent = "";
    recallMessage.textContent = "";
    renderWheel();
    if (!complete) {
      renderCard();
    }
  }

  function spin() {
    if (!activeSession || activeSession.remainingIds.length === 0 || spinButton.disabled) {
      return;
    }
    const availableWords = activeSession.words.filter(function (word) {
      return activeSession.remainingIds.indexOf(word.id) !== -1;
    });
    const selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    const selectedIndex = availableWords.findIndex(function (word) {
      return word.id === selectedWord.id;
    });
    const center = selectedIndex * (360 / availableWords.length) + 180 / availableWords.length;
    const currentRotation = Number(wheel.dataset.rotation || "0");
    const normalizedCurrent = ((currentRotation % 360) + 360) % 360;
    const targetRemainder = (360 - center) % 360;
    const additionalRotation = ((targetRemainder - normalizedCurrent + 360) % 360) + 360 * 5;
    const finalRotation = currentRotation + additionalRotation;

    spinButton.disabled = true;
    activeSession.selectedId = selectedWord.id;
    activeSession.revealed = false;
    wheel.dataset.rotation = finalRotation + "";
    wheel.style.transform = "rotate(" + finalRotation + "deg)";
    Array.prototype.forEach.call(wheelLabels.children, function (label) {
      label.style.setProperty("--counter-rotation", (-finalRotation) + "deg");
    });
    saveSession();
    window.clearTimeout(spinTimer);
    spinTimer = window.setTimeout(function () {
      spinButton.disabled = false;
      renderCard();
    }, 2800);
  }

  function revealCard() {
    if (!activeSession || !activeSession.selectedId) {
      return;
    }
    activeSession.revealed = true;
    saveSession();
    renderCard();
  }

  function markRecall(gotIt) {
    if (!activeSession || !activeSession.revealed || !activeSession.selectedId) {
      return;
    }
    if (gotIt) {
      activeSession.remainingIds = activeSession.remainingIds.filter(function (id) {
        return id !== activeSession.selectedId;
      });
    }
    activeSession.selectedId = null;
    activeSession.revealed = false;
    saveSession();
    render();
  }

  function restartRound() {
    if (!activeSession) {
      return;
    }
    activeSession.remainingIds = activeSession.words.map(function (word) { return word.id; });
    activeSession.selectedId = null;
    activeSession.revealed = false;
    wheel.dataset.rotation = "0";
    saveSession();
    render();
  }

  function finishRound() {
    activeSession = null;
    wheel.dataset.rotation = "0";
    saveSession();
    render();
  }

  spinButton.addEventListener("click", spin);
  wordCard.addEventListener("click", revealCard);
  document.getElementById("got-it-button").addEventListener("click", function () { markRecall(true); });
  document.getElementById("not-yet-button").addEventListener("click", function () { markRecall(false); });
  document.getElementById("restart-button").addEventListener("click", restartRound);
  document.getElementById("finish-button").addEventListener("click", finishRound);

  renderExamples();
  render();
}());
