const btn = document.getElementById('checkBtn');
const result = document.getElementById('result');

// State: tracks if user has already been naughty once
let wasNaughty = false;
let lockedNaughty = false; // becomes true after second click post-naughty
let wasNice = false; // becomes true after first nice result
let snowmanMode = false; // becomes true after clicking while nice

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

// Cute, safe-for-work Christmas "crimes" (few dozen)
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
  'Snagging the best slice of pie',
  'Leaving glitter everywhere (festive chaos!)',
  'Claiming “taste test” on the frosting',
  'Humming Jingle Bells on repeat',
  'Decorating the pet (with consent)',
  'Saving the wrapping paper “for crafts later”',
  'Sneaking extra marshmallows in the cocoa',
  'Accidentally mixing up gift tags',
  'Turning the thermostat up for cozy vibes',
  'Queueing the longest holiday movie',
  'Taking a power nap mid-decorating',
  'Wearing the sweater with blinking lights',
  'Photobombing the family picture',
  'Building a tiny snowman on the porch',
  'Practicing sleigh bell sound effects',
  'Stretching “five more minutes” in bed',
  'Borrowing Santa\'s hat for selfies',
  'Rearranging ornaments for “aesthetic”',
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

function renderNice() {
  document.querySelector('.subtitle')?.classList.add('hidden');
  result.classList.remove('hidden');
  result.innerHTML = `
    <div class="result-header nice">Nice ✅</div>
    <div class="result-content">
      <p>Warm cocoa and cozy cheer—carry on, holiday hero! ✨</p>
    </div>
  `;
  // Replace button with spread joy (green)
  replaceWithSpreadJoyButton();
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
  
  // Remove after animation completes
  setTimeout(() => flake.remove(), 5500);
}

function renderNaughtyFirst() {
  document.querySelector('.subtitle')?.classList.add('hidden');
  const crime = pickRandom(CHRISTMAS_CRIMES);
  result.classList.remove('hidden');
  result.innerHTML = `
    <div class="result-header naughty">Naughty ❄️</div>
    <div class="result-content">
      <p>Uh oh! Holiday mischief detected: <strong>${crime}</strong>.</p>
      <p>Tap again and we\'ll have to escalate... 🎄</p>
    </div>
  `;
  // Persist state: naughty flagged
  setCookie('xmas_state', JSON.stringify({ wasNaughty: true, lockedNaughty: false }));
}

function renderNaughtyLocked() {
  document.querySelector('.subtitle')?.classList.add('hidden');
  result.classList.remove('hidden');
  result.innerHTML = `
    <div class="result-header naughty">Super Naughty 🎅📜</div>
    <div class="result-content">
      <p>You\'re officially on the permanent list. Coal-free, but noted! 😉</p>
      <p>Maybe try spreading some joy instead?</p>
    </div>
  `;
  // Disable main button
  btn.disabled = true;
  btn.textContent = 'Locked 🔒';
  btn.className = 'btn';
  
  // Add spread joy button next to it
  if (!document.getElementById('joyBtn')) {
    const buttonRow = document.createElement('div');
    buttonRow.className = 'button-row';
    const joyBtn = document.createElement('button');
    joyBtn.id = 'joyBtn';
    joyBtn.className = 'btn-secondary';
    joyBtn.textContent = '⛄ Spread Joy';
    joyBtn.addEventListener('click', activateSnowmanMode);
    
    btn.parentElement.insertBefore(buttonRow, btn);
    buttonRow.appendChild(btn);
    buttonRow.appendChild(joyBtn);
  }
  
  // Persist state: permanently naughty
  setCookie('xmas_state', JSON.stringify({ wasNaughty: true, lockedNaughty: true }));
}

function activateSnowmanMode() {
  if (!snowmanMode) {
    snowmanMode = true;
    result.innerHTML = `
      <div class="result-header nice">Spreading Holiday Cheer! ❄️</div>
      <div class="result-content">
        <p>Keep clicking to make it snow! ⛄</p>
      </div>
    `;
    for (let i = 0; i < 20; i++) {
      setTimeout(() => spawnSnowflake(), i * 40);
    }
  }
  // Spawn snowflakes on each click
  for (let i = 0; i < 25; i++) {
    setTimeout(() => spawnSnowflake(), i * 30);
  }
}

function replaceWithSpreadJoyButton() {
  // Remove any existing button setup first
  const existingRow = document.querySelector('.button-row');
  if (existingRow) {
    btn.parentElement.insertBefore(btn, existingRow);
    existingRow.remove();
  }
  
  // Replace the main button with spread joy
  btn.className = 'btn-secondary';
  btn.textContent = '⛄ Spread Joy';
  btn.disabled = false;
  btn.onclick = activateSnowmanMode;
}

function handleClick() {
  // Snowman mode: spawn snowflakes on every click
  if (snowmanMode) {
    for (let i = 0; i < 25; i++) {
      setTimeout(() => spawnSnowflake(), i * 30);
    }
    return;
  }
  
  // If nice and clicking again, enter snowman mode
  if (wasNice) {
    snowmanMode = true;
    btn.textContent = '⛄ Spread Joy';
    result.innerHTML = `
      <div class="result-header nice">Spreading Holiday Cheer! ❄️</div>
      <div class="result-content">
        <p>Keep clicking to make it snow! ⛄</p>
      </div>
    `;
    setCookie('xmas_state', JSON.stringify({ wasNaughty: false, lockedNaughty: false, wasNice: true, snowmanMode: true }));
    for (let i = 0; i < 20; i++) {
      setTimeout(() => spawnSnowflake(), i * 40);
    }
    return;
  }
  
  // If already flagged naughty once, second click locks it
  if (wasNaughty && !lockedNaughty) {
    lockedNaughty = true;
    renderNaughtyLocked();
    return;
  }

  // Otherwise decide randomly
  const isNaughty = Math.random() < 0.5; // 50/50
  if (isNaughty) {
    wasNaughty = true;
    renderNaughtyFirst();
  } else {
    wasNice = true;
    renderNice();
    // Persist state: nice
    setCookie('xmas_state', JSON.stringify({ wasNaughty: false, lockedNaughty: false, wasNice: true, snowmanMode: false }));
  }
}

btn.addEventListener('click', handleClick);

// Optional: subtle snow overlay
const snow = document.createElement('div');
snow.className = 'snow';
document.body.appendChild(snow);

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
      btn.textContent = '⛄ Spread Joy';
      result.classList.remove('hidden');
      result.innerHTML = `
        <div class="result-header nice">Spreading Holiday Cheer! ❄️</div>
        <div class="result-content">
          <p>Keep clicking to make it snow! ⛄</p>
        </div>
      `;
    } else if (wasNice) {
      // Show nice state only if previously saved
      renderNice();
    }
  }
} catch (_) {
  // Ignore cookie parse errors
}
