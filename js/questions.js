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
    if (!count) count = 15;
    var shuffled = shuffleArray([...bank]);
    var selected = shuffled.slice(0, Math.min(count, shuffled.length));

    selected.sort(function(a, b) { return (a.level || 1) - (b.level || 1); });

    if (selected.length < count) {
      var remaining = bank.filter(function(q) { return selected.indexOf(q) === -1; });
      var extra = shuffleArray(remaining).slice(0, count - selected.length);
      selected = selected.concat(extra);
      selected.sort(function(a, b) { return (a.level || 1) - (b.level || 1); });
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
