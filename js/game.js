window.Game = (() => {
  const MONEY_STEPS = [
    100, 200, 300, 500, 1000,
    2000, 4000, 8000, 16000, 32000,
    64000, 125000, 250000, 500000, 1000000
  ];

  const SAFE_HAVENS = [4, 9, 14];

  const HYPE_LEVELS = [
    { min: 0, title: 'Alustaja', message: 'Iga teekond algab esimesest sammust.' },
    { min: 1, title: 'Õpipoiss', message: 'Head algust! Jätkates saab paremaks.' },
    { min: 3, title: 'Kesktasemel', message: 'Juba mitu õiget vastust! Edasi!' },
    { min: 5, title: '1000 punkti meister!', message: 'Sa jõudsid esimese turvalise sadama! Väga tubli!' },
    { min: 8, title: 'Tugev mängija', message: 'Oled ületanud enamiku mängijaid!' },
    { min: 10, title: '32 000 punkti tšempion!', message: 'Teine turvaline sadam on käes! Oled väga osav!' },
    { min: 12, title: 'Erakordne!', message: 'Väga lähedal lõppvõidule! Jätka samas vaimus!' },
    { min: 14, title: 'Pensionifondi lähedal!', message: 'Vahet enne viimast küsimust! Sa võid selle teha!' },
    { min: 15, title: 'MILJONÄR!', message: 'Uskumatu! Sa oled võitnud 1 000 000 punkti! Oled tõeline koodikangelane!' }
  ];

  let state = null;

  function init() {
    state = {
      questions: [],
      currentIndex: 0,
      score: 0,
      answered: false,
      lifelines: {
        fifty: true,
        hint: true,
        audience: true
      },
      removedOptions: [],
      usedHint: false
    };
    return state;
  }

  function startGame(questions) {
    init();
    state.questions = questions;
    state.currentIndex = 0;
    state.score = 0;
    return getCurrentQuestion();
  }

  function getCurrentQuestion() {
    if (state.currentIndex >= state.questions.length) return null;
    return {
      question: state.questions[state.currentIndex].question,
      options: state.questions[state.currentIndex].options,
      correctIndex: state.questions[state.currentIndex].correctIndex,
      hint: state.questions[state.currentIndex].hint,
      explanations: state.questions[state.currentIndex].explanations,
      questionNumber: state.currentIndex + 1,
      totalQuestions: state.questions.length
    };
  }

  function getCurrentMoney() {
    return MONEY_STEPS[state.currentIndex] || 0;
  }

  function getSafeHavenMoney() {
    for (let i = state.currentIndex - 1; i >= 0; i--) {
      if (SAFE_HAVENS.includes(i)) {
        return MONEY_STEPS[i];
      }
    }
    return 0;
  }

  function getFinalMoney() {
    if (state.currentIndex >= MONEY_STEPS.length) {
      return MONEY_STEPS[MONEY_STEPS.length - 1];
    }
    return getCurrentMoney();
  }

  function getHypeLevel() {
    const questionsAnswered = state.currentIndex;
    let hype = HYPE_LEVELS[0];
    for (let i = HYPE_LEVELS.length - 1; i >= 0; i--) {
      if (questionsAnswered >= HYPE_LEVELS[i].min) {
        hype = HYPE_LEVELS[i];
        break;
      }
    }
    return hype;
  }

  function answerQuestion(selectedIndex) {
    if (state.answered) return null;

    const question = state.questions[state.currentIndex];
    const isCorrect = selectedIndex === question.correctIndex;

    state.answered = true;

    if (isCorrect) {
      state.score = MONEY_STEPS[state.currentIndex];
      state.currentIndex++;
      state.answered = false;
      state.removedOptions = [];
      state.usedHint = false;
    }

    return {
      isCorrect,
      selectedIndex,
      correctIndex: question.correctIndex,
      explanations: question.explanations || [],
      options: question.options,
      question: question.question,
      currentMoney: state.score,
      isGameWon: state.currentIndex >= state.questions.length,
      hypeLevel: getHypeLevel()
    };
  }

  function useFifty() {
    if (!state.lifelines.fifty) return null;
    state.lifelines.fifty = false;

    const question = state.questions[state.currentIndex];
    const correctIndex = question.correctIndex;

    const wrongIndices = [0, 1, 2, 3].filter(i => i !== correctIndex);
    const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
    const toRemove = shuffled.slice(0, 2);

    state.removedOptions = toRemove;
    return toRemove;
  }

  function useHint() {
    if (!state.lifelines.hint) return null;
    state.lifelines.hint = false;
    const question = state.questions[state.currentIndex];
    return question.hint || 'Vihje puudub.';
  }

  function useAudience() {
    if (!state.lifelines.audience) return null;
    state.lifelines.audience = false;

    const question = state.questions[state.currentIndex];
    const correctIndex = question.correctIndex;
    const level = question.level || 1;

    let percentages = new Array(4).fill(0);
    if (level <= 5) {
      const correctP = 40 + Math.floor(Math.random() * 35);
      percentages[correctIndex] = correctP;
      let remaining = 100 - correctP;
      for (let i = 0; i < 4; i++) {
        if (i === correctIndex) continue;
        const share = i === 3 ? remaining : Math.floor(Math.random() * remaining);
        percentages[i] = share;
        remaining -= share;
      }
    } else if (level <= 10) {
      const correctP = 25 + Math.floor(Math.random() * 35);
      percentages[correctIndex] = correctP;
      let remaining = 100 - correctP;
      for (let i = 0; i < 4; i++) {
        if (i === correctIndex) continue;
        const share = i === 3 ? remaining : Math.floor(Math.random() * remaining);
        percentages[i] = share;
        remaining -= share;
      }
    } else {
      const correctP = 15 + Math.floor(Math.random() * 30);
      percentages[correctIndex] = correctP;
      let remaining = 100 - correctP;
      for (let i = 0; i < 4; i++) {
        if (i === correctIndex) continue;
        const share = i === 3 ? remaining : Math.floor(Math.random() * remaining);
        percentages[i] = share;
        remaining -= share;
      }
    }

    return percentages.map((p, i) => ({ label: String.fromCharCode(65 + i), percent: p }));
  }

  function getMoneyLadder() {
    return MONEY_STEPS.map((amount, index) => ({
      amount,
      index,
      isCurrent: index === state.currentIndex,
      isPassed: index < state.currentIndex,
      isSafe: SAFE_HAVENS.includes(index)
    })).reverse();
  }

  function getLifelinesStatus() {
    return {
      fifty: state.lifelines.fifty,
      hint: state.lifelines.hint,
      audience: state.lifelines.audience
    };
  }

  function getTimeLimit() {
    var idx = state.currentIndex;
    if (idx < 5) return 30;
    if (idx < 10) return 45;
    return 60;
  }

  function getState() {
    return {
      currentIndex: state.currentIndex,
      removedOptions: state.removedOptions,
      lifelines: state.lifelines
    };
  }

  return {
    startGame,
    getCurrentQuestion,
    getCurrentMoney,
    getSafeHavenMoney,
    getFinalMoney,
    getHypeLevel,
    answerQuestion,
    useFifty,
    useHint,
    useAudience,
    getMoneyLadder,
    getLifelinesStatus,
    getTimeLimit,
    getState
  };
})();
