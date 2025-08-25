// Game Data
const gameData = {
  themes: {
    en: ["Name", "Country", "City", "River", "Vegetable", "Body Parts", "Sports", "Artists", "Brand"],
    it: ["Nome", "Paese", "Città", "Fiume", "Verdura", "Parti del Corpo", "Sport", "Artisti", "Marca"]
  },
  letters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "Y", "Z"],
  easyLetters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L", "M", "N", "O", "P", "R", "S", "T", "V"],
  translations: {
    en: {
      title: "Alphabet Battle",
      subtitle: "Compete with friends in this fast-paced word game!",
      addPlayer: "Add Player",
      playerName: "Player Name",
      startGame: "Start Game",
      difficulty: "Difficulty",
      easy: "Easy",
      normal: "Normal",
      round: "Round",
      letter: "Letter",
      finishRound: "Finish Round",
      nextRound: "Next Round",
      endGame: "End Game",
      results: "Round Results",
      leaderboard: "Leaderboard",
      score: "Score",
      winner: "Winner",
      playAgain: "Play Again",
      invalidAnswer: "Answer must start with the selected letter",
      roundCompleted: "Round completed by",
      finalWinner: "Game Winner"
    },
    it: {
      title: "Battaglia dell'Alfabeto",
      subtitle: "Compete con gli amici in questo gioco di parole veloce!",
      addPlayer: "Aggiungi Giocatore",
      playerName: "Nome Giocatore",
      startGame: "Inizia Gioco",
      difficulty: "Difficoltà",
      easy: "Facile",
      normal: "Normale",
      round: "Round",
      letter: "Lettera",
      finishRound: "Termina Round",
      nextRound: "Prossimo Round",
      endGame: "Fine Gioco",
      results: "Risultati Round",
      leaderboard: "Classifica",
      score: "Punteggio",
      winner: "Vincitore",
      playAgain: "Gioca Ancora",
      invalidAnswer: "La risposta deve iniziare con la lettera selezionata",
      roundCompleted: "Round completato da",
      finalWinner: "Vincitore del Gioco"
    }
  },
  scoring: {
    basePoints: 10,
    finishFirstBonus: 20,
    speedBonusMax: 10
  }
};

// Game State
let gameState = {
  currentLanguage: 'en',
  players: [],
  currentRound: 1,
  currentLetter: '',
  difficulty: 'easy',
  roundStartTime: null,
  roundFinished: false,
  roundWinner: null,
  gameStarted: false,
  timer: null
};

// Player colors
const playerColors = [
  '#1FB8CD', '#FFC185', '#B4413C', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'
];

// Initialize Game
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing game...');
  initializeEventListeners();
  updateTranslations();
  updateStartButton();
  updatePlayerCount();
});

// Event Listeners
function initializeEventListeners() {
  // Language selection
  const langEn = document.getElementById('lang-en');
  const langIt = document.getElementById('lang-it');
  
  if (langEn) {
    langEn.onclick = function() { setLanguage('en'); };
  }
  if (langIt) {
    langIt.onclick = function() { setLanguage('it'); };
  }
  
  // Player management
  const addPlayerBtn = document.getElementById('add-player-btn');
  const playerNameInput = document.getElementById('player-name-input');
  
  if (addPlayerBtn) {
    addPlayerBtn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      addPlayer();
      return false;
    };
  }
  
  if (playerNameInput) {
    playerNameInput.onkeypress = function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addPlayer();
      }
    };
  }
  
  // Game flow
  const startGameBtn = document.getElementById('start-game-btn');
  if (startGameBtn) {
    startGameBtn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Start game clicked, players:', gameState.players.length);
      if (gameState.players.length >= 2) {
        startGame();
      }
      return false;
    };
  }
  
  const nextRoundBtn = document.getElementById('next-round-btn');
  if (nextRoundBtn) {
    nextRoundBtn.onclick = function(e) {
      e.preventDefault();
      gameState.currentRound++;
      startNewRound();
    };
  }
  
  const endGameBtn = document.getElementById('end-game-btn');
  if (endGameBtn) {
    endGameBtn.onclick = function(e) {
      e.preventDefault();
      endGame();
    };
  }
  
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.onclick = function(e) {
      e.preventDefault();
      resetGame();
    };
  }
  
  // Settings
  const difficultySelect = document.getElementById('difficulty-select');
  if (difficultySelect) {
    difficultySelect.onchange = function(e) {
      gameState.difficulty = e.target.value;
      console.log('Difficulty changed to:', gameState.difficulty);
    };
  }
}

// Language Management
function setLanguage(lang) {
  console.log('Setting language to:', lang);
  gameState.currentLanguage = lang;
  
  // Update active language button
  const langEn = document.getElementById('lang-en');
  const langIt = document.getElementById('lang-it');
  
  if (langEn && langIt) {
    langEn.classList.remove('active');
    langIt.classList.remove('active');
    
    if (lang === 'en') {
      langEn.classList.add('active');
    } else {
      langIt.classList.add('active');
    }
  }
  
  updateTranslations();
}

function updateTranslations() {
  const translations = gameData.translations[gameState.currentLanguage];
  
  // Update all elements with data-translate attribute
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (key && key.startsWith('themes.')) {
      const themeIndex = parseInt(key.split('.')[1]);
      if (gameData.themes[gameState.currentLanguage][themeIndex]) {
        element.textContent = gameData.themes[gameState.currentLanguage][themeIndex];
      }
    } else if (key && translations[key]) {
      element.textContent = translations[key];
    }
  });
  
  // Update placeholders
  document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
    const key = element.getAttribute('data-translate-placeholder');
    if (key && translations[key]) {
      element.placeholder = translations[key];
    }
  });
  
  // Update select options
  document.querySelectorAll('option[data-translate]').forEach(option => {
    const key = option.getAttribute('data-translate');
    if (key && translations[key]) {
      option.textContent = translations[key];
    }
  });
}

// Player Management
function addPlayer() {
  const playerNameInput = document.getElementById('player-name-input');
  if (!playerNameInput) {
    console.error('Player name input not found');
    return;
  }
  
  const name = playerNameInput.value.trim();
  console.log('Adding player with name:', name);
  
  if (name === '') {
    alert('Please enter a player name');
    return;
  }
  if (gameState.players.length >= 6) {
    alert('Maximum 6 players allowed');
    return;
  }
  if (gameState.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    alert('Player name already exists');
    return;
  }
  
  const player = {
    id: Date.now(),
    name: name,
    color: playerColors[gameState.players.length],
    score: 0,
    answers: {},
    finished: false
  };
  
  gameState.players.push(player);
  playerNameInput.value = '';
  
  console.log('Player added, total players:', gameState.players.length);
  
  updatePlayerList();
  updateStartButton();
  updatePlayerCount();
}

function removePlayer(playerId) {
  console.log('Removing player:', playerId);
  gameState.players = gameState.players.filter(p => p.id !== playerId);
  // Reassign colors
  gameState.players.forEach((player, index) => {
    player.color = playerColors[index];
  });
  updatePlayerList();
  updateStartButton();
  updatePlayerCount();
}

function updatePlayerList() {
  const playerList = document.getElementById('player-list');
  if (!playerList) return;
  
  playerList.innerHTML = '';
  
  gameState.players.forEach(player => {
    const playerItem = document.createElement('div');
    playerItem.className = 'player-item';
    playerItem.innerHTML = `
      <div style="display: flex; align-items: center;">
        <div class="player-color" style="background-color: ${player.color}"></div>
        <span class="player-name">${player.name}</span>
      </div>
      <button type="button" class="remove-player">&times;</button>
    `;
    
    // Add event listener for remove button
    const removeBtn = playerItem.querySelector('.remove-player');
    removeBtn.onclick = function(e) {
      e.preventDefault();
      removePlayer(player.id);
    };
    
    playerList.appendChild(playerItem);
  });
}

function updatePlayerCount() {
  const playerCount = document.getElementById('player-count');
  if (playerCount) {
    playerCount.textContent = gameState.players.length;
  }
}

function updateStartButton() {
  const startGameBtn = document.getElementById('start-game-btn');
  if (!startGameBtn) return;
  
  const canStart = gameState.players.length >= 2;
  startGameBtn.disabled = !canStart;
  
  if (canStart) {
    startGameBtn.classList.remove('btn--outline');
    startGameBtn.classList.add('btn--primary');
  } else {
    startGameBtn.classList.remove('btn--primary');
    startGameBtn.classList.add('btn--outline');
  }
  
  console.log('Start button updated, can start:', canStart);
}

// Game Flow
function startGame() {
  console.log('Starting game...');
  gameState.gameStarted = true;
  gameState.currentRound = 1;
  resetPlayersScores();
  showScreen('game-screen');
  startNewRound();
}

function startNewRound() {
  console.log('Starting new round:', gameState.currentRound);
  gameState.roundFinished = false;
  gameState.roundWinner = null;
  gameState.roundStartTime = Date.now();
  
  // Reset player states
  gameState.players.forEach(player => {
    player.answers = {};
    player.finished = false;
  });
  
  // Select random letter
  const letters = gameState.difficulty === 'easy' ? gameData.easyLetters : gameData.letters;
  gameState.currentLetter = letters[Math.floor(Math.random() * letters.length)];
  
  console.log('Selected letter:', gameState.currentLetter);
  
  // Update UI
  const currentRoundEl = document.getElementById('current-round');
  const currentLetterEl = document.getElementById('current-letter');
  
  if (currentRoundEl) currentRoundEl.textContent = gameState.currentRound;
  if (currentLetterEl) currentLetterEl.textContent = gameState.currentLetter;
  
  // Create player input sections
  createPlayerSections();
  
  // Start timer
  startTimer();
  
  showScreen('game-screen');
}

function createPlayerSections() {
  const playersGrid = document.getElementById('players-grid');
  if (!playersGrid) return;
  
  playersGrid.innerHTML = '';
  
  gameState.players.forEach(player => {
    const playerSection = document.createElement('div');
    playerSection.className = 'player-section';
    playerSection.id = `player-${player.id}`;
    
    let inputsHTML = '';
    for (let i = 0; i < 9; i++) {
      inputsHTML += `
        <div class="theme-input">
          <input type="text" 
                 data-player-id="${player.id}" 
                 data-theme-index="${i}"
                 placeholder="${gameData.themes[gameState.currentLanguage][i]}"
                 autocomplete="off">
        </div>
      `;
    }
    
    playerSection.innerHTML = `
      <div class="player-header">
        <div class="player-info">
          <div class="player-avatar" style="background-color: ${player.color}">
            ${player.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4>${player.name}</h4>
            <div class="player-score">${gameData.translations[gameState.currentLanguage].score}: ${player.score}</div>
          </div>
        </div>
        <button type="button" class="btn btn--primary finish-btn">
          ${gameData.translations[gameState.currentLanguage].finishRound}
        </button>
      </div>
      <div class="player-inputs">${inputsHTML}</div>
    `;
    
    playersGrid.appendChild(playerSection);
    
    // Add event listener for finish button
    const finishBtn = playerSection.querySelector('.finish-btn');
    finishBtn.onclick = function(e) {
      e.preventDefault();
      finishRound(player.id);
    };
  });
  
  // Add input event listeners
  document.querySelectorAll('.theme-input input').forEach(input => {
    input.addEventListener('input', handleInputChange);
    input.addEventListener('keypress', handleInputKeypress);
  });
}

function handleInputChange(e) {
  const playerId = parseInt(e.target.getAttribute('data-player-id'));
  const themeIndex = parseInt(e.target.getAttribute('data-theme-index'));
  const value = e.target.value.trim();
  
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return;
  
  // Store answer
  player.answers[themeIndex] = value;
  
  // Validate answer
  const isValid = value === '' || value.toLowerCase().startsWith(gameState.currentLetter.toLowerCase());
  
  e.target.classList.remove('valid', 'invalid');
  if (value !== '') {
    e.target.classList.add(isValid ? 'valid' : 'invalid');
  }
  
  // Check if player has completed all themes
  updatePlayerCompletion(playerId);
}

function handleInputKeypress(e) {
  if (e.key === 'Enter') {
    // Move to next input
    const inputs = Array.from(document.querySelectorAll('.theme-input input'));
    const currentIndex = inputs.indexOf(e.target);
    if (currentIndex < inputs.length - 1) {
      inputs[currentIndex + 1].focus();
    }
  }
}

function updatePlayerCompletion(playerId) {
  const player = gameState.players.find(p => p.id === playerId);
  const playerSection = document.getElementById(`player-${playerId}`);
  if (!playerSection) return;
  
  const finishBtn = playerSection.querySelector('.finish-btn');
  
  const completedAnswers = Object.keys(player.answers).filter(key => 
    player.answers[key] && player.answers[key].trim() !== ''
  ).length;
  
  if (finishBtn) finishBtn.disabled = completedAnswers === 0;
  
  if (completedAnswers === 9) {
    playerSection.classList.add('completed');
  } else {
    playerSection.classList.remove('completed');
  }
}

function finishRound(playerId) {
  if (gameState.roundFinished) return;
  
  console.log('Finishing round for player:', playerId);
  
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return;
  
  player.finished = true;
  gameState.roundFinished = true;
  gameState.roundWinner = player;
  
  // Stop timer
  if (gameState.timer) {
    clearInterval(gameState.timer);
  }
  
  // Calculate scores
  calculateScores();
  
  // Show results
  setTimeout(() => {
    showResults();
  }, 500);
}

function calculateScores() {
  const roundDuration = (Date.now() - gameState.roundStartTime) / 1000; // in seconds
  
  gameState.players.forEach(player => {
    let roundScore = 0;
    
    // Base points for valid answers
    Object.keys(player.answers).forEach(themeIndex => {
      const answer = player.answers[themeIndex];
      if (answer && answer.trim() !== '' && 
          answer.toLowerCase().startsWith(gameState.currentLetter.toLowerCase())) {
        roundScore += gameData.scoring.basePoints;
      }
    });
    
    // First to finish bonus
    if (player === gameState.roundWinner) {
      roundScore += gameData.scoring.finishFirstBonus;
    }
    
    // Speed bonus (for completed answers)
    const completedAnswers = Object.keys(player.answers).filter(key => 
      player.answers[key] && player.answers[key].trim() !== ''
    ).length;
    
    if (completedAnswers > 0) {
      const speedBonus = Math.max(0, gameData.scoring.speedBonusMax - Math.floor(roundDuration / 10));
      roundScore += speedBonus;
    }
    
    player.score += roundScore;
  });
}

function showResults() {
  const roundWinner = document.getElementById('round-winner');
  if (roundWinner && gameState.roundWinner) {
    roundWinner.textContent = `${gameData.translations[gameState.currentLanguage].roundCompleted} ${gameState.roundWinner.name}`;
  }
  
  // Create answers table
  createAnswersTable();
  
  // Update leaderboard
  updateLeaderboard();
  
  showScreen('results-screen');
}

function createAnswersTable() {
  const answersGrid = document.getElementById('answers-grid');
  if (!answersGrid) return;
  
  const table = document.createElement('table');
  table.className = 'answers-table';
  
  // Header
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = '<th>Player</th>';
  gameData.themes[gameState.currentLanguage].forEach(theme => {
    headerRow.innerHTML += `<th>${theme}</th>`;
  });
  headerRow.innerHTML += '<th>Score</th>';
  table.appendChild(headerRow);
  
  // Player rows
  gameState.players.forEach(player => {
    const row = document.createElement('tr');
    row.innerHTML = `<td style="color: ${player.color}; font-weight: 500;">${player.name}</td>`;
    
    for (let i = 0; i < 9; i++) {
      const answer = player.answers[i] || '';
      const isValid = answer === '' || answer.toLowerCase().startsWith(gameState.currentLetter.toLowerCase());
      const cellClass = answer === '' ? '' : (isValid ? 'valid' : 'invalid');
      row.innerHTML += `<td class="${cellClass}">${answer}</td>`;
    }
    
    row.innerHTML += `<td style="font-weight: 500;">${player.score}</td>`;
    table.appendChild(row);
  });
  
  answersGrid.innerHTML = '';
  answersGrid.appendChild(table);
}

function updateLeaderboard() {
  const leaderboard = document.getElementById('leaderboard');
  if (!leaderboard) return;
  
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  
  leaderboard.innerHTML = '';
  
  sortedPlayers.forEach((player, index) => {
    const item = document.createElement('div');
    item.className = `leaderboard-item ${index === 0 ? 'first' : ''}`;
    
    item.innerHTML = `
      <div class="leaderboard-left">
        <div class="leaderboard-rank">${index + 1}</div>
        <div class="player-avatar" style="background-color: ${player.color}; width: 24px; height: 24px; font-size: 12px;">
          ${player.name.charAt(0).toUpperCase()}
        </div>
        <span>${player.name}</span>
      </div>
      <div class="player-score" style="font-weight: 500;">${player.score}</div>
    `;
    
    leaderboard.appendChild(item);
  });
}

function endGame() {
  const winner = [...gameState.players].sort((a, b) => b.score - a.score)[0];
  
  const finalWinner = document.getElementById('final-winner');
  if (finalWinner) {
    finalWinner.innerHTML = `
      <div class="player-avatar" style="background-color: ${winner.color}; width: 60px; height: 60px; font-size: 24px; margin: 0 auto 16px;">
        ${winner.name.charAt(0).toUpperCase()}
      </div>
      <div>${winner.name}</div>
      <div style="font-size: 18px; margin-top: 8px;">${winner.score} ${gameData.translations[gameState.currentLanguage].score.toLowerCase()}</div>
    `;
  }
  
  // Create final leaderboard
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  const finalLeaderboard = document.getElementById('final-leaderboard');
  if (finalLeaderboard) {
    finalLeaderboard.innerHTML = '';
    
    sortedPlayers.forEach((player, index) => {
      const item = document.createElement('div');
      item.className = `leaderboard-item ${index === 0 ? 'first' : ''}`;
      
      item.innerHTML = `
        <div class="leaderboard-left">
          <div class="leaderboard-rank">${index + 1}</div>
          <div class="player-avatar" style="background-color: ${player.color}; width: 24px; height: 24px; font-size: 12px;">
            ${player.name.charAt(0).toUpperCase()}
          </div>
          <span>${player.name}</span>
        </div>
        <div class="player-score" style="font-weight: 500;">${player.score}</div>
      `;
      
      finalLeaderboard.appendChild(item);
    });
  }
  
  showScreen('final-screen');
}

function resetGame() {
  // Clear any running timer
  if (gameState.timer) {
    clearInterval(gameState.timer);
  }
  
  gameState = {
    currentLanguage: gameState.currentLanguage,
    players: [],
    currentRound: 1,
    currentLetter: '',
    difficulty: 'easy',
    roundStartTime: null,
    roundFinished: false,
    roundWinner: null,
    gameStarted: false,
    timer: null
  };
  
  const playerList = document.getElementById('player-list');
  const playerCount = document.getElementById('player-count');
  const playerNameInput = document.getElementById('player-name-input');
  const difficultySelect = document.getElementById('difficulty-select');
  
  if (playerList) playerList.innerHTML = '';
  if (playerCount) playerCount.textContent = '0';
  if (playerNameInput) playerNameInput.value = '';
  if (difficultySelect) difficultySelect.value = 'easy';
  
  updateStartButton();
  showScreen('welcome-screen');
}

function resetPlayersScores() {
  gameState.players.forEach(player => {
    player.score = 0;
  });
}

function startTimer() {
  let seconds = 0;
  const timerDisplay = document.getElementById('timer-display');
  
  gameState.timer = setInterval(() => {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (timerDisplay) {
      timerDisplay.textContent = 
        `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
}