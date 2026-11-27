/**
 * Workspace definitions & client-side scripts for Unit Converters (4 tools)
 */

module.exports = {
  // 32. KM to Miles Converter
  "km-to-miles": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label">Kilometers (km)</label>
            <input type="number" class="form-control" id="dist-km" value="10" step="any">
          </div>

          <div style="text-align:center; font-size:1.25rem; font-weight:700; color:var(--primary); margin:-0.5rem 0 1rem;">
            ⇅ Equals
          </div>

          <div class="form-group">
            <label class="form-label">Miles (mi)</label>
            <input type="number" class="form-control" id="dist-miles" value="6.2137" step="any">
          </div>

          <div style="background:var(--bg-surface-alt); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-top:1.5rem;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">Standard Formula</div>
            <div style="font-size:0.875rem; color:var(--text-main);">
              <code>Miles = Kilometers × 0.621371</code><br>
              <code>Kilometers = Miles × 1.60934</code>
            </div>
          </div>
        </div>

        <div class="workspace-col">
          <div class="result-box">
            <div class="result-header">
              <span class="result-title">Extended Distance Equivalents</span>
              <span class="badge badge-primary">Converted</span>
            </div>

            <table class="calc-table">
              <tr>
                <td>Meters (m)</td>
                <td style="text-align:right; font-weight:700;" id="dist-m">10,000 m</td>
              </tr>
              <tr>
                <td>Feet (ft)</td>
                <td style="text-align:right; font-weight:700;" id="dist-ft">32,808.4 ft</td>
              </tr>
              <tr>
                <td>Yards (yd)</td>
                <td style="text-align:right; font-weight:700;" id="dist-yd">10,936.1 yd</td>
              </tr>
              <tr>
                <td>Nautical Miles (NM)</td>
                <td style="text-align:right; font-weight:700;" id="dist-nm">5.3996 NM</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    `,
    script: `
      const kmInput = document.getElementById('dist-km');
      const milesInput = document.getElementById('dist-miles');

      kmInput.addEventListener('input', () => {
        const km = parseFloat(kmInput.value);
        if (!isNaN(km)) {
          milesInput.value = (km * 0.621371).toFixed(4);
          updateAll(km);
        }
      });

      milesInput.addEventListener('input', () => {
        const miles = parseFloat(milesInput.value);
        if (!isNaN(miles)) {
          const km = miles * 1.60934;
          kmInput.value = km.toFixed(4);
          updateAll(km);
        }
      });

      updateAll(10);

      function updateAll(km) {
        document.getElementById('dist-m').textContent = (km * 1000).toLocaleString() + ' m';
        document.getElementById('dist-ft').textContent = (km * 3280.84).toLocaleString() + ' ft';
        document.getElementById('dist-yd').textContent = (km * 1093.61).toLocaleString() + ' yd';
        document.getElementById('dist-nm').textContent = (km * 0.539957).toFixed(4) + ' NM';
      }
    `
  },

  // 33. KG to Pounds Converter
  "kg-to-pounds": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label">Kilograms (kg)</label>
            <input type="number" class="form-control" id="wt-kg" value="70" step="any">
          </div>

          <div style="text-align:center; font-size:1.25rem; font-weight:700; color:var(--primary); margin:-0.5rem 0 1rem;">
            ⇅ Equals
          </div>

          <div class="form-group">
            <label class="form-label">Pounds (lbs)</label>
            <input type="number" class="form-control" id="wt-lbs" value="154.32" step="any">
          </div>

          <div style="background:var(--bg-surface-alt); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-top:1.5rem;">
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">Standard Formula</div>
            <div style="font-size:0.875rem; color:var(--text-main);">
              <code>Pounds = Kilograms × 2.20462</code><br>
              <code>Kilograms = Pounds × 0.453592</code>
            </div>
          </div>
        </div>

        <div class="workspace-col">
          <div class="result-box">
            <div class="result-header">
              <span class="result-title">Extended Weight Units</span>
              <span class="badge badge-primary">Converted</span>
            </div>

            <table class="calc-table">
              <tr>
                <td>Grams (g)</td>
                <td style="text-align:right; font-weight:700;" id="wt-g">70,000 g</td>
              </tr>
              <tr>
                <td>Ounces (oz)</td>
                <td style="text-align:right; font-weight:700;" id="wt-oz">2,469.18 oz</td>
              </tr>
              <tr>
                <td>Stones (st)</td>
                <td style="text-align:right; font-weight:700;" id="wt-st">11 st</td>
              </tr>
              <tr>
                <td>Metric Tons (t)</td>
                <td style="text-align:right; font-weight:700;" id="wt-ton">0.07 t</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    `,
    script: `
      const kgInput = document.getElementById('wt-kg');
      const lbsInput = document.getElementById('wt-lbs');

      kgInput.addEventListener('input', () => {
        const kg = parseFloat(kgInput.value);
        if (!isNaN(kg)) {
          lbsInput.value = (kg * 2.20462).toFixed(2);
          updateWeight(kg);
        }
      });

      lbsInput.addEventListener('input', () => {
        const lbs = parseFloat(lbsInput.value);
        if (!isNaN(lbs)) {
          const kg = lbs * 0.453592;
          kgInput.value = kg.toFixed(2);
          updateWeight(kg);
        }
      });

      updateWeight(70);

      function updateWeight(kg) {
        document.getElementById('wt-g').textContent = (kg * 1000).toLocaleString() + ' g';
        document.getElementById('wt-oz').textContent = (kg * 35.274).toFixed(2) + ' oz';
        document.getElementById('wt-st').textContent = (kg * 0.157473).toFixed(2) + ' st';
        document.getElementById('wt-ton').textContent = (kg / 1000).toFixed(4) + ' t';
      }
    `
  },

  // 34. Celsius to Fahrenheit
  "celsius-to-fahrenheit": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label">Celsius (°C)</label>
            <input type="number" class="form-control" id="temp-c" value="25" step="any">
          </div>

          <div style="text-align:center; font-size:1.25rem; font-weight:700; color:var(--primary); margin:-0.5rem 0 1rem;">
            ⇅ Equals
          </div>

          <div class="form-group">
            <label class="form-label">Fahrenheit (°F)</label>
            <input type="number" class="form-control" id="temp-f" value="77" step="any">
          </div>

          <div class="form-group">
            <label class="form-label">Kelvin (K)</label>
            <input type="number" class="form-control" id="temp-k" value="298.15" step="any">
          </div>
        </div>

        <div class="workspace-col">
          <div class="result-box">
            <div class="result-header">
              <span class="result-title">Temperature Benchmarks</span>
              <span class="badge badge-primary">Scientific</span>
            </div>

            <table class="calc-table">
              <tr>
                <td>Absolute Zero</td>
                <td style="text-align:right;">-273.15 °C (-459.67 °F)</td>
              </tr>
              <tr>
                <td>Water Freezes</td>
                <td style="text-align:right;">0 °C (32 °F)</td>
              </tr>
              <tr>
                <td>Room Temperature</td>
                <td style="text-align:right;">21 °C (69.8 °F)</td>
              </tr>
              <tr>
                <td>Human Body Temp</td>
                <td style="text-align:right;">37 °C (98.6 °F)</td>
              </tr>
              <tr>
                <td>Water Boils</td>
                <td style="text-align:right;">100 °C (212 °F)</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    `,
    script: `
      const cInput = document.getElementById('temp-c');
      const fInput = document.getElementById('temp-f');
      const kInput = document.getElementById('temp-k');

      cInput.addEventListener('input', () => {
        const c = parseFloat(cInput.value);
        if (!isNaN(c)) {
          fInput.value = ((c * 9/5) + 32).toFixed(2);
          kInput.value = (c + 273.15).toFixed(2);
        }
      });

      fInput.addEventListener('input', () => {
        const f = parseFloat(fInput.value);
        if (!isNaN(f)) {
          const c = (f - 32) * 5/9;
          cInput.value = c.toFixed(2);
          kInput.value = (c + 273.15).toFixed(2);
        }
      });

      kInput.addEventListener('input', () => {
        const k = parseFloat(kInput.value);
        if (!isNaN(k)) {
          const c = k - 273.15;
          cInput.value = c.toFixed(2);
          fInput.value = ((c * 9/5) + 32).toFixed(2);
        }
      });
    `
  },

  // 35. MB to GB Converter
  "mb-to-gb": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label">Calculation Standard</label>
            <div class="radio-pill-group">
              <div class="radio-pill-item">
                <input type="radio" name="data-base" id="base-1024" value="1024" checked>
                <label for="base-1024">Binary (1024 - OS/RAM)</label>
              </div>
              <div class="radio-pill-item">
                <input type="radio" name="data-base" id="base-1000" value="1000">
                <label for="base-1000">Decimal (1000 - Hard Drives)</label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Megabytes (MB)</label>
            <input type="number" class="form-control" id="data-mb" value="10240" step="any">
          </div>

          <div style="text-align:center; font-size:1.25rem; font-weight:700; color:var(--primary); margin:-0.5rem 0 1rem;">
            ⇅ Equals
          </div>

          <div class="form-group">
            <label class="form-label">Gigabytes (GB)</label>
            <input type="number" class="form-control" id="data-gb" value="10" step="any">
          </div>
        </div>

        <div class="workspace-col">
          <div class="result-box">
            <div class="result-header">
              <span class="result-title">Storage Scale Hierarchy</span>
              <span class="badge badge-primary">Data Capacity</span>
            </div>

            <table class="calc-table">
              <tr>
                <td>Bytes (B)</td>
                <td style="text-align:right; font-weight:700;" id="data-bytes">10,737,418,240 B</td>
              </tr>
              <tr>
                <td>Kilobytes (KB)</td>
                <td style="text-align:right; font-weight:700;" id="data-kb">10,485,760 KB</td>
              </tr>
              <tr>
                <td>Terabytes (TB)</td>
                <td style="text-align:right; font-weight:700;" id="data-tb">0.00976 TB</td>
              </tr>
              <tr>
                <td>Petabytes (PB)</td>
                <td style="text-align:right; font-weight:700;" id="data-pb">0.0000095 PB</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    `,
    script: `
      const mbInput = document.getElementById('data-mb');
      const gbInput = document.getElementById('data-gb');
      const baseRadios = document.querySelectorAll('input[name="data-base"]');

      function getBase() {
        return document.getElementById('base-1024').checked ? 1024 : 1000;
      }

      mbInput.addEventListener('input', () => {
        const mb = parseFloat(mbInput.value);
        if (!isNaN(mb)) {
          const base = getBase();
          gbInput.value = (mb / base).toFixed(4);
          updateHierarchy(mb);
        }
      });

      gbInput.addEventListener('input', () => {
        const gb = parseFloat(gbInput.value);
        if (!isNaN(gb)) {
          const base = getBase();
          const mb = gb * base;
          mbInput.value = mb.toFixed(2);
          updateHierarchy(mb);
        }
      });

      baseRadios.forEach(r => r.addEventListener('change', () => {
        const mb = parseFloat(mbInput.value) || 0;
        const base = getBase();
        gbInput.value = (mb / base).toFixed(4);
        updateHierarchy(mb);
      }));

      updateHierarchy(10240);

      function updateHierarchy(mb) {
        const base = getBase();
        const bytes = mb * base * base;
        const kb = mb * base;
        const tb = mb / (base * base);
        const pb = mb / (base * base * base);

        document.getElementById('data-bytes').textContent = Math.round(bytes).toLocaleString() + ' B';
        document.getElementById('data-kb').textContent = Math.round(kb).toLocaleString() + ' KB';
        document.getElementById('data-tb').textContent = tb.toFixed(6) + ' TB';
        document.getElementById('data-pb').textContent = pb.toFixed(8) + ' PB';
      }
    `
  }
};
