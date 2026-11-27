/**
 * Workspace definitions & client-side scripts for Text Tools (5 tools)
 */

module.exports = {
  // 23. Word Counter
  "word-counter": {
    extraHead: ``,
    renderWorkspace: () => `
      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value" id="wc-words">0</div>
            <div class="stat-label">Words</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="wc-chars">0</div>
            <div class="stat-label">Characters</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="wc-chars-nospace">0</div>
            <div class="stat-label">Chars (No Spaces)</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="wc-sentences">0</div>
            <div class="stat-label">Sentences</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="wc-paragraphs">0</div>
            <div class="stat-label">Paragraphs</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="wc-reading-time">0 min</div>
            <div class="stat-label">Reading Time</div>
          </div>
        </div>

        <div class="editor-wrapper">
          <div class="editor-header">
            <span>Live Text Editor</span>
            <div class="editor-actions">
              <button class="btn btn-sm btn-secondary" id="btn-wc-sample">Sample Text</button>
              <button class="btn btn-sm btn-secondary" id="btn-wc-clear">Clear</button>
              <button class="btn btn-sm btn-primary" id="btn-wc-copy">Copy</button>
            </div>
          </div>
          <textarea class="editor-textarea" id="wc-input" placeholder="Type or paste your content here to inspect words, character count and reading metrics in real time..."></textarea>
        </div>

        <div class="result-box" style="margin-top:1rem;">
          <h4 style="font-size:0.9375rem; font-weight:700; margin-bottom:0.75rem;">Top Repeated Keywords</h4>
          <div id="wc-keywords" style="display:flex; flex-wrap:wrap; gap:0.5rem; color:var(--text-muted); font-size:0.875rem;">
            <span>Start typing to view keyword densities.</span>
          </div>
        </div>
      </div>
    `,
    script: `
      const textarea = document.getElementById('wc-input');
      const btnClear = document.getElementById('btn-wc-clear');
      const btnSample = document.getElementById('btn-wc-sample');
      const btnCopy = document.getElementById('btn-wc-copy');

      textarea.addEventListener('input', updateStats);
      btnClear.addEventListener('click', () => { textarea.value = ''; updateStats(); });
      btnSample.addEventListener('click', () => {
        textarea.value = "SmartHub is an all-in-one suite of modern online tools designed for developers, students, and everyday users. Our tools run directly inside your web browser, ensuring instant performance, zero uploads, and total data privacy. From image manipulation to financial calculators, PDF processing, and QR code generation, SmartHub provides everything you need in one smart place.";
        updateStats();
      });
      btnCopy.addEventListener('click', () => copyToClipboard(textarea.value, btnCopy));

      function updateStats() {
        const text = textarea.value;
        const trimmed = text.trim();

        const words = trimmed ? (trimmed.match(/\\b\\S+\\b/g) || []).length : 0;
        const chars = text.length;
        const charsNoSpace = text.replace(/\\s/g, '').length;
        const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\\s|$)/g) || []).length || (trimmed.length ? 1 : 0) : 0;
        const paragraphs = trimmed ? trimmed.split(/\\n+/).filter(p => p.trim().length > 0).length : 0;
        const readingTimeMin = Math.ceil(words / 200);

        document.getElementById('wc-words').textContent = words.toLocaleString();
        document.getElementById('wc-chars').textContent = chars.toLocaleString();
        document.getElementById('wc-chars-nospace').textContent = charsNoSpace.toLocaleString();
        document.getElementById('wc-sentences').textContent = sentences.toLocaleString();
        document.getElementById('wc-paragraphs').textContent = paragraphs.toLocaleString();
        document.getElementById('wc-reading-time').textContent = (readingTimeMin <= 1 ? '< 1' : readingTimeMin) + ' min';

        // Keyword density
        if (words > 0) {
          const rawTokens = (text.toLowerCase().match(/\\b[a-z]{3,}\\b/g) || []);
          const stopWords = new Set(['the','and','for','that','this','with','you','are','from','our','all','one']);
          const freq = {};
          rawTokens.forEach(t => {
            if (!stopWords.has(t)) freq[t] = (freq[t] || 0) + 1;
          });
          const sorted = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 6);
          const kwContainer = document.getElementById('wc-keywords');
          if (sorted.length > 0) {
            kwContainer.innerHTML = sorted.map(([k, cnt]) => \`
              <span class="badge badge-primary" style="font-size:0.8125rem; text-transform:none;">
                \${k} <strong style="margin-left:4px;">(\${cnt})</strong>
              </span>
            \`).join('');
          } else {
            kwContainer.textContent = 'Keep typing to uncover recurring terms.';
          }
        }
      }
    `
  },

  // 24. Character Counter
  "character-counter": {
    extraHead: ``,
    renderWorkspace: () => `
      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value" id="cc-total">0</div>
            <div class="stat-label">Total Characters</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="cc-nospace">0</div>
            <div class="stat-label">No Spaces</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="cc-letters">0</div>
            <div class="stat-label">Letters</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="cc-digits">0</div>
            <div class="stat-label">Digits</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="cc-spaces">0</div>
            <div class="stat-label">Spaces</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="cc-bytes">0 B</div>
            <div class="stat-label">Byte Size</div>
          </div>
        </div>

        <div class="editor-wrapper">
          <div class="editor-header">
            <span>Character Inspector</span>
            <div class="editor-actions">
              <button class="btn btn-sm btn-secondary" id="btn-cc-clear">Clear</button>
              <button class="btn btn-sm btn-primary" id="btn-cc-copy">Copy</button>
            </div>
          </div>
          <textarea class="editor-textarea" id="cc-input" placeholder="Type or paste text to track character counts and social media post length limits..."></textarea>
        </div>

        <div class="result-box">
          <h4 style="font-size:1rem; font-weight:700; margin-bottom:1rem;">Social Media Limit Trackers</h4>
          <div style="display:flex; flex-direction:column; gap:1rem;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.875rem; font-weight:600; margin-bottom:0.25rem;">
                <span>Twitter / X (<span id="tw-count">0</span> / 280)</span>
                <span id="tw-rem" style="color:var(--text-muted);">280 left</span>
              </div>
              <div style="height:8px; background:var(--border-color); border-radius:4px; overflow:hidden;">
                <div id="tw-bar" style="height:100%; width:0%; background:var(--primary); transition:width 0.2s;"></div>
              </div>
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.875rem; font-weight:600; margin-bottom:0.25rem;">
                <span>Single SMS (<span id="sms-count">0</span> / 160)</span>
                <span id="sms-rem" style="color:var(--text-muted);">160 left</span>
              </div>
              <div style="height:8px; background:var(--border-color); border-radius:4px; overflow:hidden;">
                <div id="sms-bar" style="height:100%; width:0%; background:var(--secondary); transition:width 0.2s;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      const textarea = document.getElementById('cc-input');
      const btnClear = document.getElementById('btn-cc-clear');
      const btnCopy = document.getElementById('btn-cc-copy');

      textarea.addEventListener('input', updateCounts);
      btnClear.addEventListener('click', () => { textarea.value = ''; updateCounts(); });
      btnCopy.addEventListener('click', () => copyToClipboard(textarea.value, btnCopy));

      function updateCounts() {
        const text = textarea.value;
        const total = text.length;
        const noSpace = text.replace(/\\s/g, '').length;
        const letters = (text.match(/[a-zA-Z]/g) || []).length;
        const digits = (text.match(/[0-9]/g) || []).length;
        const spaces = (text.match(/\\s/g) || []).length;
        const bytes = new Blob([text]).size;

        document.getElementById('cc-total').textContent = total.toLocaleString();
        document.getElementById('cc-nospace').textContent = noSpace.toLocaleString();
        document.getElementById('cc-letters').textContent = letters.toLocaleString();
        document.getElementById('cc-digits').textContent = digits.toLocaleString();
        document.getElementById('cc-spaces').textContent = spaces.toLocaleString();
        document.getElementById('cc-bytes').textContent = bytes + ' B';

        // Twitter tracker
        const twLeft = 280 - total;
        document.getElementById('tw-count').textContent = total;
        const twRemEl = document.getElementById('tw-rem');
        twRemEl.textContent = twLeft >= 0 ? twLeft + ' left' : Math.abs(twLeft) + ' over limit';
        twRemEl.style.color = twLeft >= 0 ? 'var(--text-muted)' : 'var(--danger)';
        const twPct = Math.min(100, Math.round((total / 280) * 100));
        const twBar = document.getElementById('tw-bar');
        twBar.style.width = twPct + '%';
        twBar.style.background = twLeft >= 0 ? 'var(--primary)' : 'var(--danger)';

        // SMS tracker
        const smsLeft = 160 - total;
        document.getElementById('sms-count').textContent = total;
        const smsRemEl = document.getElementById('sms-rem');
        smsRemEl.textContent = smsLeft >= 0 ? smsLeft + ' left' : Math.abs(smsLeft) + ' over';
        smsRemEl.style.color = smsLeft >= 0 ? 'var(--text-muted)' : 'var(--danger)';
        const smsPct = Math.min(100, Math.round((total / 160) * 100));
        const smsBar = document.getElementById('sms-bar');
        smsBar.style.width = smsPct + '%';
        smsBar.style.background = smsLeft >= 0 ? 'var(--secondary)' : 'var(--danger)';
      }
    `
  },

  // 25. Case Converter
  "case-converter": {
    extraHead: ``,
    renderWorkspace: () => `
      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        <div class="editor-wrapper">
          <div class="editor-header">
            <span>Input Text</span>
            <div class="editor-actions">
              <button class="btn btn-sm btn-secondary" id="btn-case-clear">Clear</button>
              <button class="btn btn-sm btn-primary" id="btn-case-copy">Copy Result</button>
            </div>
          </div>
          <textarea class="editor-textarea" id="case-textarea" rows="6" placeholder="Type or paste your text here to transform cases..."></textarea>
        </div>

        <div class="result-box">
          <h4 style="font-size:0.9375rem; font-weight:700; margin-bottom:1rem;">Select Target Case</h4>
          <div style="display:flex; flex-wrap:wrap; gap:0.75rem;">
            <button class="btn btn-secondary case-btn" data-mode="upper">UPPERCASE</button>
            <button class="btn btn-secondary case-btn" data-mode="lower">lowercase</button>
            <button class="btn btn-secondary case-btn" data-mode="title">Title Case</button>
            <button class="btn btn-secondary case-btn" data-mode="sentence">Sentence case</button>
            <button class="btn btn-secondary case-btn" data-mode="capitalized">Capitalized Case</button>
            <button class="btn btn-secondary case-btn" data-mode="camel">camelCase</button>
            <button class="btn btn-secondary case-btn" data-mode="snake">snake_case</button>
            <button class="btn btn-secondary case-btn" data-mode="kebab">kebab-case</button>
            <button class="btn btn-secondary case-btn" data-mode="constant">CONSTANT_CASE</button>
          </div>
        </div>
      </div>
    `,
    script: `
      const textarea = document.getElementById('case-textarea');
      const btnClear = document.getElementById('btn-case-clear');
      const btnCopy = document.getElementById('btn-case-copy');

      btnClear.addEventListener('click', () => textarea.value = '');
      btnCopy.addEventListener('click', () => copyToClipboard(textarea.value, btnCopy));

      document.querySelectorAll('.case-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const mode = btn.dataset.mode;
          const text = textarea.value;
          if (!text) {
            showToast('Please enter some text first', 'info');
            return;
          }

          let res = text;
          switch (mode) {
            case 'upper':
              res = text.toUpperCase();
              break;
            case 'lower':
              res = text.toLowerCase();
              break;
            case 'title':
              res = text.toLowerCase().replace(/\\b[a-z]/g, c => c.toUpperCase());
              break;
            case 'sentence':
              res = text.toLowerCase().replace(/(^\\s*|[.!?]\\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
              break;
            case 'capitalized':
              res = text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
              break;
            case 'camel':
              res = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
              break;
            case 'snake':
              res = text.trim().toLowerCase().replace(/[\\s\\W-]+/g, '_');
              break;
            case 'kebab':
              res = text.trim().toLowerCase().replace(/[\\s\\W_]+/g, '-');
              break;
            case 'constant':
              res = text.trim().toUpperCase().replace(/[\\s\\W-]+/g, '_');
              break;
          }

          textarea.value = res;
          showToast('Converted to ' + btn.textContent, 'success');
        });
      });
    `
  },

  // 26. Remove Extra Spaces
  "remove-extra-spaces": {
    extraHead: ``,
    renderWorkspace: () => `
      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        <div class="editor-wrapper">
          <div class="editor-header">
            <span>Messy Text Input</span>
            <div class="editor-actions">
              <button class="btn btn-sm btn-secondary" id="btn-spaces-sample">Sample</button>
              <button class="btn btn-sm btn-secondary" id="btn-spaces-clear">Clear</button>
              <button class="btn btn-sm btn-primary" id="btn-spaces-copy">Copy Cleaned</button>
            </div>
          </div>
          <textarea class="editor-textarea" id="spaces-input" rows="7" placeholder="Paste your text with unwanted duplicate spaces, trailing lines or tab characters..."></textarea>
        </div>

        <div class="result-box">
          <h4 style="font-size:0.9375rem; font-weight:700; margin-bottom:1rem;">Space Cleaning Options</h4>
          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="opt-consecutive" checked>
              <span>Collapse consecutive spaces into single space</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="opt-lines-trim" checked>
              <span>Trim leading and trailing whitespace on each line</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="opt-blank-lines" checked>
              <span>Remove consecutive blank empty lines</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="opt-single-line">
              <span>Remove all line breaks (Flatten into one continuous paragraph)</span>
            </label>
          </div>

          <button class="btn btn-primary" id="btn-clean-spaces" style="width:100%;">
            Clean & Remove Extra Spaces
          </button>
        </div>
      </div>
    `,
    script: `
      const textarea = document.getElementById('spaces-input');
      const btnClean = document.getElementById('btn-clean-spaces');
      const btnClear = document.getElementById('btn-spaces-clear');
      const btnSample = document.getElementById('btn-spaces-sample');
      const btnCopy = document.getElementById('btn-spaces-copy');

      btnSample.addEventListener('click', () => {
        textarea.value = "   This    is   a    sample   sentence   with    too   many   spaces.   \\n\\n\\n\\nAnd   several    blank    lines   below  it.   \\n\\n   Clean    it   up   easily!   ";
      });

      btnClear.addEventListener('click', () => textarea.value = '');
      btnCopy.addEventListener('click', () => copyToClipboard(textarea.value, btnCopy));

      btnClean.addEventListener('click', () => {
        let text = textarea.value;
        if (!text) return;

        const origLen = text.length;

        if (document.getElementById('opt-lines-trim').checked) {
          text = text.split('\\n').map(l => l.trim()).join('\\n');
        }

        if (document.getElementById('opt-consecutive').checked) {
          text = text.replace(/[^\\S\\r\\n]+/g, ' ');
        }

        if (document.getElementById('opt-blank-lines').checked) {
          text = text.replace(/\\n\\s*\\n/g, '\\n\\n').replace(/\\n{3,}/g, '\\n\\n').trim();
        }

        if (document.getElementById('opt-single-line').checked) {
          text = text.replace(/\\r?\\n|\\r/g, ' ').replace(/\\s+/g, ' ').trim();
        }

        textarea.value = text;
        const saved = origLen - text.length;
        showToast('Cleaned! Removed ' + Math.max(0, saved) + ' redundant character(s).', 'success');
      });
    `
  },

  // 27. Text to Speech
  "text-to-speech": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label">Text to Read Aloud</label>
            <textarea class="form-control" id="tts-text" rows="6" placeholder="Enter text you want the voice synthesizer to read aloud...">Welcome to SmartHub. Everything You Need, All in One Smart Place.</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Voice Selection</label>
            <select class="form-control" id="tts-voice"></select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Speed / Rate: <strong id="tts-rate-val">1.0x</strong></label>
              <input type="range" class="range-slider" id="tts-rate" min="0.5" max="2" step="0.1" value="1">
            </div>
            <div class="form-group">
              <label class="form-label">Pitch: <strong id="tts-pitch-val">1.0</strong></label>
              <input type="range" class="range-slider" id="tts-pitch" min="0.5" max="1.5" step="0.1" value="1">
            </div>
          </div>

          <div style="display:flex; gap:0.5rem; margin-top:1rem;">
            <button class="btn btn-primary" id="btn-tts-play" style="flex:1;">
              ▶ Speak Text
            </button>
            <button class="btn btn-secondary" id="btn-tts-pause" style="width:90px;">
              ⏸ Pause
            </button>
            <button class="btn btn-secondary" id="btn-tts-stop" style="width:90px; color:var(--danger);">
              ⏹ Stop
            </button>
          </div>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
            <div id="tts-visualizer" style="width:64px; height:64px; border-radius:50%; background:var(--gradient-subtle); display:flex; align-items:center; justify-content:center; color:var(--primary); margin-bottom:1rem; transition:transform 0.3s;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            </div>
            <h4 id="tts-status" style="font-size:1.15rem; font-weight:700; margin-bottom:0.25rem;">Voice Engine Ready</h4>
            <p style="font-size:0.875rem; color:var(--text-muted); max-width:280px;" id="tts-current-sentence">Click Speak Text to start audio speech playback.</p>
          </div>
        </div>
      </div>
    `,
    script: `
      const synth = window.speechSynthesis;
      const textInput = document.getElementById('tts-text');
      const voiceSelect = document.getElementById('tts-voice');
      const rateInput = document.getElementById('tts-rate');
      const pitchInput = document.getElementById('tts-pitch');
      const rateVal = document.getElementById('tts-rate-val');
      const pitchVal = document.getElementById('tts-pitch-val');
      const btnPlay = document.getElementById('btn-tts-play');
      const btnPause = document.getElementById('btn-tts-pause');
      const btnStop = document.getElementById('btn-tts-stop');
      const statusEl = document.getElementById('tts-status');
      const visualizer = document.getElementById('tts-visualizer');

      let voices = [];

      function populateVoices() {
        if (!synth) return;
        voices = synth.getVoices();
        voiceSelect.innerHTML = voices.map((v, i) => \`
          <option value="\${i}">\${v.name} (\${v.lang})</option>
        \`).join('');
      }

      populateVoices();
      if (synth && synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoices;
      }

      rateInput.addEventListener('input', e => rateVal.textContent = e.target.value + 'x');
      pitchInput.addEventListener('input', e => pitchVal.textContent = e.target.value);

      btnPlay.addEventListener('click', () => {
        if (!synth) {
          showToast('Speech synthesis not supported in this browser.', 'error');
          return;
        }

        if (synth.paused) {
          synth.resume();
          statusEl.textContent = 'Speaking...';
          visualizer.style.transform = 'scale(1.2)';
          return;
        }

        synth.cancel();
        const text = textInput.value.trim();
        if (!text) {
          showToast('Please type some text to speak', 'error');
          return;
        }

        const utter = new SpeechSynthesisUtterance(text);
        if (voices[voiceSelect.value]) {
          utter.voice = voices[voiceSelect.value];
        }
        utter.rate = parseFloat(rateInput.value);
        utter.pitch = parseFloat(pitchInput.value);

        utter.onstart = () => {
          statusEl.textContent = 'Speaking...';
          visualizer.style.transform = 'scale(1.2)';
        };
        utter.onend = () => {
          statusEl.textContent = 'Finished Speaking';
          visualizer.style.transform = 'scale(1)';
        };
        utter.onerror = () => {
          statusEl.textContent = 'Voice Error';
          visualizer.style.transform = 'scale(1)';
        };

        synth.speak(utter);
      });

      btnPause.addEventListener('click', () => {
        if (synth.speaking && !synth.paused) {
          synth.pause();
          statusEl.textContent = 'Paused';
          visualizer.style.transform = 'scale(1)';
        }
      });

      btnStop.addEventListener('click', () => {
        synth.cancel();
        statusEl.textContent = 'Stopped';
        visualizer.style.transform = 'scale(1)';
      });
    `
  }
};
