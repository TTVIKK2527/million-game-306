window.Questions = (() => {
  function loadQuestionBank(taskId) {
    return new Promise((resolve) => {
      fetch(`questions/${taskId}.json`)
        .then(res => {
          if (!res.ok) throw new Error('Küsimustepanka ei leitud');
          return res.json();
        })
        .then(bank => resolve(bank))
        .catch(e => {
          console.error('Viga küsimuste laadimisel:', e);
          resolve([]);
        });
    });
  }

  function selectQuestions(bank, count) {
    if (count !== undefined && count !== 15) throw new Error('Mäng vajab 15 küsimust.');
    if (!Array.isArray(bank)) throw new Error('Vigane küsimustepank.');
    for (const q of bank) {
      if (!Number.isInteger(q.level) || q.level < 1 || q.level > 15 || typeof q.question !== 'string'
          || !Array.isArray(q.options) || q.options.length !== 4 || q.options.some(x => typeof x !== 'string' || !x.trim())
          || new Set(q.options).size !== 4 || !Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3
          || !Array.isArray(q.explanations) || q.explanations.length !== 4) throw new Error('Vigane küsimus pangas.');
    }
    var selected = [];
    for (const [low, high] of [[1, 5], [6, 10], [11, 15]]) {
      const group = bank.filter(q => q.level >= low && q.level <= high);
      if (group.length < 5) throw new Error('Igas raskusastmes peab olema vähemalt 5 küsimust.');
      selected = selected.concat(shuffleArray(group).slice(0, 5).sort((a, b) => a.level - b.level));
    }

    selected = selected.map(function(q) {
      var copy = {};
      for (var k in q) { copy[k] = q[k]; }
      copy.options = q.options.slice();
      copy.explanations = q.explanations.slice();

      var indices = [0, 1, 2, 3];
      for (var i = 3; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = indices[i]; indices[i] = indices[j]; indices[j] = tmp;
      }
      copy.options = indices.map(function(idx) { return q.options[idx]; });
      copy.explanations = indices.map(function(idx) { return q.explanations[idx]; });
      copy.correctIndex = indices.indexOf(q.correctIndex);
      return copy;
    });

    return selected;
  }

  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  return { loadQuestionBank, selectQuestions };
})();
