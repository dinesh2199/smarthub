/**
 * Workspace definitions & client-side scripts for Developer Tools (4 tools)
 */

module.exports = {
  // 28. JSON Formatter & Validator
  "json-formatter": {
    extraHead: ``,
    renderWorkspace: () => `
      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <label class="form-label" style="margin:0;">Indentation:</label>
            <select class="form-control" id="json-indent" style="width:140px; padding:0.4rem 0.75rem;">
              <option value="2" selected>2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="tab">1 Tab</option>
            </select>
          </div>

          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-sm btn-secondary" id="btn-json-sample">Sample</button>
            <button class="btn btn-sm btn-secondary" id="btn-json-minify">Minify</button>
            <button class="btn btn-sm btn-primary" id="btn-json-format">Beautify JSON</button>
            <button class="btn btn-sm btn-secondary" id="btn-json-clear">Clear</button>
          </div>
        </div>

        <div class="workspace-grid">
          <!-- Input -->
          <div class="workspace-col">
            <div class="editor-wrapper">
              <div class="editor-header">
                <span>Raw / Unformatted JSON</span>
                <span class="file-meta" id="json-raw-meta">0 Chars</span>
              </div>
              <textarea class="editor-textarea" id="json-input" style="min-height:350px;" placeholder="Paste raw JSON string here..."></textarea>
            </div>
          </div>

          <!-- Output -->
          <div class="workspace-col">
            <div class="editor-wrapper">
              <div class="editor-header">
                <span id="json-status-badge" class="badge badge-success" style="display:none;">Valid JSON</span>
                <span id="json-status-default">Formatted View</span>
                <div class="editor-actions">
                  <button class="btn btn-sm btn-secondary" id="btn-copy-json">Copy</button>
                  <button class="btn btn-sm btn-secondary" id="btn-download-json">Download .json</button>
                </div>
              </div>
              <textarea class="editor-textarea" id="json-output" style="min-height:350px;" readonly placeholder="Formatted and validated JSON will appear here..."></textarea>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      const input = document.getElementById('json-input');
      const output = document.getElementById('json-output');
      const indentSelect = document.getElementById('json-indent');
      const btnFormat = document.getElementById('btn-json-format');
      const btnMinify = document.getElementById('btn-json-minify');
      const btnSample = document.getElementById('btn-json-sample');
      const btnClear = document.getElementById('btn-json-clear');
      const btnCopy = document.getElementById('btn-copy-json');
      const btnDownload = document.getElementById('btn-download-json');
      const statusBadge = document.getElementById('json-status-badge');
      const statusDefault = document.getElementById('json-status-default');

      btnSample.addEventListener('click', () => {
        input.value = JSON.stringify({
          site: "SmartHub",
          tagline: "Everything You Need, All in One Smart Place",
          features: ["Client-Side Processing", "Free Forever", "39+ Tools"],
          active: true,
          stats: { users: 50000, rating: 4.9 }
        });
        formatJSON();
      });

      btnClear.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        statusBadge.style.display = 'none';
        statusDefault.style.display = 'inline-block';
      });

      btnCopy.addEventListener('click', () => copyToClipboard(output.value, btnCopy));

      btnFormat.addEventListener('click', formatJSON);
      btnMinify.addEventListener('click', minifyJSON);
      indentSelect.addEventListener('change', formatJSON);

      function formatJSON() {
        const raw = input.value.trim();
        if (!raw) return;

        try {
          const parsed = JSON.parse(raw);
          const indentVal = indentSelect.value === 'tab' ? '\\t' : parseInt(indentSelect.value);
          output.value = JSON.stringify(parsed, null, indentVal);
          output.style.color = 'var(--text-main)';

          statusBadge.textContent = 'Valid JSON';
          statusBadge.className = 'badge badge-success';
          statusBadge.style.display = 'inline-block';
          statusDefault.style.display = 'none';
          showToast('JSON beautified and validated successfully!', 'success');
        } catch (err) {
          output.value = 'Syntax Error: ' + err.message;
          output.style.color = 'var(--danger)';
          statusBadge.textContent = 'Invalid JSON';
          statusBadge.className = 'badge badge-danger';
          statusBadge.style.display = 'inline-block';
          statusDefault.style.display = 'none';
          showToast('Invalid JSON structure', 'error');
        }
      }

      function minifyJSON() {
        const raw = input.value.trim();
        if (!raw) return;

        try {
          const parsed = JSON.parse(raw);
          output.value = JSON.stringify(parsed);
          output.style.color = 'var(--text-main)';

          statusBadge.textContent = 'Minified JSON';
          statusBadge.className = 'badge badge-success';
          statusBadge.style.display = 'inline-block';
          statusDefault.style.display = 'none';
          showToast('JSON minified!', 'success');
        } catch (err) {
          output.value = 'Syntax Error: ' + err.message;
          output.style.color = 'var(--danger)';
        }
      }

      btnDownload.addEventListener('click', () => {
        if (!output.value) return;
        const blob = new Blob([output.value], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'smarthub-formatted.json';
        link.click();
      });
    `
  },

  // 29. HTML Formatter
  "html-formatter": {
    extraHead: ``,
    renderWorkspace: () => `
      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-sm btn-secondary" id="btn-html-sample">Sample HTML</button>
            <button class="btn btn-sm btn-secondary" id="btn-html-minify">Minify HTML</button>
            <button class="btn btn-sm btn-primary" id="btn-html-format">Beautify HTML</button>
            <button class="btn btn-sm btn-secondary" id="btn-html-clear">Clear</button>
          </div>
        </div>

        <div class="workspace-grid">
          <div class="workspace-col">
            <div class="editor-wrapper">
              <div class="editor-header">
                <span>Input HTML</span>
              </div>
              <textarea class="editor-textarea" id="html-input" style="min-height:350px;" placeholder="Paste raw or unformatted HTML markup here..."></textarea>
            </div>
          </div>

          <div class="workspace-col">
            <div class="editor-wrapper">
              <div class="editor-header">
                <span>Cleaned Output</span>
                <div class="editor-actions">
                  <button class="btn btn-sm btn-secondary" id="btn-html-copy">Copy</button>
                  <button class="btn btn-sm btn-secondary" id="btn-html-download">Download .html</button>
                </div>
              </div>
              <textarea class="editor-textarea" id="html-output" style="min-height:350px;" readonly placeholder="Formatted HTML code will be generated here..."></textarea>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      const input = document.getElementById('html-input');
      const output = document.getElementById('html-output');
      const btnFormat = document.getElementById('btn-html-format');
      const btnMinify = document.getElementById('btn-html-minify');
      const btnSample = document.getElementById('btn-html-sample');
      const btnClear = document.getElementById('btn-html-clear');
      const btnCopy = document.getElementById('btn-html-copy');
      const btnDownload = document.getElementById('btn-html-download');

      btnSample.addEventListener('click', () => {
        input.value = '<div class="card"><div class="card-header"><h1>SmartHub</h1></div><div class="card-body"><p>Online tools in one place.</p><a href="#">Explore</a></div></div>';
        formatHTML();
      });

      btnClear.addEventListener('click', () => {
        input.value = '';
        output.value = '';
      });

      btnCopy.addEventListener('click', () => copyToClipboard(output.value, btnCopy));

      btnFormat.addEventListener('click', formatHTML);
      btnMinify.addEventListener('click', minifyHTML);

      function formatHTML() {
        const raw = input.value.trim();
        if (!raw) return;

        let formatted = '';
        let indent = 0;
        const tab = '  ';

        // Split tokens
        raw.split(/>\\s*</).forEach(node => {
          if (node.match(/^\\/\\w/)) indent = Math.max(0, indent - 1);
          let padding = '';
          for (let i = 0; i < indent; i++) padding += tab;
          formatted += padding + '<' + node + '>\\r\\n';
          if (node.match(/^<?\\w[^>]*[^\\/]$/) && !node.startsWith("input") && !node.startsWith("img") && !node.startsWith("br") && !node.startsWith("hr")) {
            indent++;
          }
        });

        output.value = formatted.substring(1, formatted.length - 3);
        showToast('HTML beautified!', 'success');
      }

      function minifyHTML() {
        const raw = input.value.trim();
        if (!raw) return;

        const minified = raw
          .replace(/<!--[\\s\\S]*?-->/g, '')
          .replace(/\\s+/g, ' ')
          .replace(/>\\s+</g, '><')
          .trim();

        output.value = minified;
        showToast('HTML minified!', 'success');
      }

      btnDownload.addEventListener('click', () => {
        if (!output.value) return;
        const blob = new Blob([output.value], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'smarthub-formatted.html';
        link.click();
      });
    `
  },

  // 30. Base64 Encoder / Decoder
  "base64-encoder": {
    extraHead: ``,
    renderWorkspace: () => `
      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        <div class="radio-pill-group" style="max-width:320px;">
          <div class="radio-pill-item">
            <input type="radio" name="b64-mode" id="mode-encode" value="encode" checked>
            <label for="mode-encode">Encode (Text to Base64)</label>
          </div>
          <div class="radio-pill-item">
            <input type="radio" name="b64-mode" id="mode-decode" value="decode">
            <label for="mode-decode">Decode (Base64 to Text)</label>
          </div>
        </div>

        <div class="workspace-grid">
          <div class="workspace-col">
            <div class="editor-wrapper">
              <div class="editor-header">
                <span id="b64-in-label">Plain Text Input</span>
                <button class="btn btn-sm btn-secondary" id="btn-b64-clear">Clear</button>
              </div>
              <textarea class="editor-textarea" id="b64-input" style="min-height:300px;" placeholder="Enter plain text to encode..."></textarea>
            </div>
          </div>

          <div class="workspace-col">
            <div class="editor-wrapper">
              <div class="editor-header">
                <span id="b64-out-label">Base64 Output</span>
                <div class="editor-actions">
                  <button class="btn btn-sm btn-primary" id="btn-b64-copy">Copy</button>
                </div>
              </div>
              <textarea class="editor-textarea" id="b64-output" style="min-height:300px;" readonly placeholder="Base64 result will appear here..."></textarea>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      const input = document.getElementById('b64-input');
      const output = document.getElementById('b64-output');
      const inLabel = document.getElementById('b64-in-label');
      const outLabel = document.getElementById('b64-out-label');
      const btnClear = document.getElementById('btn-b64-clear');
      const btnCopy = document.getElementById('btn-b64-copy');
      const modeRadios = document.querySelectorAll('input[name="b64-mode"]');

      modeRadios.forEach(r => {
        r.addEventListener('change', () => {
          if (r.value === 'encode') {
            inLabel.textContent = 'Plain Text Input';
            outLabel.textContent = 'Base64 Output';
            input.placeholder = 'Enter plain text to encode...';
          } else {
            inLabel.textContent = 'Base64 Input';
            outLabel.textContent = 'Decoded Plain Text';
            input.placeholder = 'Paste Base64 string to decode...';
          }
          processB64();
        });
      });

      input.addEventListener('input', processB64);
      btnClear.addEventListener('click', () => { input.value = ''; output.value = ''; });
      btnCopy.addEventListener('click', () => copyToClipboard(output.value, btnCopy));

      function processB64() {
        const text = input.value;
        const isEncode = document.getElementById('mode-encode').checked;

        if (!text) {
          output.value = '';
          return;
        }

        if (isEncode) {
          try {
            // UTF-8 safe encode
            output.value = btoa(unescape(encodeURIComponent(text)));
            output.style.color = 'var(--text-main)';
          } catch (err) {
            output.value = 'Encoding error: ' + err.message;
            output.style.color = 'var(--danger)';
          }
        } else {
          try {
            // UTF-8 safe decode
            output.value = decodeURIComponent(escape(atob(text.trim())));
            output.style.color = 'var(--text-main)';
          } catch (err) {
            output.value = 'Invalid Base64 string';
            output.style.color = 'var(--danger)';
          }
        }
      }
    `
  },

  // 31. Password Generator
  "password-generator": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <div class="range-header">
              <label class="form-label">Password Length: <strong id="pw-len-val" style="color:var(--primary);">16</strong></label>
            </div>
            <input type="range" class="range-slider" id="pw-length" min="6" max="64" value="16">
          </div>

          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="pw-upper" checked>
              <span>Include Uppercase Letters (A-Z)</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="pw-lower" checked>
              <span>Include Lowercase Letters (a-z)</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="pw-nums" checked>
              <span>Include Numbers (0-9)</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="pw-syms" checked>
              <span>Include Symbols (!@#$%^&*()_+~)</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="pw-no-ambig">
              <span>Exclude Ambiguous Characters (e.g. l, 1, I, O, 0)</span>
            </label>
          </div>

          <button class="btn btn-primary" id="btn-gen-pw" style="width:100%;">
            ⚡ Generate Strong Password
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">Generated Password</span>
                <span class="badge badge-success" id="pw-strength-badge">Very Strong</span>
              </div>

              <div style="background:var(--bg-surface); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color); margin:1.5rem 0; word-break:break-all; font-family:monospace; font-size:1.25rem; font-weight:700; color:var(--primary); text-align:center;" id="pw-display">
                Loading...
              </div>

              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.8125rem; font-weight:600; margin-bottom:0.25rem;">
                  <span>Entropy Security Strength</span>
                  <span id="pw-entropy-text">98 bits</span>
                </div>
                <div style="height:8px; background:var(--border-color); border-radius:4px; overflow:hidden;">
                  <div id="pw-strength-bar" style="width:100%; height:100%; background:var(--success); transition:all 0.3s;"></div>
                </div>
              </div>
            </div>

            <div style="margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-copy-pw" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy Password to Clipboard
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      const lengthSlider = document.getElementById('pw-length');
      const lengthVal = document.getElementById('pw-len-val');
      const checkUpper = document.getElementById('pw-upper');
      const checkLower = document.getElementById('pw-lower');
      const checkNums = document.getElementById('pw-nums');
      const checkSyms = document.getElementById('pw-syms');
      const checkNoAmbig = document.getElementById('pw-no-ambig');
      const btnGen = document.getElementById('btn-gen-pw');
      const btnCopy = document.getElementById('btn-copy-pw');
      const display = document.getElementById('pw-display');
      const strengthBadge = document.getElementById('pw-strength-badge');
      const strengthBar = document.getElementById('pw-strength-bar');
      const entropyText = document.getElementById('pw-entropy-text');

      lengthSlider.addEventListener('input', (e) => {
        lengthVal.textContent = e.target.value;
        generatePassword();
      });

      [checkUpper, checkLower, checkNums, checkSyms, checkNoAmbig].forEach(el => el.addEventListener('change', generatePassword));
      btnGen.addEventListener('click', generatePassword);
      btnCopy.addEventListener('click', () => copyToClipboard(display.textContent.trim(), btnCopy));

      generatePassword();

      function generatePassword() {
        let chars = '';
        if (checkUpper.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (checkLower.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (checkNums.checked) chars += '0123456789';
        if (checkSyms.checked) chars += '!@#$%^&*()_+~|}{[]:;?><,.-=';

        if (checkNoAmbig.checked) {
          chars = chars.replace(/[il1Lo0O|I]/g, '');
        }

        if (!chars) {
          showToast('Select at least one character type!', 'error');
          return;
        }

        const len = parseInt(lengthSlider.value);
        const array = new Uint32Array(len);
        window.crypto.getRandomValues(array);

        let password = '';
        for (let i = 0; i < len; i++) {
          password += chars[array[i] % chars.length];
        }

        display.textContent = password;

        // Entropy
        const poolSize = chars.length;
        const entropy = Math.round(len * Math.log2(poolSize));
        entropyText.textContent = entropy + ' bits';

        if (entropy < 40) {
          strengthBadge.textContent = 'Weak';
          strengthBadge.className = 'badge badge-danger';
          strengthBar.style.width = '25%';
          strengthBar.style.background = 'var(--danger)';
        } else if (entropy < 65) {
          strengthBadge.textContent = 'Moderate';
          strengthBadge.className = 'badge badge-warning';
          strengthBar.style.width = '60%';
          strengthBar.style.background = 'var(--warning)';
        } else {
          strengthBadge.textContent = 'Very Strong';
          strengthBadge.className = 'badge badge-success';
          strengthBar.style.width = '100%';
          strengthBar.style.background = 'var(--success)';
        }
      }
    `
  },

  // 5. CSS Minifier & Beautifier
  "css-minifier": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
              <span>Source CSS</span>
              <button class="btn btn-sm btn-secondary" id="btn-load-css-sample" style="padding:0.2rem 0.5rem; font-size:0.75rem;">Load Sample</button>
            </label>
            <textarea class="form-control" id="css-input" rows="12" style="font-family:monospace; font-size:0.875rem;" placeholder="/* Paste raw CSS code here */&#10;.site-header {&#10;  position: sticky;&#10;  top: 0;&#10;  background: #ffffff;&#10;}"></textarea>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem;">
            <button class="btn btn-primary" id="btn-minify-css">
              <span>⚡ Minify CSS</span>
            </button>
            <button class="btn btn-secondary" id="btn-beautify-css">
              <span>🎨 Format / Beautify</span>
            </button>
          </div>
        </div>

        <div class="workspace-col">
          <div class="stats-grid" style="margin-bottom:1rem;">
            <div class="stat-card">
              <div class="stat-value" id="css-orig-size">0 B</div>
              <div class="stat-label">Original Size</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="css-min-size">0 B</div>
              <div class="stat-label">Minified Size</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="css-savings" style="color:var(--success, #10b981);">0%</div>
              <div class="stat-label">Saved</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Processed Output</label>
            <textarea class="form-control" id="css-output" rows="9" style="font-family:monospace; font-size:0.875rem;" readonly placeholder="Optimized CSS will display here..."></textarea>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem;">
            <button class="btn btn-secondary" id="btn-copy-css">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy CSS</span>
            </button>
            <button class="btn btn-primary" id="btn-download-css">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Download .min.css</span>
            </button>
          </div>
        </div>
      </div>
    `,
    script: `
      const inEl = document.getElementById('css-input');
      const outEl = document.getElementById('css-output');
      const origSizeEl = document.getElementById('css-orig-size');
      const minSizeEl = document.getElementById('css-min-size');
      const savingsEl = document.getElementById('css-savings');
      const btnMinify = document.getElementById('btn-minify-css');
      const btnBeautify = document.getElementById('btn-beautify-css');
      const btnSample = document.getElementById('btn-load-css-sample');
      const btnCopy = document.getElementById('btn-copy-css');
      const btnDownload = document.getElementById('btn-download-css');

      btnSample.addEventListener('click', () => {
        inEl.value = '/* Global Reset & Utility */\\n* {\\n  box-sizing: border-box;\\n  margin: 0px;\\n  padding: 0px;\\n}\\n\\n.site-header {\\n  position: sticky;\\n  top: 0px;\\n  z-index: 100;\\n  background-color: #ffffff;\\n  border-bottom: 1px solid #e2e8f0;\\n}\\n\\n.hero-badge {\\n  display: inline-flex;\\n  padding: 8px 16px;\\n  border-radius: 9999px;\\n}';
        btnMinify.click();
      });

      function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        return (bytes / 1024).toFixed(1) + ' KB';
      }

      function minifyCSS(css) {
        return css
          .replace(/\\/\\*[\\s\\S]*?\\*\\//g, '') // remove comments
          .replace(/\\s*([{}|:;,>+~])\\s*/g, '$1') // remove spaces around symbols
          .replace(/\\b0px\\b/g, '0') // 0px to 0
          .replace(/;}/g, '}') // remove trailing semicolons
          .replace(/\\s+/g, ' ') // collapse remaining spaces
          .trim();
      }

      function beautifyCSS(css) {
        let min = minifyCSS(css);
        return min
          .replace(/\\{/g, ' {\\n  ')
          .replace(/;/g, ';\\n  ')
          .replace(/\\}/g, '\\n}\\n\\n')
          .replace(/\\n  \\n/g, '\\n')
          .trim();
      }

      btnMinify.addEventListener('click', () => {
        const raw = inEl.value;
        if (!raw.trim()) {
          showToast('Please enter CSS code to minify', 'error');
          return;
        }

        const min = minifyCSS(raw);
        outEl.value = min;

        const origBytes = new Blob([raw]).size;
        const minBytes = new Blob([min]).size;
        const saved = origBytes > 0 ? Math.round(((origBytes - minBytes) / origBytes) * 100) : 0;

        origSizeEl.textContent = formatBytes(origBytes);
        minSizeEl.textContent = formatBytes(minBytes);
        savingsEl.textContent = Math.max(0, saved) + '%';
        showToast('CSS minified successfully! ⚡', 'success');
      });

      btnBeautify.addEventListener('click', () => {
        const raw = inEl.value;
        if (!raw.trim()) {
          showToast('Please enter CSS code to format', 'error');
          return;
        }

        const formatted = beautifyCSS(raw);
        outEl.value = formatted;
        showToast('CSS formatted cleanly! 🎨', 'success');
      });

      btnCopy.addEventListener('click', () => {
        if (!outEl.value) return;
        copyToClipboard(outEl.value, btnCopy);
      });

      btnDownload.addEventListener('click', () => {
        if (!outEl.value) return;
        const blob = new Blob([outEl.value], { type: 'text/css;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'styles.min.css';
        a.click();
      });
    `
  }
};
