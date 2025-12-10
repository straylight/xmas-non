const btn = document.getElementById('checkBtn');
const terminalBody = document.getElementById('terminalBody');

// State: tracks if user has already been naughty once
let wasNaughty = false;
let lockedNaughty = false;
let wasNice = false;
let snowmanMode = false;
let isAnimating = false;

// NPM-style spinner frames
const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

// Cookie helpers
function setCookie(name, value, days = 30) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax`;
}

function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let c of ca) {
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}

const CHRISTMAS_CRIMES = [
  'Sneaking a peek at presents early',
  'Eating Santa\'s cookie before midnight',
  'Re-gifting last year\'s mystery mug',
  'Hiding the last candy cane',
  'Singing carols way off-key (with gusto!)',
  'Wearing pajamas to the holiday dinner',
  'Using gift wrap as a cape',
  'Starting the playlist before everyone\'s ready',
  'Accidentally spoiling the surprise',
  'Putting ornaments all on one branch',
  'Trying to guess every present out loud',
  'Taking the comfiest seat by the fireplace',
  'Taking a software developer\'s fun sweater',
  'Snagging the best slice of pie',
  'Leaving glitter everywhere (festive chaos!)',
  'Claiming "taste test" on the frosting',
  'Humming Jingle Bells on repeat',
  'Decorating the pet (with consent)',
  'Saving the wrapping paper "for crafts later"',
  'Sneaking extra marshmallows in the cocoa',
  'Accidentally mixing up gift tags',
  'Turning the thermostat up for cozy vibes',
  'Queueing the longest holiday movie',
  'Taking a power nap mid-decorating',
  'Wearing the sweater with blinking lights',
  'Photobombing the family picture',
  'Building a tiny snowman on the porch',
  'Practicing sleigh bell sound effects',
  'Stretching "five more minutes" in bed',
  'Borrowing Santa\'s hat for selfies',
  'Rearranging ornaments for "aesthetic"',
  'Double-dipping the cookie in milk',
  'Saving the last cinnamon roll (strategically)',
  'Replacing fruitcake with brownies (allegedly)',
  'Using the gift bow as a hair accessory',
  'Choosing the sparkliest tinsel',
  'Waving at neighbors like carolers-in-training',
  'Starting a snowflake collection on the coat sleeve',
  'Taking extra time to admire the lights',
  'Calling dibs on the coziest blanket',
  'Testing all the candles to find the best scent',
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Terminal helper functions
function clearTerminal() {
  terminalBody.innerHTML = '';
}

function addLine(text, className = '') {
  const line = document.createElement('div');
  line.className = 'terminal-line' + (className ? ' ' + className : '');
  line.innerHTML = text;
  terminalBody.appendChild(line);
  return line;
}

function addPromptLine(command) {
  return addLine(`<span class="prompt">$</span> ${command}`);
}

// Animated spinner that resolves after duration
function showSpinner(text, duration = 1500) {
  return new Promise(resolve => {
    const line = addLine(`<span class="spinner">${spinnerFrames[0]}</span> ${text}`);
    const spinnerEl = line.querySelector('.spinner');
    let frame = 0;
    
    const interval = setInterval(() => {
      frame = (frame + 1) % spinnerFrames.length;
      spinnerEl.textContent = spinnerFrames[frame];
    }, 80);
    
    setTimeout(() => {
      clearInterval(interval);
      resolve(line);
    }, duration);
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Render functions that output to terminal
async function renderNice() {
  clearTerminal();
  addPromptLine('npx check-naughty-nice --user');
  
  const spinnerLine = await showSpinner('Checking Santa\'s list...', 1500);
  spinnerLine.innerHTML = '<span class="success">✓</span> Check complete!';
  
  await delay(300);
  addLine('');
  addLine('========================================', 'success');
  addLine('  Result: NICE', 'success');
  addLine('========================================', 'success');
  addLine('');
  addLine('Warm cocoa and cozy cheer - carry on, holiday hero!');
  addLine('');
  addPromptLine('_');
  
  replaceWithSpreadJoyButton();
}

async function renderNaughtyFirst() {
  const crime = pickRandom(CHRISTMAS_CRIMES);
  
  clearTerminal();
  addPromptLine('npx check-naughty-nice --user');
  
  const spinnerLine = await showSpinner('Checking Santa\'s list...', 1500);
  spinnerLine.innerHTML = '<span class="error">✗</span> Uh oh...';
  
  await delay(300);
  addLine('');
  addLine('========================================', 'error');
  addLine('  Result: NAUGHTY', 'error');
  addLine('========================================', 'error');
  addLine('');
  addLine('Holiday mischief detected:', 'error');
  addLine(`> ${crime}`, 'error');
  addLine('');
  addLine('Tap again and we\'ll have to escalate...');
  addLine('');
  addPromptLine('_');
  
  setCookie('xmas_state', JSON.stringify({ wasNaughty: true, lockedNaughty: false }));
}

async function renderNaughtyLocked() {
  clearTerminal();
  addPromptLine('npx check-naughty-nice --user --verify');
  
  const spinnerLine = await showSpinner('Double-checking records...', 1800);
  spinnerLine.innerHTML = '<span class="error">✗</span> Confirmed!';
  
  await delay(300);
  addLine('');
  addLine('========================================', 'error');
  addLine('  Result: SUPER NAUGHTY', 'error');
  addLine('========================================', 'error');
  addLine('');
  addLine('You\'re officially on the permanent list.', 'error');
  addLine('Maybe try spreading some joy instead?');
  addLine('');
  addPromptLine('_');
  
  btn.disabled = true;
  btn.textContent = 'Locked';
  btn.className = 'btn';
  
  if (!document.getElementById('joyBtn')) {
    const buttonRow = document.createElement('div');
    buttonRow.className = 'button-row';
    const joyBtn = document.createElement('button');
    joyBtn.id = 'joyBtn';
    joyBtn.className = 'btn-secondary';
    joyBtn.textContent = 'Spread Joy';
    joyBtn.addEventListener('click', handleSpreadJoy);
    
    const container = btn.closest('.container');
    container.insertBefore(buttonRow, btn);
    buttonRow.appendChild(btn);
    buttonRow.appendChild(joyBtn);
  }
  
  setCookie('xmas_state', JSON.stringify({ wasNaughty: true, lockedNaughty: true }));
}

async function renderSpreadJoy() {
  clearTerminal();
  addPromptLine('npx spread-holiday-joy --snowflakes');
  
  const spinnerLine = await showSpinner('Generating snowflakes...', 1000);
  spinnerLine.innerHTML = '<span class="success">✓</span> Joy activated!';
  
  await delay(200);
  addLine('');
  addLine('========================================', 'success');
  addLine('  Spreading Holiday Cheer!', 'success');
  addLine('========================================', 'success');
  addLine('');
  addLine('Keep clicking to make it snow!');
  addLine('');
  addPromptLine('_');
  
  for (let i = 0; i < 20; i++) {
    setTimeout(() => spawnSnowflake(), i * 40);
  }
}

function renderMoreSnow() {
  // Just spawn more snowflakes without changing the terminal message
  for (let i = 0; i < 25; i++) {
    setTimeout(() => spawnSnowflake(), i * 30);
  }
}

function spawnSnowflake() {
  const flake = document.createElement('div');
  flake.className = 'snowflake';
  flake.textContent = ['❄', '❅', '❆'][Math.floor(Math.random() * 3)];
  flake.style.left = Math.random() * 100 + 'vw';
  flake.style.animationDuration = (2 + Math.random() * 3) + 's';
  flake.style.animationDelay = Math.random() * 0.5 + 's';
  flake.style.fontSize = (12 + Math.random() * 20) + 'px';
  flake.style.opacity = 0.6 + Math.random() * 0.4;
  document.body.appendChild(flake);
  setTimeout(() => flake.remove(), 5500);
}

function replaceWithSpreadJoyButton() {
  const existingRow = document.querySelector('.button-row');
  if (existingRow) {
    btn.parentElement.insertBefore(btn, existingRow);
    existingRow.remove();
  }
  
  btn.className = 'btn-secondary';
  btn.textContent = 'Spread Joy';
  btn.disabled = false;
}

async function handleSpreadJoy() {
  if (isAnimating) return;
  
  if (!snowmanMode) {
    isAnimating = true;
    snowmanMode = true;
    await renderSpreadJoy();
    isAnimating = false;
    setCookie('xmas_state', JSON.stringify({ wasNaughty, lockedNaughty, wasNice, snowmanMode: true }));
  } else {
    renderMoreSnow();
  }
}

async function handleClick() {
  if (isAnimating) return;
  
  // Snowman mode: spawn snowflakes on every click
  if (snowmanMode) {
    renderMoreSnow();
    return;
  }
  
  // If nice and clicking again, enter snowman mode
  if (wasNice) {
    isAnimating = true;
    snowmanMode = true;
    btn.className = 'btn-secondary';
    btn.textContent = 'Spread Joy';
    await renderSpreadJoy();
    isAnimating = false;
    setCookie('xmas_state', JSON.stringify({ wasNaughty: false, lockedNaughty: false, wasNice: true, snowmanMode: true }));
    return;
  }
  
  // If already flagged naughty once, second click locks it
  if (wasNaughty && !lockedNaughty) {
    isAnimating = true;
    lockedNaughty = true;
    await renderNaughtyLocked();
    isAnimating = false;
    return;
  }

  // Otherwise decide randomly
  isAnimating = true;
  const isNaughty = Math.random() < 0.5;
  if (isNaughty) {
    wasNaughty = true;
    await renderNaughtyFirst();
  } else {
    wasNice = true;
    await renderNice();
    setCookie('xmas_state', JSON.stringify({ wasNaughty: false, lockedNaughty: false, wasNice: true, snowmanMode: false }));
  }
  isAnimating = false;
}

btn.addEventListener('click', handleClick);

// Restore state from cookie on load
try {
  const saved = getCookie('xmas_state');
  if (saved) {
    const parsed = JSON.parse(saved);
    wasNaughty = !!parsed.wasNaughty;
    lockedNaughty = !!parsed.lockedNaughty;
    wasNice = !!parsed.wasNice;
    snowmanMode = !!parsed.snowmanMode;
    
    if (lockedNaughty) {
      renderNaughtyLocked();
    } else if (wasNaughty) {
      renderNaughtyFirst();
    } else if (snowmanMode) {
      btn.className = 'btn-secondary';
      btn.textContent = 'Spread Joy';
      clearTerminal();
      addPromptLine('npx spread-holiday-joy --resume');
      addLine('<span class="success">✓</span> Welcome back!');
      addLine('');
      addLine('Spreading Holiday Cheer!', 'success');
      addLine('Keep clicking to make it snow!');
      addLine('');
      addPromptLine('_');
    } else if (wasNice) {
      renderNice();
    }
  }
} catch (_) {
  // Ignore cookie parse errors
}

// ============================================
// Snow Canvas Background
// ============================================
(function() {
  const canvas = document.getElementById('snowCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const gridSize = 32;
  const baseRadius = 1.5;
  
  let baseOpacity = 0.3;
  let opacityDirection = 1;
  let driftOffsetY = 0;
  let driftOffsetX = 0;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  function draw(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    driftOffsetY = (timestamp / 120) % gridSize;
    driftOffsetX = (timestamp / 400) % gridSize;
    
    baseOpacity += opacityDirection * 0.0008;
    if (baseOpacity >= 0.45) opacityDirection = -1;
    if (baseOpacity <= 0.15) opacityDirection = 1;
    
    ctx.fillStyle = `rgba(255, 255, 255, ${baseOpacity})`;
    
    const cols = Math.ceil(canvas.width / gridSize) + 1;
    const rows = Math.ceil(canvas.height / gridSize) + 2;
    
    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols + 1; col++) {
        const x = col * gridSize + driftOffsetX;
        const y = row * gridSize + driftOffsetY;
        
        ctx.beginPath();
        ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    requestAnimationFrame(draw);
  }
  
  window.addEventListener('resize', resize);
  
  resize();
  requestAnimationFrame(draw);
})();
