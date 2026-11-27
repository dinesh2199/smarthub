/**
 * Workspace definitions & client-side scripts for Other Tools (4 tools)
 */

module.exports = {
  // 36. Stopwatch
  "stopwatch": {
    extraHead: ``,
    renderWorkspace: () => `
      <div style="display:flex; flex-direction:column; align-items:center; max-width:600px; margin:0 auto;">
        <div class="timer-display" id="sw-display">00:00:00.00</div>

        <div class="timer-controls">
          <button class="btn btn-lg btn-primary" id="btn-sw-start" style="min-width:130px;">
            Start
          </button>
          <button class="btn btn-lg btn-secondary" id="btn-sw-lap" style="min-width:110px;" disabled>
            Lap
          </button>
          <button class="btn btn-lg btn-secondary" id="btn-sw-reset" style="min-width:110px;" disabled>
            Reset
          </button>
        </div>

        <div class="result-box" style="width:100%; margin-top:1.5rem;" id="sw-laps-box">
          <div class="result-header">
            <span class="result-title">Recorded Laps</span>
            <span class="badge badge-primary" id="sw-lap-count">0 Laps</span>
          </div>

          <div id="sw-laps-empty" style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.875rem;">
            No split laps recorded yet. Press "Lap" while running.
          </div>

          <div id="sw-laps-list" style="display:none; max-height:220px; overflow-y:auto;">
            <table class="calc-table" id="sw-table">
              <thead>
                <tr>
                  <th>Lap #</th>
                  <th>Split Time</th>
                  <th style="text-align:right;">Total Elapsed</th>
                </tr>
              </thead>
              <tbody id="sw-tbody"></tbody>
            </table>
          </div>
        </div>
      </div>
    `,
    script: `
      let startTime = 0;
      let elapsedTime = 0;
      let timerInterval = null;
      let isRunning = false;
      let laps = [];
      let lastLapTime = 0;

      const display = document.getElementById('sw-display');
      const btnStart = document.getElementById('btn-sw-start');
      const btnLap = document.getElementById('btn-sw-lap');
      const btnReset = document.getElementById('btn-sw-reset');
      const lapsEmpty = document.getElementById('sw-laps-empty');
      const lapsList = document.getElementById('sw-laps-list');
      const tbody = document.getElementById('sw-tbody');
      const lapCount = document.getElementById('sw-lap-count');

      btnStart.addEventListener('click', () => {
        if (!isRunning) {
          startTime = performance.now() - elapsedTime;
          timerInterval = setInterval(updateTimer, 10);
          isRunning = true;
          btnStart.textContent = 'Pause';
          btnStart.classList.remove('btn-primary');
          btnStart.classList.add('btn-secondary');
          btnLap.disabled = false;
          btnReset.disabled = false;
        } else {
          clearInterval(timerInterval);
          isRunning = false;
          btnStart.textContent = 'Resume';
          btnStart.classList.remove('btn-secondary');
          btnStart.classList.add('btn-primary');
          btnLap.disabled = true;
        }
      });

      btnLap.addEventListener('click', () => {
        if (!isRunning) return;
        const currentElapsed = elapsedTime;
        const split = currentElapsed - lastLapTime;
        lastLapTime = currentElapsed;

        laps.unshift({
          lapNumber: laps.length + 1,
          split: formatTime(split),
          total: formatTime(currentElapsed)
        });

        renderLaps();
      });

      btnReset.addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
        startTime = 0;
        elapsedTime = 0;
        lastLapTime = 0;
        laps = [];
        display.textContent = '00:00:00.00';
        btnStart.textContent = 'Start';
        btnStart.classList.remove('btn-secondary');
        btnStart.classList.add('btn-primary');
        btnLap.disabled = true;
        btnReset.disabled = true;
        renderLaps();
      });

      function updateTimer() {
        elapsedTime = performance.now() - startTime;
        display.textContent = formatTime(elapsedTime);
      }

      function formatTime(ms) {
        const totalHundredths = Math.floor(ms / 10);
        const hundredths = totalHundredths % 100;
        const totalSeconds = Math.floor(ms / 1000);
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours = Math.floor(totalSeconds / 3600);

        return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds) + '.' + pad(hundredths);
      }

      function pad(num) {
        return num < 10 ? '0' + num : num;
      }

      function renderLaps() {
        lapCount.textContent = laps.length + ' Laps';
        if (laps.length === 0) {
          lapsEmpty.style.display = 'block';
          lapsList.style.display = 'none';
          return;
        }

        lapsEmpty.style.display = 'none';
        lapsList.style.display = 'block';
        tbody.innerHTML = laps.map(l => \`
          <tr>
            <td><strong>Lap \${l.lapNumber}</strong></td>
            <td style="color:var(--primary); font-family:monospace;">+\${l.split}</td>
            <td style="text-align:right; font-family:monospace;">\${l.total}</td>
          </tr>
        \`).join('');
      }
    `
  },

  // 37. Countdown Timer
  "timer": {
    extraHead: ``,
    renderWorkspace: () => `
      <div style="display:flex; flex-direction:column; align-items:center; max-width:600px; margin:0 auto;">
        <div id="timer-inputs-row" style="display:flex; gap:1rem; align-items:center; margin-bottom:1.5rem;">
          <div style="text-align:center;">
            <input type="number" class="form-control" id="tm-h" min="0" max="99" value="0" style="width:75px; text-align:center; font-size:1.5rem; font-weight:700;">
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">HOURS</span>
          </div>
          <span style="font-size:2rem; font-weight:800; color:var(--text-muted);">:</span>
          <div style="text-align:center;">
            <input type="number" class="form-control" id="tm-m" min="0" max="59" value="5" style="width:75px; text-align:center; font-size:1.5rem; font-weight:700;">
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">MINUTES</span>
          </div>
          <span style="font-size:2rem; font-weight:800; color:var(--text-muted);">:</span>
          <div style="text-align:center;">
            <input type="number" class="form-control" id="tm-s" min="0" max="59" value="0" style="width:75px; text-align:center; font-size:1.5rem; font-weight:700;">
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">SECONDS</span>
          </div>
        </div>

        <div class="quick-tags" style="margin-bottom:1.5rem;">
          <button class="btn btn-sm btn-secondary tm-preset" data-sec="60">+1 Min</button>
          <button class="btn btn-sm btn-secondary tm-preset" data-sec="300">+5 Min</button>
          <button class="btn btn-sm btn-secondary tm-preset" data-sec="600">+10 Min</button>
          <button class="btn btn-sm btn-secondary tm-preset" data-sec="1500">+25 Min (Pomodoro)</button>
        </div>

        <div class="timer-display" id="tm-countdown-disp">00:05:00</div>

        <div style="width:100%; height:8px; background:var(--border-color); border-radius:4px; overflow:hidden; margin-bottom:2rem;">
          <div id="tm-progress-bar" style="width:100%; height:100%; background:var(--primary); transition:width 0.2s;"></div>
        </div>

        <div class="timer-controls">
          <button class="btn btn-lg btn-primary" id="btn-tm-start" style="min-width:130px;">
            Start Timer
          </button>
          <button class="btn btn-lg btn-secondary" id="btn-tm-reset" style="min-width:110px;">
            Reset
          </button>
        </div>
      </div>
    `,
    script: `
      let initialTotalSec = 300;
      let remainingSec = 300;
      let timerTicker = null;
      let isTimerRunning = false;

      const inH = document.getElementById('tm-h');
      const inM = document.getElementById('tm-m');
      const inS = document.getElementById('tm-s');
      const disp = document.getElementById('tm-countdown-disp');
      const progressBar = document.getElementById('tm-progress-bar');
      const btnStart = document.getElementById('btn-tm-start');
      const btnReset = document.getElementById('btn-tm-reset');

      function syncInputsToSeconds() {
        const h = parseInt(inH.value) || 0;
        const m = parseInt(inM.value) || 0;
        const s = parseInt(inS.value) || 0;
        initialTotalSec = (h * 3600) + (m * 60) + s;
        remainingSec = initialTotalSec;
        renderDisp();
      }

      [inH, inM, inS].forEach(el => el.addEventListener('input', () => {
        if (!isTimerRunning) syncInputsToSeconds();
      }));

      document.querySelectorAll('.tm-preset').forEach(btn => {
        btn.addEventListener('click', () => {
          if (isTimerRunning) return;
          const sec = parseInt(btn.dataset.sec);
          const h = Math.floor(sec / 3600);
          const m = Math.floor((sec % 3600) / 60);
          const s = sec % 60;
          inH.value = h; inM.value = m; inS.value = s;
          syncInputsToSeconds();
        });
      });

      btnStart.addEventListener('click', () => {
        if (!isTimerRunning) {
          if (remainingSec <= 0) syncInputsToSeconds();
          if (remainingSec <= 0) {
            showToast('Please set a timer duration greater than 0', 'error');
            return;
          }
          isTimerRunning = true;
          btnStart.textContent = 'Pause';
          btnStart.classList.replace('btn-primary', 'btn-secondary');
          document.getElementById('timer-inputs-row').style.opacity = '0.5';

          timerTicker = setInterval(() => {
            remainingSec--;
            renderDisp();
            if (remainingSec <= 0) {
              clearInterval(timerTicker);
              isTimerRunning = false;
              playChime();
              showToast('⏰ Time is up!', 'success');
              btnStart.textContent = 'Start Timer';
              btnStart.classList.replace('btn-secondary', 'btn-primary');
              document.getElementById('timer-inputs-row').style.opacity = '1';
            }
          }, 1000);
        } else {
          clearInterval(timerTicker);
          isTimerRunning = false;
          btnStart.textContent = 'Resume';
          btnStart.classList.replace('btn-secondary', 'btn-primary');
        }
      });

      btnReset.addEventListener('click', () => {
        clearInterval(timerTicker);
        isTimerRunning = false;
        syncInputsToSeconds();
        btnStart.textContent = 'Start Timer';
        btnStart.classList.replace('btn-secondary', 'btn-primary');
        document.getElementById('timer-inputs-row').style.opacity = '1';
        progressBar.style.width = '100%';
      });

      function renderDisp() {
        const h = Math.floor(remainingSec / 3600);
        const m = Math.floor((remainingSec % 3600) / 60);
        const s = remainingSec % 60;
        disp.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);

        const pct = initialTotalSec > 0 ? (remainingSec / initialTotalSec) * 100 : 0;
        progressBar.style.width = pct + '%';
      }

      function pad(n) { return n < 10 ? '0' + n : n; }

      function playChime() {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        } catch(e) {}
      }
    `
  },

  // 38. Interactive Calendar
  "calendar": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="result-box" style="padding:1.5rem;">
            <!-- Calendar Navigation Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
              <button class="btn btn-sm btn-secondary" id="cal-prev">‹ Prev</button>
              <div style="font-size:1.15rem; font-weight:800; color:var(--text-main);" id="cal-month-year">November 2026</div>
              <button class="btn btn-sm btn-secondary" id="cal-next">Next ›</button>
            </div>

            <!-- Calendar Table Grid -->
            <table style="width:100%; border-collapse:collapse; text-align:center; font-size:0.875rem;">
              <thead>
                <tr style="color:var(--text-muted); font-weight:700;">
                  <th style="padding:0.5rem 0;">Su</th>
                  <th>Mo</th>
                  <th>Tu</th>
                  <th>We</th>
                  <th>Th</th>
                  <th>Fr</th>
                  <th>Sa</th>
                </tr>
              </thead>
              <tbody id="cal-grid-body"></tbody>
            </table>

            <div style="margin-top:1.5rem; text-align:center;">
              <button class="btn btn-sm btn-primary" id="cal-today">Jump to Today</button>
            </div>
          </div>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%;">
            <div class="result-header">
              <span class="result-title">Day of the Week Detector</span>
              <span class="badge badge-primary">Historical / Future</span>
            </div>

            <div class="form-group">
              <label class="form-label">Pick Any Date in History or Future</label>
              <input type="date" class="form-control" id="day-finder-date">
            </div>

            <div style="background:var(--bg-surface); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color); text-align:center;">
              <div class="stat-label">That Day Was / Will Be A</div>
              <div id="day-finder-result" style="font-size:1.75rem; font-weight:800; color:var(--primary); margin-top:0.25rem;">Friday</div>
              <p style="font-size:0.8125rem; color:var(--text-muted); margin-top:0.35rem;" id="day-finder-details"></p>
            </div>

            <div style="margin-top:1.5rem;">
              <h4 style="font-size:0.9375rem; font-weight:700; margin-bottom:0.5rem;">Quick Date Facts:</h4>
              <ul style="font-size:0.8125rem; color:var(--text-muted); line-height:1.8;">
                <li id="fact-leap-year">Is Leap Year? Checking...</li>
                <li id="fact-day-of-year">Day of Year: ...</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      let viewDate = new Date();
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      const monthYearEl = document.getElementById('cal-month-year');
      const gridBody = document.getElementById('cal-grid-body');
      const btnPrev = document.getElementById('cal-prev');
      const btnNext = document.getElementById('cal-next');
      const btnToday = document.getElementById('cal-today');

      const datePicker = document.getElementById('day-finder-date');
      const dayResult = document.getElementById('day-finder-result');
      const dayDetails = document.getElementById('day-finder-details');

      btnPrev.addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() - 1);
        renderCalendar();
      });

      btnNext.addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() + 1);
        renderCalendar();
      });

      btnToday.addEventListener('click', () => {
        viewDate = new Date();
        renderCalendar();
      });

      datePicker.value = new Date().toISOString().split('T')[0];
      datePicker.addEventListener('change', updateDayFinder);

      renderCalendar();
      updateDayFinder();

      function renderCalendar() {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        monthYearEl.textContent = monthNames[month] + ' ' + year;

        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        gridBody.innerHTML = '';
        let row = document.createElement('tr');

        // Padding previous month
        for (let i = 0; i < firstDay; i++) {
          const cell = document.createElement('td');
          cell.style.padding = '0.6rem 0';
          cell.style.color = 'var(--text-light)';
          row.appendChild(cell);
        }

        for (let day = 1; day <= totalDays; day++) {
          if (row.children.length === 7) {
            gridBody.appendChild(row);
            row = document.createElement('tr');
          }

          const cell = document.createElement('td');
          cell.style.padding = '0.6rem 0';
          cell.textContent = day;

          const isToday = (today.getFullYear() === year && today.getMonth() === month && today.getDate() === day);
          if (isToday) {
            cell.innerHTML = '<span style="background:var(--primary); color:#ffffff; width:30px; height:30px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:700;">' + day + '</span>';
          }

          row.appendChild(cell);
        }

        while (row.children.length < 7) {
          const cell = document.createElement('td');
          row.appendChild(cell);
        }
        gridBody.appendChild(row);
      }

      function updateDayFinder() {
        const val = datePicker.value;
        if (!val) return;
        const d = new Date(val + 'T00:00:00');
        const dayIdx = d.getDay();
        dayResult.textContent = dayNames[dayIdx];
        dayDetails.textContent = d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const year = d.getFullYear();
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        document.getElementById('fact-leap-year').textContent = year + (isLeap ? ' is a Leap Year (366 days)' : ' is not a Leap Year (365 days)');

        const startOfYear = new Date(year, 0, 1);
        const dayNum = Math.floor((d - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
        document.getElementById('fact-day-of-year').textContent = 'Day ' + dayNum + ' of ' + year;
      }
    `
  },

  // 39. Random Number Generator
  "random-number-generator": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Minimum (Min)</label>
              <input type="number" class="form-control" id="rng-min" value="1">
            </div>
            <div class="form-group">
              <label class="form-label">Maximum (Max)</label>
              <input type="number" class="form-control" id="rng-max" value="100">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Quantity of Numbers to Pick: <strong id="rng-qty-val" style="color:var(--primary);">1</strong></label>
            <input type="range" class="range-slider" id="rng-qty" min="1" max="50" value="1">
          </div>

          <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.5rem;">
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="rng-duplicates">
              <span>Allow duplicate numbers</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="rng-sort">
              <span>Sort results in ascending order</span>
            </label>
          </div>

          <button class="btn btn-primary" id="btn-generate-rng" style="width:100%;">
            🎲 Generate Random Number(s)
          </button>

          <div style="margin-top:1.5rem;">
            <label class="form-label">Quick Action Shortcuts</label>
            <div class="quick-tags">
              <button class="btn btn-sm btn-secondary" id="btn-quick-dice">Roll 6-Sided Die (1-6)</button>
              <button class="btn btn-sm btn-secondary" id="btn-quick-coin">Flip a Coin (Heads/Tails)</button>
              <button class="btn btn-sm btn-secondary" id="btn-quick-lotto">Pick 6 Lottery (1-49)</button>
            </div>
          </div>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">Generated Outcome</span>
                <span class="badge badge-success" id="rng-badge">Cryptographically Random</span>
              </div>

              <div id="rng-single-view" style="text-align:center; padding:2rem 0;">
                <div class="result-value-big" id="rng-single-val" style="font-size:4rem; line-height:1;">42</div>
                <div class="stat-label" id="rng-single-label">Selected Number</div>
              </div>

              <div id="rng-multi-view" style="display:none; max-height:220px; overflow-y:auto; padding:0.5rem;">
                <div id="rng-multi-grid" style="display:flex; flex-wrap:wrap; gap:0.5rem; justify-content:center;"></div>
              </div>
            </div>

            <div style="margin-top:1.5rem;">
              <button class="btn btn-secondary" id="btn-copy-rng" style="width:100%;">
                Copy Generated Numbers
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      const minInput = document.getElementById('rng-min');
      const maxInput = document.getElementById('rng-max');
      const qtySlider = document.getElementById('rng-qty');
      const qtyVal = document.getElementById('rng-qty-val');
      const dupCheck = document.getElementById('rng-duplicates');
      const sortCheck = document.getElementById('rng-sort');
      const btnGen = document.getElementById('btn-generate-rng');
      const btnCopy = document.getElementById('btn-copy-rng');

      let currentNumbers = [42];

      qtySlider.addEventListener('input', e => qtyVal.textContent = e.target.value);
      btnGen.addEventListener('click', generateRNG);

      document.getElementById('btn-quick-dice').addEventListener('click', () => {
        minInput.value = 1; maxInput.value = 6; qtySlider.value = 1; qtyVal.textContent = 1;
        generateRNG();
      });

      document.getElementById('btn-quick-coin').addEventListener('click', () => {
        const val = Math.random() < 0.5 ? 'Heads' : 'Tails';
        document.getElementById('rng-single-val').textContent = val;
        document.getElementById('rng-single-label').textContent = 'Coin Flip Result';
        document.getElementById('rng-single-view').style.display = 'block';
        document.getElementById('rng-multi-view').style.display = 'none';
        currentNumbers = [val];
      });

      document.getElementById('btn-quick-lotto').addEventListener('click', () => {
        minInput.value = 1; maxInput.value = 49; qtySlider.value = 6; qtyVal.textContent = 6;
        dupCheck.checked = false; sortCheck.checked = true;
        generateRNG();
      });

      btnCopy.addEventListener('click', () => copyToClipboard(currentNumbers.join(', '), btnCopy));

      generateRNG();

      function generateRNG() {
        const min = parseInt(minInput.value) || 0;
        const max = parseInt(maxInput.value) || 100;
        const qty = parseInt(qtySlider.value) || 1;
        const allowDup = dupCheck.checked;
        const doSort = sortCheck.checked;

        if (min >= max) {
          showToast('Min must be less than Max!', 'error');
          return;
        }

        const range = max - min + 1;
        if (!allowDup && qty > range) {
          showToast('Cannot generate ' + qty + ' unique numbers from a range of ' + range, 'error');
          return;
        }

        const results = [];
        const set = new Set();

        while (results.length < qty) {
          const array = new Uint32Array(1);
          window.crypto.getRandomValues(array);
          const rand = min + (array[0] % range);

          if (allowDup) {
            results.push(rand);
          } else {
            if (!set.has(rand)) {
              set.add(rand);
              results.push(rand);
            }
          }
        }

        if (doSort) results.sort((a,b) => a - b);
        currentNumbers = results;

        if (qty === 1) {
          document.getElementById('rng-single-val').textContent = results[0];
          document.getElementById('rng-single-label').textContent = 'Between ' + min + ' and ' + max;
          document.getElementById('rng-single-view').style.display = 'block';
          document.getElementById('rng-multi-view').style.display = 'none';
        } else {
          document.getElementById('rng-single-view').style.display = 'none';
          document.getElementById('rng-multi-view').style.display = 'block';
          document.getElementById('rng-multi-grid').innerHTML = results.map(n => \`
            <span class="badge badge-primary" style="font-size:1.15rem; padding:0.5rem 1rem;">\${n}</span>
          \`).join('');
        }

        showToast('Generated ' + qty + ' number(s)!', 'success');
      }
    `
  }
};
