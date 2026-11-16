// Sound effects and background music
const Sound = (() => {
  let audioContext = null;
  let isMusicMuted = false;
  let isSfxMuted = false;
  let themeAudio = null;
  let finalThemeActive = false;

  function getContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
  }

  function playTone(frequency, duration, type, volume) {
    if (isSfxMuted) return;
    if (!type) type = 'sine';
    if (!volume) volume = 0.06;
    try {
      const ctx = getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  function playChord(frequencies, duration, type, volume) {
    if (isSfxMuted) return;
    if (!type) type = 'sine';
    if (!volume) volume = 0.05;
    try {
      const ctx = getContext();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      masterGain.connect(ctx.destination);
      
      frequencies.forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(masterGain);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      });
    } catch (e) {}
  }

  function playClick() {
    playTone(600, 0.06, 'sine', 0.05);
  }

  function playCorrect() {
    playChord([523.25, 659.25, 783.99], 0.2, 'sine', 0.08);
    setTimeout(() => playChord([659.25, 783.99, 1046.50], 0.25, 'sine', 0.08), 180);
    setTimeout(() => playChord([783.99, 1046.50, 1318.51], 0.3, 'sine', 0.08), 360);
  }

  function playWrong() {
    stopMusic();
    playChord([293.66, 349.23], 0.4, 'triangle', 0.06);
    setTimeout(() => playChord([261.63, 311.13], 0.5, 'triangle', 0.06), 250);
  }

  function playNext() {
    playTone(600, 0.06, 'sine', 0.05);
    setTimeout(() => playTone(800, 0.06, 'sine', 0.05), 70);
  }

  function playWin() {
    stopMusic();
    try { if (themeAudio) { themeAudio.pause(); themeAudio.currentTime = 0; } } catch (e) {}
    
    var notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    for (var i = 0; i < notes.length; i++) {
      (function(freq, delay) {
        setTimeout(function() {
          playTone(freq, 0.15, 'triangle', 0.08);
        }, delay);
      })(notes[i], i * 100);
    }
    setTimeout(function() {
      playChord([523.25, 659.25, 783.99, 1046.50], 0.3, 'sine', 0.1);
    }, 800);
    setTimeout(function() {
      playChord([659.25, 783.99, 1046.50, 1318.51], 0.4, 'sine', 0.12);
    }, 1100);
    setTimeout(function() {
      playChord([783.99, 1046.50, 1318.51, 1567.98], 0.6, 'sine', 0.15);
    }, 1500);
  }

  function playLose() {
    stopMusic();
    playChord([293.66, 349.23], 0.5, 'sawtooth', 0.06);
    setTimeout(() => playChord([261.63, 311.13], 0.6, 'sawtooth', 0.06), 300);
  }

  function playFifty() {
    playTone(400, 0.08, 'triangle', 0.06);
    setTimeout(() => playTone(300, 0.08, 'triangle', 0.06), 80);
  }

  function playHint() {
    playTone(500, 0.12, 'triangle', 0.06);
    setTimeout(() => playTone(600, 0.12, 'triangle', 0.06), 100);
  }

  function playAudience() {
    playTone(300, 0.08, 'sine', 0.06);
    setTimeout(() => playTone(400, 0.08, 'sine', 0.06), 60);
    setTimeout(() => playTone(500, 0.08, 'sine', 0.06), 120);
  }

  function stopMusic() {
    finalThemeActive = false;
    if (themeAudio) {
      themeAudio.pause();
      themeAudio.currentTime = 0;
    }
  }

  // Intense theme played once at the final question
  function playIntense() {
    stopMusic();
    finalThemeActive = true;
    if (isMusicMuted) return;
    try {
      initThemeAudio();
      if (themeAudio) {
        themeAudio.loop = false;
        themeAudio.currentTime = 0;
        themeAudio.volume = 0.12;
        themeAudio.play().catch(function() {});
      }
    } catch (e) {}
  }

  function initThemeAudio() {
    if (!themeAudio) {
      try {
        themeAudio = new Audio('audio/theme.mp3');
        themeAudio.volume = 0.1;
      } catch (e) {}
    }
  }

  function resumeContext() {
    try {
      var ctx = getContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
    } catch (e) {}
    if (!themeAudio) {
      initThemeAudio();
    }
  }

  function toggleMusic() {
    isMusicMuted = !isMusicMuted;
    if (isMusicMuted) {
      if (themeAudio) themeAudio.pause();
    } else if (finalThemeActive) {
      initThemeAudio();
      themeAudio.play().catch(function() {});
    }
    return isMusicMuted;
  }

  function toggleSfx() {
    isSfxMuted = !isSfxMuted;
    return isSfxMuted;
  }

  function isMusicOn() {
    return !isMusicMuted;
  }

  function isSfxOn() {
    return !isSfxMuted;
  }

  function initOnInteraction() {
    var resumeOnce = function() {
      resumeContext();
      document.removeEventListener('click', resumeOnce);
      document.removeEventListener('touchstart', resumeOnce);
      document.removeEventListener('keydown', resumeOnce);
    };
    document.addEventListener('click', resumeOnce);
    document.addEventListener('touchstart', resumeOnce);
    document.addEventListener('keydown', resumeOnce);
  }

  return {
    playClick: playClick,
    playCorrect: playCorrect,
    playWrong: playWrong,
    playNext: playNext,
    playWin: playWin,
    playLose: playLose,
    playFifty: playFifty,
    playHint: playHint,
    playAudience: playAudience,
    stopMusic: stopMusic,
    playIntense: playIntense,
    resumeContext: resumeContext,
    initOnInteraction: initOnInteraction,
    toggleMusic: toggleMusic,
    toggleSfx: toggleSfx,
    isMusicOn: isMusicOn,
    isSfxOn: isSfxOn
  };
})();
