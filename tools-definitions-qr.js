/**
 * Workspace definitions & client-side scripts for QR Code Tools (4 tools)
 */

module.exports = {
  // 19. QR Code Generator
  "qr-code-generator": {
    extraHead: `
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    `,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label">QR Code Content (Text, Link, or Note)</label>
            <textarea class="form-control" id="qr-content" rows="4" placeholder="Enter any URL, text, phone number or message here...">https://smarthub.online</textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Foreground Color</label>
              <input type="color" id="qr-fg" value="#0f172a" style="width:100%; height:42px; border:1px solid var(--border-color); border-radius:var(--radius-sm); cursor:pointer;">
            </div>
            <div class="form-group">
              <label class="form-label">Background Color</label>
              <input type="color" id="qr-bg" value="#ffffff" style="width:100%; height:42px; border:1px solid var(--border-color); border-radius:var(--radius-sm); cursor:pointer;">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Size: <span id="qr-size-val">256px</span></label>
            <input type="range" class="range-slider" id="qr-size" min="150" max="400" step="10" value="256">
          </div>

          <button class="btn btn-primary" id="btn-gen-qr" style="width:100%;">
            Regenerate QR Code
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">Generated QR Code</span>
                <span class="badge badge-success">Ready to Scan</span>
              </div>

              <div class="qr-preview-box">
                <div class="qr-canvas-holder" id="qr-holder"></div>
                <div style="font-size:0.8125rem; color:var(--text-muted); text-align:center;">Point your smartphone camera to scan.</div>
              </div>
            </div>

            <div style="display:flex; gap:0.75rem; margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-download-qr" style="flex:1;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      let qrcode = null;
      const contentInput = document.getElementById('qr-content');
      const fgInput = document.getElementById('qr-fg');
      const bgInput = document.getElementById('qr-bg');
      const sizeInput = document.getElementById('qr-size');
      const holder = document.getElementById('qr-holder');
      const btnGen = document.getElementById('btn-gen-qr');
      const btnDownload = document.getElementById('btn-download-qr');

      sizeInput.addEventListener('input', (e) => {
        document.getElementById('qr-size-val').textContent = e.target.value + 'px';
        generateQR();
      });

      [contentInput, fgInput, bgInput].forEach(el => el.addEventListener('input', generateQR));
      btnGen.addEventListener('click', generateQR);

      generateQR();

      function generateQR() {
        const text = contentInput.value.trim() || 'https://smarthub.online';
        const size = parseInt(sizeInput.value);
        holder.innerHTML = '';

        qrcode = new QRCode(holder, {
          text: text,
          width: size,
          height: size,
          colorDark: fgInput.value,
          colorLight: bgInput.value,
          correctLevel: QRCode.CorrectLevel.H
        });
      }

      btnDownload.addEventListener('click', () => {
        const img = holder.querySelector('img');
        const canvas = holder.querySelector('canvas');
        const link = document.createElement('a');
        link.download = 'smarthub-qrcode.png';
        if (canvas) {
          link.href = canvas.toDataURL('image/png');
        } else if (img) {
          link.href = img.src;
        }
        link.click();
        showToast('QR code downloaded!', 'success');
      });
    `
  },

  // 20. Website QR Code
  "website-qr-code": {
    extraHead: `
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    `,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label">Website URL</label>
            <div style="display:flex; gap:0.5rem;">
              <select class="form-control" id="url-protocol" style="width:110px;">
                <option value="https://">https://</option>
                <option value="http://">http://</option>
              </select>
              <input type="text" class="form-control" id="web-url" placeholder="example.com/landing" value="google.com">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Campaign / Tracking (Optional)</label>
            <input type="text" class="form-control" id="url-params" placeholder="e.g. ?utm_source=qr-poster">
          </div>

          <div class="form-group">
            <label class="form-label">QR Color Theme</label>
            <div class="quick-tags">
              <button class="btn btn-sm btn-primary qr-theme" data-color="#0f172a">Classic Black</button>
              <button class="btn btn-sm btn-secondary qr-theme" data-color="#2563eb">Smart Blue</button>
              <button class="btn btn-sm btn-secondary qr-theme" data-color="#7c3aed">Royal Purple</button>
              <button class="btn btn-sm btn-secondary qr-theme" data-color="#059669">Emerald Green</button>
            </div>
          </div>

          <div style="margin-top:1.5rem; background:var(--bg-surface-alt); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">Target Destination Link</div>
            <div id="full-url-preview" style="font-size:0.875rem; font-weight:600; color:var(--primary); word-break:break-all;">https://google.com</div>
          </div>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">Website QR Code</span>
                <span class="badge badge-primary">Dynamic Preview</span>
              </div>

              <div class="qr-preview-box">
                <div class="qr-canvas-holder" id="web-qr-holder"></div>
                <div style="font-size:0.8125rem; color:var(--text-muted); margin-top:0.5rem;">Scans directly open your website in any browser.</div>
              </div>
            </div>

            <div style="margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-download-web-qr" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Website QR (PNG)
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      let activeColor = '#0f172a';
      const protoSelect = document.getElementById('url-protocol');
      const urlInput = document.getElementById('web-url');
      const paramsInput = document.getElementById('url-params');
      const holder = document.getElementById('web-qr-holder');
      const btnDownload = document.getElementById('btn-download-web-qr');

      [protoSelect, urlInput, paramsInput].forEach(el => el.addEventListener('input', buildWebQR));

      document.querySelectorAll('.qr-theme').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.qr-theme').forEach(b => {
            b.classList.remove('btn-primary');
            b.classList.add('btn-secondary');
          });
          btn.classList.add('btn-primary');
          btn.classList.remove('btn-secondary');
          activeColor = btn.dataset.color;
          buildWebQR();
        });
      });

      buildWebQR();

      function buildWebQR() {
        let raw = urlInput.value.trim().replace(/^https?:\\/\\//, '');
        if (!raw) raw = 'smarthub.online';
        let full = protoSelect.value + raw;
        const extra = paramsInput.value.trim();
        if (extra) {
          full += (extra.startsWith('?') || extra.startsWith('&') ? extra : '?' + extra);
        }

        document.getElementById('full-url-preview').textContent = full;
        holder.innerHTML = '';

        new QRCode(holder, {
          text: full,
          width: 240,
          height: 240,
          colorDark: activeColor,
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      }

      btnDownload.addEventListener('click', () => {
        const canvas = holder.querySelector('canvas');
        const img = holder.querySelector('img');
        const link = document.createElement('a');
        link.download = 'website-qr-code.png';
        link.href = canvas ? canvas.toDataURL('image/png') : (img ? img.src : '');
        link.click();
        showToast('Downloaded website QR code!', 'success');
      });
    `
  },

  // 21. WhatsApp QR Code
  "whatsapp-qr-code": {
    extraHead: `
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    `,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label">Phone Number (with Country Code)</label>
            <div style="display:flex; gap:0.5rem;">
              <select class="form-control" id="wa-country" style="width:130px;">
                <option value="91">+91 (India)</option>
                <option value="1">+1 (US/Canada)</option>
                <option value="44">+44 (UK)</option>
                <option value="61">+61 (Australia)</option>
                <option value="49">+49 (Germany)</option>
                <option value="971">+971 (UAE)</option>
              </select>
              <input type="tel" class="form-control" id="wa-phone" placeholder="e.g. 9876543210" value="9876543210">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Pre-filled Greeting Message (Optional)</label>
            <textarea class="form-control" id="wa-msg" rows="3" placeholder="Hello! I would like to inquire about your tools...">Hello! I found your contact on SmartHub.</textarea>
          </div>

          <div style="background:var(--bg-surface-alt); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-top:1rem;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">Direct Chat Link</div>
            <div id="wa-link-preview" style="font-size:0.875rem; font-weight:600; color:var(--primary); word-break:break-all;"></div>
          </div>

          <div style="display:flex; gap:0.5rem; margin-top:1rem;">
            <button class="btn btn-secondary" id="btn-copy-wa-link" style="flex:1;">
              Copy Link
            </button>
            <a href="#" target="_blank" class="btn btn-primary" id="btn-test-wa" style="flex:1;">
              Test Chat
            </a>
          </div>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">WhatsApp Scan to Chat</span>
                <span class="badge badge-success" style="background:#25d366; color:#fff;">WhatsApp</span>
              </div>

              <div class="qr-preview-box">
                <div class="qr-canvas-holder" id="wa-qr-holder"></div>
                <div style="font-size:0.8125rem; color:var(--text-muted); text-align:center;">Scan with smartphone camera to launch WhatsApp directly.</div>
              </div>
            </div>

            <div style="margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-download-wa-qr" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download WhatsApp QR Code
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      const countrySelect = document.getElementById('wa-country');
      const phoneInput = document.getElementById('wa-phone');
      const msgInput = document.getElementById('wa-msg');
      const holder = document.getElementById('wa-qr-holder');
      const linkPreview = document.getElementById('wa-link-preview');
      const btnCopy = document.getElementById('btn-copy-wa-link');
      const testLink = document.getElementById('btn-test-wa');
      const btnDownload = document.getElementById('btn-download-wa-qr');

      [countrySelect, phoneInput, msgInput].forEach(el => el.addEventListener('input', generateWA));

      generateWA();

      function generateWA() {
        const country = countrySelect.value;
        const cleanPhone = phoneInput.value.replace(/\\D/g, '');
        const fullNumber = country + cleanPhone;
        const text = encodeURIComponent(msgInput.value.trim());

        let url = 'https://wa.me/' + fullNumber;
        if (text) url += '?text=' + text;

        linkPreview.textContent = url;
        testLink.href = url;
        holder.innerHTML = '';

        new QRCode(holder, {
          text: url,
          width: 240,
          height: 240,
          colorDark: '#075e54',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      }

      btnCopy.addEventListener('click', () => {
        copyToClipboard(linkPreview.textContent, btnCopy);
      });

      btnDownload.addEventListener('click', () => {
        const canvas = holder.querySelector('canvas');
        const img = holder.querySelector('img');
        const link = document.createElement('a');
        link.download = 'whatsapp-qr-code.png';
        link.href = canvas ? canvas.toDataURL('image/png') : (img ? img.src : '');
        link.click();
        showToast('Downloaded WhatsApp QR!', 'success');
      });
    `
  },

  // 22. WiFi QR Code
  "wifi-qr-code": {
    extraHead: `
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    `,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label">Network Name (SSID)</label>
            <input type="text" class="form-control" id="wifi-ssid" placeholder="e.g. Home_WiFi_5G" value="MySmartHub_WiFi">
          </div>

          <div class="form-group">
            <label class="form-label">Encryption Type</label>
            <select class="form-control" id="wifi-type">
              <option value="WPA" selected>WPA / WPA2 / WPA3 (Standard)</option>
              <option value="WEP">WEP (Older routers)</option>
              <option value="nopass">None (Open Network)</option>
            </select>
          </div>

          <div class="form-group" id="wifi-pass-group">
            <label class="form-label">Network Password</label>
            <div style="position:relative;">
              <input type="password" class="form-control" id="wifi-pass" placeholder="Enter Wi-Fi password" value="SuperSecure123">
              <button class="btn btn-sm" id="btn-toggle-eye" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); font-size:0.8rem; color:var(--text-muted);">Show</button>
            </div>
          </div>

          <div class="form-group">
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="wifi-hidden">
              <span style="font-size:0.875rem; font-weight:600;">Hidden Network (SSID is not broadcast)</span>
            </label>
          </div>

          <div style="background:var(--bg-surface-alt); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-top:1rem;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">Standard WiFi String</div>
            <div id="wifi-raw-string" style="font-size:0.8125rem; font-family:monospace; color:var(--text-main); word-break:break-all;">WIFI:T:WPA;S:MySmartHub_WiFi;P:SuperSecure123;;</div>
          </div>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">WiFi QR Code</span>
                <span class="badge badge-success">Scan to Connect</span>
              </div>

              <div class="qr-preview-box">
                <div class="qr-canvas-holder" id="wifi-qr-holder"></div>
                <div style="font-size:0.8125rem; color:var(--text-muted); text-align:center; max-width:240px;">Guests can connect instantly without typing any password!</div>
              </div>
            </div>

            <div style="margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-download-wifi-qr" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download WiFi QR Code (Printable)
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      const ssidInput = document.getElementById('wifi-ssid');
      const typeSelect = document.getElementById('wifi-type');
      const passInput = document.getElementById('wifi-pass');
      const hiddenCheck = document.getElementById('wifi-hidden');
      const holder = document.getElementById('wifi-qr-holder');
      const rawString = document.getElementById('wifi-raw-string');
      const btnToggle = document.getElementById('btn-toggle-eye');
      const btnDownload = document.getElementById('btn-download-wifi-qr');

      btnToggle.addEventListener('click', () => {
        if (passInput.type === 'password') {
          passInput.type = 'text';
          btnToggle.textContent = 'Hide';
        } else {
          passInput.type = 'password';
          btnToggle.textContent = 'Show';
        }
      });

      typeSelect.addEventListener('change', () => {
        document.getElementById('wifi-pass-group').style.display = typeSelect.value === 'nopass' ? 'none' : 'block';
        generateWiFiQR();
      });

      [ssidInput, passInput, hiddenCheck].forEach(el => el.addEventListener('input', generateWiFiQR));

      generateWiFiQR();

      function generateWiFiQR() {
        const ssid = ssidInput.value.trim() || 'MyWiFi';
        const type = typeSelect.value;
        const pass = passInput.value;
        const isHidden = hiddenCheck.checked;

        // Escape standard characters for Wi-Fi URI scheme
        const escapeW = (str) => str.replace(/([\\\\;,:"])/g, '\\\\$1');

        let payload = 'WIFI:T:' + type + ';S:' + escapeW(ssid) + ';';
        if (type !== 'nopass') {
          payload += 'P:' + escapeW(pass) + ';';
        }
        if (isHidden) {
          payload += 'H:true;';
        }
        payload += ';';

        rawString.textContent = payload;
        holder.innerHTML = '';

        new QRCode(holder, {
          text: payload,
          width: 240,
          height: 240,
          colorDark: '#0f172a',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      }

      btnDownload.addEventListener('click', () => {
        const canvas = holder.querySelector('canvas');
        const img = holder.querySelector('img');
        const link = document.createElement('a');
        link.download = 'wifi-connect-qr.png';
        link.href = canvas ? canvas.toDataURL('image/png') : (img ? img.src : '');
        link.click();
        showToast('Downloaded WiFi QR code!', 'success');
      });
    `
  }
};
