window.App = (() => {
  const main = document.getElementById('main-content');

  function esc(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  let currentTaskId = null;
  let questionBank = [];
  let currentQuestions = [];
  let timerInterval = null;
  let timerValue = 0;
  let timerTotal = 0;
  let answerLocked = false;

  function init() {
    renderMenu();

    Sound.initOnInteraction();

    var musicBtn = document.getElementById('music-toggle');
    if (musicBtn) {
      musicBtn.addEventListener('click', function() {
        Sound.resumeContext();
        var isMuted = Sound.toggleMusic();
        musicBtn.classList.toggle('muted', isMuted);
        musicBtn.textContent = isMuted ? '🔇' : '🎵';
      });
    }

    var sfxBtn = document.getElementById('sfx-toggle');
    if (sfxBtn) {
      sfxBtn.addEventListener('click', function() {
        Sound.resumeContext();
        var isMuted = Sound.toggleSfx();
        sfxBtn.classList.toggle('muted', isMuted);
        sfxBtn.textContent = isMuted ? '🔇' : '🔊';
      });
    }
  }

  function renderMenu() {
    stopTimer();
    Sound.stopBackgroundMusic();

    if (window.location.protocol === 'file:') {
      main.innerHTML = `
        <div class="menu-screen">
          <h2>Viga: Faili protokoll</h2>
          <p>See rakendus ei tööta otse failina avatult (<code>file://</code>).</p>
          <p>Käivita kohalik server:</p>
          <pre>python3 -m http.server 8080</pre>
          <p>ja ava <a href="http://localhost:8080">http://localhost:8080</a></p>
        </div>
      `;
      return;
    }

    Tasks.loadTaskList().then(tasks => {
      main.innerHTML = `
        <div class="menu-screen">
          <h2>Vali ülesanne</h2>
          <div class="task-list">
            ${tasks.map(task => `
              <div class="task-card" data-task-id="${esc(task.id)}">
                <div class="task-id">${esc(task.id)}</div>
                <div class="task-name">${esc(task.name)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      main.querySelectorAll('.task-card').forEach(card => {
        card.addEventListener('click', function() {
          var taskId = card.dataset.taskId;
          startGame(taskId);
        });
      });
    }).catch(error => {
      main.innerHTML = `<div class="menu-screen"><h2>Ülesannete laadimine ebaõnnestus</h2><p>${esc(error.message)}</p><button class="menu-btn" onclick="location.reload()">Proovi uuesti</button></div>`;
    });
  }

  function startGame(taskId) {
    currentTaskId = taskId;
    answerLocked = false;
    main.innerHTML = '<div class="menu-screen"><h2>Laen küsimusi...</h2></div>';

    Promise.all([Tasks.loadTaskFiles(taskId), Questions.loadQuestionBank(taskId)]).then(async ([files, questions]) => {
      questionBank = questions;
      if (questionBank.length === 0) {
        main.innerHTML = `
          <div class="menu-screen">
            <h2>Viga</h2>
            <p>Selle ülesande jaoks ei leitud küsimustepanka.</p>
            <button class="menu-btn" onclick="location.reload()">Tagasi menüüsse</button>
          </div>
        `;
        return;
      }

      currentQuestions = await QuestionProvider.generate({files, bank: questionBank});
      Game.startGame(currentQuestions);
      renderGame();
    }).catch(error => {
      main.textContent = 'Mängu ei saanud käivitada: ' + error.message;
    });
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startTimer(seconds) {
    stopTimer();
    timerTotal = seconds;
    timerValue = seconds;
    updateTimerBar();
    timerInterval = setInterval(function() {
      timerValue--;
      updateTimerBar();
      if (timerValue <= 0) {
        stopTimer();
        handleTimeout();
      }
    }, 1000);
  }

  function updateTimerBar() {
    var bar = document.getElementById('timer-bar-fill');
    var text = document.getElementById('timer-text');
    if (!bar || !text) return;
    var pct = (timerValue / timerTotal) * 100;
    bar.style.width = pct + '%';
    text.textContent = timerValue + 's';
    if (timerValue <= 5) {
      bar.style.background = '#f44336';
    } else if (timerValue <= 10) {
      bar.style.background = '#ff9800';
    } else {
      bar.style.background = '#4caf50';
    }
  }

  function handleTimeout() {
    if (answerLocked) return;
    handleAnswer(-1);
  }

  function renderGame() {
    var q = Game.getCurrentQuestion();
    if (!q) {
      renderWin();
      return;
    }

    answerLocked = false;
    Sound.resumeContext();
    Sound.startBackgroundMusic();

    if (q.questionNumber === q.totalQuestions) {
      Sound.playIntense();
    }

    var ladder = Game.getMoneyLadder();
    var lifelines = Game.getLifelinesStatus();
    var state = Game.getState();
    var removed = state.removedOptions || [];
    var timeLimit = Game.getTimeLimit();

    main.innerHTML = `
      <div class="game-screen active">
        <div class="timer-bar">
          <div class="timer-bar-fill" id="timer-bar-fill"></div>
          <span class="timer-text" id="timer-text">${timeLimit}s</span>
        </div>

        <div class="game-header">
          <div class="score">${Game.getCurrentMoney()} punkti</div>
          <div class="question-counter">Küsimus ${q.questionNumber} / ${q.totalQuestions}</div>
          <button class="quit-btn" id="quit-btn">Loobu</button>
        </div>

        <div class="money-ladder">
          ${ladder.map(step => `
            <div class="step ${step.isCurrent ? 'current' : ''} ${step.isPassed ? 'passed' : ''} ${step.isSafe ? 'safe' : ''}">
              ${step.amount.toLocaleString()} ${step.isSafe ? '★' : ''}
            </div>
          `).join('')}
        </div>

        <div class="lifelines">
          <button class="lifeline-btn" id="lifeline-fifty" ${!lifelines.fifty ? 'disabled' : ''}>50:50</button>
          <button class="lifeline-btn" id="lifeline-hint" ${!lifelines.hint ? 'disabled' : ''}>Vihje</button>
          <button class="lifeline-btn" id="lifeline-audience" ${!lifelines.audience ? 'disabled' : ''}>Küsi publikult</button>
        </div>

        <div class="question-area">
          <div class="question-text">${esc(q.question)}</div>
          <div class="options-grid">
            ${q.options.map((opt, i) => `
              <button class="option-btn" data-index="${i}" ${removed.includes(i) ? 'disabled' : ''}>
                <span class="option-label">${String.fromCharCode(65 + i)}</span>
                <span class="option-text">${esc(opt)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="result-screen" id="result-screen">
        <div class="result-panel">
          <h2 id="result-title"></h2>
          <div class="result-question" id="result-question"></div>
          <div class="explanation-list" id="explanation-list"></div>
          <button class="next-btn" id="next-btn" style="display:none;">Järgmine küsimus</button>
          <button class="restart-btn" id="restart-btn" style="display:none;">Mängi uuesti</button>
          <button class="menu-btn" id="menu-btn" style="display:none;">Tagasi menüüsse</button>
        </div>
      </div>

      <div class="audience-modal" id="audience-modal">
        <div class="audience-panel">
          <h3>Publiku hääletus</h3>
          <div class="audience-bars" id="audience-bars"></div>
          <button class="audience-close" id="audience-close">Sulge</button>
        </div>
      </div>
    `;

    startTimer(timeLimit);

    main.querySelector('#quit-btn').addEventListener('click', function() {
      if (confirm('Kas oled kindel, et soovid mängu pooleli jätta?')) {
        stopTimer();
        renderMenu();
      }
    });

    main.querySelectorAll('.option-btn:not(:disabled)').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (answerLocked) return;
        var idx = parseInt(btn.dataset.index);
        handleAnswer(idx);
      });
    });

    main.querySelector('#lifeline-fifty').addEventListener('click', function() {
      var removed = Game.useFifty();
      if (removed) {
        Sound.playFifty();
        renderGame();
      }
    });

    main.querySelector('#lifeline-hint').addEventListener('click', function() {
      var hint = Game.useHint();
      if (hint) {
        Sound.playHint();
        var qArea = main.querySelector('.question-area');
        var hintEl = qArea.querySelector('.hint-display');
        if (!hintEl) {
          hintEl = document.createElement('div');
          hintEl.className = 'hint-display';
          qArea.appendChild(hintEl);
        }
        hintEl.textContent = 'Vihje: ' + hint;
      }
    });

    main.querySelector('#lifeline-audience').addEventListener('click', function() {
      var results = Game.useAudience();
      if (results) {
        Sound.playAudience();
        var modal = main.querySelector('#audience-modal');
        var bars = main.querySelector('#audience-bars');
        bars.innerHTML = results.map(function(r) {
          return '<div class="audience-bar">' +
            '<span class="bar-label">' + r.label + '</span>' +
            '<div class="bar-track">' +
              '<div class="bar-fill" style="width:' + r.percent + '%">' + r.percent + '%</div>' +
            '</div>' +
            '<span class="bar-percent">' + r.percent + '%</span>' +
          '</div>';
        }).join('');
        modal.classList.add('active');
        main.querySelector('#audience-close').addEventListener('click', function() {
          modal.classList.remove('active');
        });
      }
    });
  }

  function handleAnswer(selectedIndex) {
    answerLocked = true;
    stopTimer();

    var result = Game.answerQuestion(selectedIndex);
    if (!result) return;

    var resultScreen = main.querySelector('#result-screen');
    var title = main.querySelector('#result-title');
    var qText = main.querySelector('#result-question');
    var expList = main.querySelector('#explanation-list');
    var nextBtn = main.querySelector('#next-btn');
    var restartBtn = main.querySelector('#restart-btn');
    var menuBtn = main.querySelector('#menu-btn');

    resultScreen.classList.add('active');

    if (result.isGameWon) {
      Sound.playWin();
      title.className = 'correct-title win-title';
      title.textContent = 'MILJONÄR! Palju õnne!';
      qText.innerHTML =
        '<div class="win-hype">' +
          '<h3>' + result.hypeLevel.title + '</h3>' +
          '<p>' + result.hypeLevel.message + '</p>' +
        '</div>' +
        '<p class="win-message">Vastasid kõigile küsimustele õigesti!</p>';
      expList.innerHTML = '';
      nextBtn.style.display = 'none';
      restartBtn.style.display = 'block';
      menuBtn.style.display = 'block';

      restartBtn.addEventListener('click', function() { startGame(currentTaskId); });
      menuBtn.addEventListener('click', renderMenu);
      return;
    }

    if (result.isCorrect) {
      Sound.playCorrect();
      title.className = 'correct-title';
      title.textContent = 'Õige vastus!';
    } else {
      Sound.playWrong();
      title.className = 'wrong-title';
      title.textContent = 'Vale vastus!';
    }

    qText.textContent = result.question;

    expList.innerHTML = result.explanations.map(function(exp, i) {
      var isCorrect = i === result.correctIndex;
      var isSelected = i === result.selectedIndex;
      var cls = isCorrect ? 'correct-explanation' : 'wrong-explanation';
      var label = String.fromCharCode(65 + i);
      if (isCorrect) label += ' (õige)';
      if (isSelected && !isCorrect) label += ' (sinu valik)';
      return '<div class="explanation-item ' + cls + '">' +
        '<div class="exp-label">' + label + '</div>' +
        '<div>' + esc(exp) + '</div>' +
      '</div>';
    }).join('');

    if (result.isCorrect) {
      nextBtn.style.display = 'block';
      restartBtn.style.display = 'none';
      menuBtn.style.display = 'none';
      nextBtn.addEventListener('click', function() {
        Sound.playNext();
        resultScreen.classList.remove('active');
        renderGame();
      });
    } else {
      nextBtn.style.display = 'none';
      restartBtn.style.display = 'block';
      menuBtn.style.display = 'block';

      var safeMoney = Game.getSafeHavenMoney();
      var hype = result.hypeLevel;
      qText.innerHTML =
        esc(result.question) +
        '<div class="loss-hype">' +
          '<h4>' + hype.title + '</h4>' +
          '<p>' + hype.message + '</p>' +
        '</div>' +
        '<br><strong>Lõppscore: ' + safeMoney.toLocaleString() + ' punkti</strong>';

      restartBtn.addEventListener('click', function() { startGame(currentTaskId); });
      menuBtn.addEventListener('click', renderMenu);
    }
    if (selectedIndex === -1) {
      qText.innerHTML = '<p>Aeg sai läbi!</p>' + qText.innerHTML;
    }
  }

  function renderWin() {
    stopTimer();
    Sound.stopBackgroundMusic();
    var hype = Game.getHypeLevel();
    main.innerHTML = `
      <div class="win-screen active">
        <div class="win-panel">
          <h2>MILJONÄR!</h2>
          <div class="win-hype">
            <h3>${hype.title}</h3>
            <p>${hype.message}</p>
          </div>
          <p>Sa vastasid kõigile 15 küsimusele õigesti!</p>
          <div class="final-score">1 000 000 punkti</div>
          <button class="restart-btn" id="win-restart">Mängi uuesti</button>
          <button class="menu-btn" id="win-menu">Tagasi menüüsse</button>
        </div>
      </div>
    `;
    main.querySelector('#win-restart').addEventListener('click', function() { startGame(currentTaskId); });
    main.querySelector('#win-menu').addEventListener('click', renderMenu);
  }

  document.addEventListener('DOMContentLoaded', init);

  return { init: init };
})();
