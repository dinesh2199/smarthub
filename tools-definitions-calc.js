/**
 * Workspace definitions & client-side scripts for Calculators (6 tools)
 */

module.exports = {
  // 13. Age Calculator
  "age-calculator": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label">Date of Birth</label>
            <input type="date" class="form-control" id="dob-input" value="2000-01-01">
          </div>

          <div class="form-group">
            <label class="form-label">Age at the Date of</label>
            <input type="date" class="form-control" id="ref-date-input">
            <div class="form-hint">Defaults to today's date.</div>
          </div>

          <button class="btn btn-primary" id="btn-calc-age" style="width:100%; margin-top:1rem;">
            Calculate Exact Age
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box">
            <div class="result-header">
              <span class="result-title">Exact Age Breakdown</span>
              <span class="badge badge-primary">Accurate</span>
            </div>

            <div style="text-align:center; margin-bottom:1.5rem;">
              <div class="stat-label">Your Age Is</div>
              <div class="result-value-big" id="age-primary-display">26 Years, 0 Months, 0 Days</div>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value" id="age-years" style="font-size:1.35rem;">26</div>
                <div class="stat-label">Years</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" id="age-months" style="font-size:1.35rem;">312</div>
                <div class="stat-label">Total Months</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" id="age-days" style="font-size:1.35rem;">9,496</div>
                <div class="stat-label">Total Days</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" id="age-hours" style="font-size:1.35rem;">227.9k</div>
                <div class="stat-label">Total Hours</div>
              </div>
            </div>

            <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-top:1rem;">
              <h4 style="font-size:0.875rem; font-weight:700; margin-bottom:0.25rem;">Next Birthday:</h4>
              <p style="font-size:0.875rem; color:var(--text-muted);" id="next-birthday-info">Calculating...</p>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      const dobInput = document.getElementById('dob-input');
      const refDateInput = document.getElementById('ref-date-input');
      const btnCalc = document.getElementById('btn-calc-age');

      // Set default ref date to today
      const today = new Date();
      refDateInput.value = today.toISOString().split('T')[0];

      btnCalc.addEventListener('click', calculateAge);
      dobInput.addEventListener('change', calculateAge);
      refDateInput.addEventListener('change', calculateAge);

      calculateAge();

      function calculateAge() {
        const dobVal = dobInput.value;
        const refVal = refDateInput.value;

        if (!dobVal || !refVal) return;

        const dob = new Date(dobVal);
        const ref = new Date(refVal);

        if (dob > ref) {
          showToast('Birth date cannot be after the reference date!', 'error');
          return;
        }

        let years = ref.getFullYear() - dob.getFullYear();
        let months = ref.getMonth() - dob.getMonth();
        let days = ref.getDate() - dob.getDate();

        if (days < 0) {
          months--;
          const prevMonthLastDay = new Date(ref.getFullYear(), ref.getMonth(), 0).getDate();
          days += prevMonthLastDay;
        }

        if (months < 0) {
          years--;
          months += 12;
        }

        document.getElementById('age-primary-display').textContent = years + ' Years, ' + months + ' Months, ' + days + ' Days';
        document.getElementById('age-years').textContent = years;

        const diffMs = ref.getTime() - dob.getTime();
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalMonths = (years * 12) + months;
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

        document.getElementById('age-months').textContent = totalMonths.toLocaleString();
        document.getElementById('age-days').textContent = totalDays.toLocaleString();
        document.getElementById('age-hours').textContent = totalHours.toLocaleString();

        // Next Birthday calculation
        let nextBdayYear = ref.getFullYear();
        let nextBday = new Date(nextBdayYear, dob.getMonth(), dob.getDate());
        if (nextBday < ref) {
          nextBday = new Date(nextBdayYear + 1, dob.getMonth(), dob.getDate());
        }

        const daysToBday = Math.ceil((nextBday.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const bdayDayName = dayNames[nextBday.getDay()];

        document.getElementById('next-birthday-info').textContent = 
          nextBday.toDateString() + ' (' + bdayDayName + ') • ' + (daysToBday === 0 ? "🎉 Today is your birthday!" : daysToBday + ' day(s) remaining');
      }
    `
  },

  // 14. GST Calculator
  "gst-calculator": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label">Initial Amount ($ / ₹)</label>
            <input type="number" class="form-control" id="gst-amount" value="10000" min="0" step="any">
          </div>

          <div class="form-group">
            <label class="form-label">GST Rate (%)</label>
            <div class="radio-pill-group" style="margin-bottom:0.75rem;">
              <div class="radio-pill-item">
                <input type="radio" name="gst-rate-radio" id="gst-r5" value="5">
                <label for="gst-r5">5%</label>
              </div>
              <div class="radio-pill-item">
                <input type="radio" name="gst-rate-radio" id="gst-r12" value="12">
                <label for="gst-r12">12%</label>
              </div>
              <div class="radio-pill-item">
                <input type="radio" name="gst-rate-radio" id="gst-r18" value="18" checked>
                <label for="gst-r18">18%</label>
              </div>
              <div class="radio-pill-item">
                <input type="radio" name="gst-rate-radio" id="gst-r28" value="28">
                <label for="gst-r28">28%</label>
              </div>
            </div>
            <input type="number" class="form-control" id="custom-gst-rate" placeholder="Or enter custom % rate" value="18">
          </div>

          <div class="form-group">
            <label class="form-label">Tax Calculation Type</label>
            <div class="radio-pill-group">
              <div class="radio-pill-item">
                <input type="radio" name="gst-type" id="gst-exclusive" value="exclusive" checked>
                <label for="gst-exclusive">GST Exclusive (Add GST)</label>
              </div>
              <div class="radio-pill-item">
                <input type="radio" name="gst-type" id="gst-inclusive" value="inclusive">
                <label for="gst-inclusive">GST Inclusive (Remove GST)</label>
              </div>
            </div>
          </div>

          <button class="btn btn-primary" id="btn-calc-gst" style="width:100%;">
            Calculate GST
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box">
            <div class="result-header">
              <span class="result-title">GST Tax Breakdown</span>
              <span class="badge badge-success">Calculated</span>
            </div>

            <div style="text-align:center; margin-bottom:1.5rem;">
              <div class="stat-label">Total Gross Amount</div>
              <div class="result-value-big" id="gst-total-amount">₹ 11,800.00</div>
            </div>

            <table class="calc-table">
              <tr>
                <td>Net / Base Amount</td>
                <td style="font-weight:700; text-align:right;" id="gst-net-amount">₹ 10,000.00</td>
              </tr>
              <tr>
                <td>GST Tax Amount (<span id="gst-rate-label">18%</span>)</td>
                <td style="font-weight:700; color:var(--primary); text-align:right;" id="gst-tax-amount">₹ 1,800.00</td>
              </tr>
              <tr>
                <td>CGST (Central Tax: <span id="cgst-rate">9%</span>)</td>
                <td style="text-align:right;" id="cgst-amount">₹ 900.00</td>
              </tr>
              <tr>
                <td>SGST (State Tax: <span id="sgst-rate">9%</span>)</td>
                <td style="text-align:right;" id="sgst-amount">₹ 900.00</td>
              </tr>
            </table>

            <div style="margin-top:1.5rem;">
              <button class="btn btn-secondary" style="width:100%;" id="btn-copy-gst">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy Calculation Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      const amountInput = document.getElementById('gst-amount');
      const customRateInput = document.getElementById('custom-gst-rate');
      const rateRadios = document.querySelectorAll('input[name="gst-rate-radio"]');
      const typeRadios = document.querySelectorAll('input[name="gst-type"]');
      const btnCalc = document.getElementById('btn-calc-gst');
      const btnCopy = document.getElementById('btn-copy-gst');

      rateRadios.forEach(r => {
        r.addEventListener('change', () => {
          customRateInput.value = r.value;
          calcGst();
        });
      });

      customRateInput.addEventListener('input', () => {
        rateRadios.forEach(r => r.checked = (r.value === customRateInput.value));
        calcGst();
      });

      amountInput.addEventListener('input', calcGst);
      typeRadios.forEach(r => r.addEventListener('change', calcGst));
      btnCalc.addEventListener('click', calcGst);

      calcGst();

      function calcGst() {
        const amount = parseFloat(amountInput.value) || 0;
        const rate = parseFloat(customRateInput.value) || 0;
        const isExclusive = document.getElementById('gst-exclusive').checked;

        let net = 0;
        let gst = 0;
        let total = 0;

        if (isExclusive) {
          net = amount;
          gst = (net * rate) / 100;
          total = net + gst;
        } else {
          total = amount;
          net = total / (1 + (rate / 100));
          gst = total - net;
        }

        const cgst = gst / 2;
        const sgst = gst / 2;

        document.getElementById('gst-total-amount').textContent = '₹ ' + total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('gst-net-amount').textContent = '₹ ' + net.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('gst-tax-amount').textContent = '₹ ' + gst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('cgst-amount').textContent = '₹ ' + cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('sgst-amount').textContent = '₹ ' + sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        document.getElementById('gst-rate-label').textContent = rate + '%';
        document.getElementById('cgst-rate').textContent = (rate/2) + '%';
        document.getElementById('sgst-rate').textContent = (rate/2) + '%';
      }

      btnCopy.addEventListener('click', () => {
        const summary = 'GST Calculation Summary:\\n' +
          'Total Amount: ' + document.getElementById('gst-total-amount').textContent + '\\n' +
          'Net Amount: ' + document.getElementById('gst-net-amount').textContent + '\\n' +
          'GST Tax: ' + document.getElementById('gst-tax-amount').textContent + ' (' + customRateInput.value + '%)';
        copyToClipboard(summary, btnCopy);
      });
    `
  },

  // 15. Invoice Generator
  "invoice-generator": {
    extraHead: `
      <style>
        @media print {
          body * { visibility: hidden !important; }
          .site-header, .site-footer, .breadcrumbs, .tool-header-section, .ad-slot-wrapper, .tool-seo-content, .section, #invoice-actions-bar, .invoice-btn-row { display: none !important; }
          #invoice-printable, #invoice-printable * { visibility: visible !important; }
          #invoice-printable { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; border: none !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important; }
        }
      </style>
    `,
    renderWorkspace: () => `
      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        <!-- Top Action Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; background:var(--bg-surface); padding:1rem 1.25rem; border:1px solid var(--border-color); border-radius:var(--radius-md);" id="invoice-actions-bar">
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <span style="font-weight:700; font-size:0.875rem; color:var(--text-main);">Currency:</span>
            <select class="form-control" id="inv-currency" style="width:auto; min-height:38px; padding:0.25rem 0.75rem;">
              <option value="₹">₹ INR (Indian Rupee)</option>
              <option value="$">$ USD (US Dollar)</option>
              <option value="€">€ EUR (Euro)</option>
              <option value="£">£ GBP (British Pound)</option>
              <option value="AED">AED (UAE Dirham)</option>
            </select>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-load-sample">Load Sample</button>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-clear-invoice">Reset</button>
            <button type="button" class="btn btn-primary btn-sm" id="btn-print-invoice" style="display:flex; align-items:center; gap:0.5rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print / Save as PDF
            </button>
          </div>
        </div>

        <!-- Printable Invoice Container -->
        <div id="invoice-printable" style="background:#ffffff; color:#0f172a; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-md);">
          <!-- Header: Business & Invoice Details -->
          <div class="inv-header-grid" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1.5rem; border-bottom:2px solid #2563eb; padding-bottom:1.5rem; margin-bottom:1.5rem;">
            <div style="flex:1; min-width:260px;">
              <input type="text" id="inv-company-name" value="SmartHub Digital Technologies" style="font-size:1.5rem; font-weight:800; border:none; outline:none; width:100%; color:#1e293b; background:transparent; margin-bottom:0.25rem;">
              <input type="text" id="inv-company-gst" value="GSTIN: 07AAAAA0000A1Z5" placeholder="GSTIN / Tax ID" style="font-size:0.875rem; border:none; outline:none; width:100%; color:#64748b; background:transparent; margin-bottom:0.25rem;">
              <textarea id="inv-company-address" rows="2" style="font-size:0.875rem; border:none; outline:none; width:100%; resize:none; color:#64748b; background:transparent;" placeholder="Address, City, State, PIN">123 Business Hub, Connaught Place, New Delhi, 110001</textarea>
              <input type="text" id="inv-company-email" value="billing@smarthub.online | +91 98765 43210" style="font-size:0.875rem; border:none; outline:none; width:100%; color:#64748b; background:transparent;">
            </div>
            <div class="inv-dates-col" style="text-align:right; min-width:220px;">
              <h2 style="font-size:1.75rem; font-weight:900; color:#2563eb; margin:0 0 0.5rem; text-transform:uppercase; letter-spacing:1px;">TAX INVOICE</h2>
              <div style="display:flex; justify-content:flex-end; gap:0.5rem; align-items:center; margin-bottom:0.25rem;">
                <span style="font-size:0.875rem; font-weight:600; color:#64748b;">Invoice #:</span>
                <input type="text" id="inv-number" value="INV-2026-001" style="font-size:0.875rem; font-weight:700; width:120px; text-align:right; border:1px solid #cbd5e1; border-radius:4px; padding:2px 6px;">
              </div>
              <div style="display:flex; justify-content:flex-end; gap:0.5rem; align-items:center; margin-bottom:0.25rem;">
                <span style="font-size:0.875rem; font-weight:600; color:#64748b;">Date:</span>
                <input type="date" id="inv-date" style="font-size:0.875rem; width:130px; text-align:right; border:1px solid #cbd5e1; border-radius:4px; padding:2px 6px;">
              </div>
              <div style="display:flex; justify-content:flex-end; gap:0.5rem; align-items:center;">
                <span style="font-size:0.875rem; font-weight:600; color:#64748b;">Due Date:</span>
                <input type="date" id="inv-due-date" style="font-size:0.875rem; width:130px; text-align:right; border:1px solid #cbd5e1; border-radius:4px; padding:2px 6px;">
              </div>
            </div>
          </div>

          <!-- Billed To Details -->
          <div style="margin-bottom:1.5rem; background:#f8fafc; padding:1rem; border-radius:8px; border:1px solid #e2e8f0;">
            <span style="font-size:0.75rem; font-weight:700; color:#2563eb; text-transform:uppercase; letter-spacing:0.5px;">Billed To / Customer Details</span>
            <div class="inv-billed-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:0.5rem;">
              <div>
                <input type="text" id="inv-client-name" value="Acme Global Solutions Pvt Ltd" placeholder="Client / Business Name" style="font-size:1rem; font-weight:700; width:100%; border:none; outline:none; background:transparent; margin-bottom:0.25rem;">
                <input type="text" id="inv-client-gst" value="GSTIN: 29BBBBB1111B1Z2" placeholder="Client GSTIN / Tax ID" style="font-size:0.8125rem; width:100%; border:none; outline:none; background:transparent; color:#64748b;">
              </div>
              <div>
                <input type="text" id="inv-client-email" value="contact@acme.com" placeholder="Client Email / Phone" style="font-size:0.8125rem; width:100%; border:none; outline:none; background:transparent; color:#64748b; margin-bottom:0.25rem;">
                <input type="text" id="inv-client-address" value="456 MG Road, Bengaluru, Karnataka, 560001" placeholder="Client Address" style="font-size:0.8125rem; width:100%; border:none; outline:none; background:transparent; color:#64748b;">
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <div style="overflow-x:auto; -webkit-overflow-scrolling:touch; margin-bottom:1rem; max-width:100%;">
            <table style="width:100%; min-width:540px; border-collapse:collapse;" id="inv-table">
              <thead>
                <tr style="background:#f1f5f9; color:#475569; font-size:0.8125rem; text-transform:uppercase;">
                  <th style="padding:0.75rem; text-align:left; border:1px solid #cbd5e1;">Description</th>
                  <th style="padding:0.75rem; text-align:center; width:75px; border:1px solid #cbd5e1;">Qty</th>
                  <th style="padding:0.75rem; text-align:right; width:120px; border:1px solid #cbd5e1;">Rate</th>
                  <th style="padding:0.75rem; text-align:right; width:95px; border:1px solid #cbd5e1;">GST %</th>
                  <th style="padding:0.75rem; text-align:right; width:130px; border:1px solid #cbd5e1;">Total</th>
                  <th style="padding:0.75rem; text-align:center; width:45px; border:1px solid #cbd5e1;" class="invoice-btn-row">✕</th>
                </tr>
              </thead>
              <tbody id="inv-items-body"></tbody>
            </table>
          </div>

          <button type="button" class="btn btn-secondary btn-sm invoice-btn-row" id="btn-add-item" style="margin-bottom:1.5rem;">
            + Add Line Item
          </button>

          <!-- Totals & Notes Section -->
          <div class="inv-totals-wrap" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1.5rem;">
            <div style="flex:1; min-width:250px;">
              <label style="font-size:0.75rem; font-weight:700; color:#475569; text-transform:uppercase; display:block; margin-bottom:0.35rem;">Bank / Payment Details</label>
              <textarea id="inv-bank-notes" rows="3" style="width:100%; font-size:0.8125rem; border:1px solid #cbd5e1; border-radius:6px; padding:0.5rem; color:#475569;">Bank: HDFC Bank | A/C: 50200012345678 | IFSC: HDFC0001234 | UPI: billing@upi</textarea>
              
              <label style="font-size:0.75rem; font-weight:700; color:#475569; text-transform:uppercase; display:block; margin-top:0.75rem; margin-bottom:0.35rem;">Terms & Conditions</label>
              <textarea id="inv-terms" rows="2" style="width:100%; font-size:0.8125rem; border:1px solid #cbd5e1; border-radius:6px; padding:0.5rem; color:#475569;">1. Payment due within 15 days. 2. Thank you for your business!</textarea>
            </div>

            <div class="inv-totals-box" style="width:280px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:1rem;">
              <div style="display:flex; justify-content:space-between; font-size:0.875rem; margin-bottom:0.5rem; color:#475569;">
                <span>Subtotal:</span>
                <span id="inv-subtotal" style="font-weight:700;">₹ 0.00</span>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:0.875rem; margin-bottom:0.5rem; color:#475569;">
                <span>Total Tax (GST):</span>
                <span id="inv-tax-total" style="font-weight:700;">₹ 0.00</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.875rem; margin-bottom:0.75rem; color:#475569;">
                <span>Discount:</span>
                <input type="number" id="inv-discount" value="0" min="0" style="width:80px; text-align:right; font-size:0.875rem; border:1px solid #cbd5e1; border-radius:4px; padding:2px 4px;">
              </div>
              <div style="display:flex; justify-content:space-between; font-size:1.15rem; font-weight:800; color:#2563eb; border-top:2px solid #2563eb; padding-top:0.75rem;">
                <span>Grand Total:</span>
                <span id="inv-grand-total">₹ 0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      let items = [
        { desc: 'Professional Web Design & Development', qty: 1, rate: 25000, tax: 18 },
        { desc: 'SEO Setup & Performance Optimization', qty: 1, rate: 8000, tax: 18 }
      ];

      const todayStr = new Date().toISOString().split('T')[0];
      const dueStr = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];
      document.getElementById('inv-date').value = todayStr;
      document.getElementById('inv-due-date').value = dueStr;

      const currencySelect = document.getElementById('inv-currency');
      const discountInput = document.getElementById('inv-discount');
      const tbody = document.getElementById('inv-items-body');

      currencySelect.addEventListener('change', renderInvoice);
      discountInput.addEventListener('input', renderInvoice);

      document.getElementById('btn-add-item').addEventListener('click', () => {
        items.push({ desc: 'New Item or Service', qty: 1, rate: 1000, tax: 18 });
        renderInvoice();
      });

      document.getElementById('btn-print-invoice').addEventListener('click', () => {
        window.print();
      });

      document.getElementById('btn-load-sample').addEventListener('click', () => {
        items = [
          { desc: 'Website Redesign & Frontend Development', qty: 1, rate: 35000, tax: 18 },
          { desc: 'Speed Optimization & Core Web Vitals', qty: 1, rate: 7500, tax: 18 },
          { desc: 'Annual Cloud Maintenance', qty: 12, rate: 1000, tax: 18 }
        ];
        renderInvoice();
        showToast('Sample invoice data loaded!', 'success');
      });

      document.getElementById('btn-clear-invoice').addEventListener('click', () => {
        items = [{ desc: '', qty: 1, rate: 0, tax: 0 }];
        discountInput.value = 0;
        renderInvoice();
        showToast('Invoice reset.', 'info');
      });

      function renderInvoice() {
        const cur = currencySelect.value;
        tbody.innerHTML = '';
        let subtotal = 0;
        let totalTax = 0;

        items.forEach((item, index) => {
          const itemBase = (item.qty || 0) * (item.rate || 0);
          const itemTax = (itemBase * (item.tax || 0)) / 100;
          const itemTotal = itemBase + itemTax;

          subtotal += itemBase;
          totalTax += itemTax;

          const tr = document.createElement('tr');
          tr.style.borderBottom = '1px solid #e2e8f0';
          tr.innerHTML = \`
            <td style="padding:0.5rem; border:1px solid #cbd5e1;">
              <input type="text" class="item-desc" data-idx="\${index}" value="\${item.desc}" placeholder="Item description" style="width:100%; border:none; outline:none; background:transparent; font-size:0.875rem;">
            </td>
            <td style="padding:0.5rem; text-align:center; border:1px solid #cbd5e1;">
              <input type="number" class="item-qty" data-idx="\${index}" value="\${item.qty}" min="1" style="width:50px; text-align:center; border:1px solid #cbd5e1; border-radius:4px; font-size:0.875rem; padding:2px;">
            </td>
            <td style="padding:0.5rem; text-align:right; border:1px solid #cbd5e1;">
              <input type="number" class="item-rate" data-idx="\${index}" value="\${item.rate}" min="0" step="any" style="width:90px; text-align:right; border:1px solid #cbd5e1; border-radius:4px; font-size:0.875rem; padding:2px;">
            </td>
            <td style="padding:0.5rem; text-align:right; border:1px solid #cbd5e1;">
              <select class="item-tax" data-idx="\${index}" style="border:1px solid #cbd5e1; border-radius:4px; font-size:0.8125rem; padding:2px;">
                <option value="0" \${item.tax === 0 ? 'selected' : ''}>0%</option>
                <option value="5" \${item.tax === 5 ? 'selected' : ''}>5%</option>
                <option value="12" \${item.tax === 12 ? 'selected' : ''}>12%</option>
                <option value="18" \${item.tax === 18 ? 'selected' : ''}>18%</option>
                <option value="28" \${item.tax === 28 ? 'selected' : ''}>28%</option>
              </select>
            </td>
            <td style="padding:0.5rem; text-align:right; font-weight:700; border:1px solid #cbd5e1; font-size:0.875rem;">
              \${cur} \${itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td style="padding:0.5rem; text-align:center; border:1px solid #cbd5e1;" class="invoice-btn-row">
              <button type="button" class="btn-remove-item" data-idx="\${index}" style="background:none; border:none; color:#ef4444; font-weight:700; cursor:pointer;">✕</button>
            </td>
          \`;
          tbody.appendChild(tr);
        });

        document.querySelectorAll('.item-desc').forEach(el => el.addEventListener('input', e => {
          items[e.target.dataset.idx].desc = e.target.value;
        }));
        document.querySelectorAll('.item-qty').forEach(el => el.addEventListener('input', e => {
          items[e.target.dataset.idx].qty = parseFloat(e.target.value) || 0;
          renderInvoice();
        }));
        document.querySelectorAll('.item-rate').forEach(el => el.addEventListener('input', e => {
          items[e.target.dataset.idx].rate = parseFloat(e.target.value) || 0;
          renderInvoice();
        }));
        document.querySelectorAll('.item-tax').forEach(el => el.addEventListener('change', e => {
          items[e.target.dataset.idx].tax = parseFloat(e.target.value) || 0;
          renderInvoice();
        }));
        document.querySelectorAll('.btn-remove-item').forEach(el => el.addEventListener('click', e => {
          if (items.length > 1) {
            items.splice(e.target.dataset.idx, 1);
            renderInvoice();
          } else {
            showToast('Invoice must have at least one line item.', 'info');
          }
        }));

        const discount = parseFloat(discountInput.value) || 0;
        const grandTotal = Math.max(0, subtotal + totalTax - discount);

        document.getElementById('inv-subtotal').textContent = cur + ' ' + subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('inv-tax-total').textContent = cur + ' ' + totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('inv-grand-total').textContent = cur + ' ' + grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      renderInvoice();
    `
  },

  // 16. EMI Calculator
  "emi-calculator": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <div class="range-header">
              <label class="form-label">Loan Amount</label>
              <input type="number" class="form-control" id="emi-amount" value="1000000" style="width:150px; text-align:right;">
            </div>
            <input type="range" class="range-slider" id="emi-amount-range" min="50000" max="10000000" step="50000" value="1000000">
          </div>

          <div class="form-group">
            <div class="range-header">
              <label class="form-label">Interest Rate (% p.a.)</label>
              <input type="number" class="form-control" id="emi-rate" value="8.5" step="0.1" style="width:100px; text-align:right;">
            </div>
            <input type="range" class="range-slider" id="emi-rate-range" min="1" max="25" step="0.1" value="8.5">
          </div>

          <div class="form-group">
            <div class="range-header">
              <label class="form-label">Loan Tenure (Years)</label>
              <input type="number" class="form-control" id="emi-tenure" value="5" min="1" max="30" style="width:100px; text-align:right;">
            </div>
            <input type="range" class="range-slider" id="emi-tenure-range" min="1" max="30" value="5">
          </div>

          <button class="btn btn-primary" id="btn-calc-emi" style="width:100%;">
            Calculate EMI
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box">
            <div class="result-header">
              <span class="result-title">Monthly Payment</span>
              <span class="badge badge-primary">Loan Breakdown</span>
            </div>

            <div style="text-align:center; margin-bottom:1.5rem;">
              <div class="stat-label">Monthly EMI Payment</div>
              <div class="result-value-big" id="emi-monthly-val">₹ 20,517</div>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value" id="emi-principal-disp" style="font-size:1.35rem; color:var(--text-main);">₹ 10.0L</div>
                <div class="stat-label">Principal Loan</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" id="emi-interest-disp" style="font-size:1.35rem; color:var(--purple);">₹ 2.31L</div>
                <div class="stat-label">Total Interest</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" id="emi-total-disp" style="font-size:1.35rem; color:var(--primary);">₹ 12.31L</div>
                <div class="stat-label">Total Payment</div>
              </div>
            </div>

            <div style="margin-top:1rem;">
              <div style="display:flex; justify-content:space-between; font-size:0.8125rem; font-weight:600; margin-bottom:0.25rem;">
                <span style="color:var(--primary);">Principal: <span id="bar-p-pct">81%</span></span>
                <span style="color:var(--purple);">Interest: <span id="bar-i-pct">19%</span></span>
              </div>
              <div style="height:10px; background:var(--purple); border-radius:5px; overflow:hidden; display:flex;">
                <div id="bar-principal" style="background:var(--primary); width:81%; height:100%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      const amountInput = document.getElementById('emi-amount');
      const amountRange = document.getElementById('emi-amount-range');
      const rateInput = document.getElementById('emi-rate');
      const rateRange = document.getElementById('emi-rate-range');
      const tenureInput = document.getElementById('emi-tenure');
      const tenureRange = document.getElementById('emi-tenure-range');

      sync(amountInput, amountRange);
      sync(rateInput, rateRange);
      sync(tenureInput, tenureRange);

      function sync(a, b) {
        a.addEventListener('input', () => { b.value = a.value; calculateEmi(); });
        b.addEventListener('input', () => { a.value = b.value; calculateEmi(); });
      }

      calculateEmi();

      function calculateEmi() {
        const P = parseFloat(amountInput.value) || 0;
        const annualR = parseFloat(rateInput.value) || 0;
        const years = parseFloat(tenureInput.value) || 0;

        const N = years * 12;
        const R = (annualR / 12) / 100;

        let emi = 0;
        if (R > 0) {
          emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
        } else {
          emi = P / N;
        }

        const totalPayment = emi * N;
        const totalInterest = totalPayment - P;

        const pPct = Math.round((P / totalPayment) * 100) || 0;
        const iPct = 100 - pPct;

        document.getElementById('emi-monthly-val').textContent = '₹ ' + Math.round(emi).toLocaleString('en-IN');
        document.getElementById('emi-principal-disp').textContent = '₹ ' + Math.round(P).toLocaleString('en-IN');
        document.getElementById('emi-interest-disp').textContent = '₹ ' + Math.round(totalInterest).toLocaleString('en-IN');
        document.getElementById('emi-total-disp').textContent = '₹ ' + Math.round(totalPayment).toLocaleString('en-IN');

        document.getElementById('bar-p-pct').textContent = pPct + '%';
        document.getElementById('bar-i-pct').textContent = iPct + '%';
        document.getElementById('bar-principal').style.width = pPct + '%';
      }
    `
  },

  // 16. Percentage Calculator
  "percentage-calculator": {
    extraHead: ``,
    renderWorkspace: () => `
      <div style="display:flex; flex-direction:column; gap:2rem;">
        <!-- Mode 1: What is X% of Y -->
        <div class="result-box">
          <h4 style="font-size:1.0625rem; font-weight:700; margin-bottom:1rem;">1. What is X% of Y?</h4>
          <div style="display:flex; flex-wrap:wrap; align-items:center; gap:0.75rem;">
            <span>What is</span>
            <input type="number" class="form-control" id="p1-x" value="15" style="width:110px;">
            <span>% of</span>
            <input type="number" class="form-control" id="p1-y" value="2500" style="width:140px;">
            <button class="btn btn-primary" id="btn-p1">=</button>
            <div style="font-size:1.5rem; font-weight:800; color:var(--primary); margin-left:auto;" id="p1-res">375</div>
          </div>
        </div>

        <!-- Mode 2: X is what % of Y -->
        <div class="result-box">
          <h4 style="font-size:1.0625rem; font-weight:700; margin-bottom:1rem;">2. X is what percentage of Y?</h4>
          <div style="display:flex; flex-wrap:wrap; align-items:center; gap:0.75rem;">
            <input type="number" class="form-control" id="p2-x" value="75" style="width:110px;">
            <span>is what percent of</span>
            <input type="number" class="form-control" id="p2-y" value="300" style="width:140px;">
            <button class="btn btn-primary" id="btn-p2">=</button>
            <div style="font-size:1.5rem; font-weight:800; color:var(--primary); margin-left:auto;" id="p2-res">25%</div>
          </div>
        </div>

        <!-- Mode 3: Percentage Increase / Decrease -->
        <div class="result-box">
          <h4 style="font-size:1.0625rem; font-weight:700; margin-bottom:1rem;">3. Percentage Increase or Decrease from X to Y</h4>
          <div style="display:flex; flex-wrap:wrap; align-items:center; gap:0.75rem;">
            <span>From</span>
            <input type="number" class="form-control" id="p3-x" value="120" style="width:120px;">
            <span>to</span>
            <input type="number" class="form-control" id="p3-y" value="150" style="width:120px;">
            <button class="btn btn-primary" id="btn-p3">=</button>
            <div style="font-size:1.5rem; font-weight:800; color:var(--success); margin-left:auto;" id="p3-res">+25% (Increase)</div>
          </div>
        </div>
      </div>
    `,
    script: `
      const p1x = document.getElementById('p1-x');
      const p1y = document.getElementById('p1-y');
      const p2x = document.getElementById('p2-x');
      const p2y = document.getElementById('p2-y');
      const p3x = document.getElementById('p3-x');
      const p3y = document.getElementById('p3-y');

      [p1x, p1y].forEach(el => el.addEventListener('input', calc1));
      [p2x, p2y].forEach(el => el.addEventListener('input', calc2));
      [p3x, p3y].forEach(el => el.addEventListener('input', calc3));

      calc1(); calc2(); calc3();

      function calc1() {
        const x = parseFloat(p1x.value) || 0;
        const y = parseFloat(p1y.value) || 0;
        const res = (x / 100) * y;
        document.getElementById('p1-res').textContent = res.toLocaleString();
      }

      function calc2() {
        const x = parseFloat(p2x.value) || 0;
        const y = parseFloat(p2y.value) || 0;
        const res = y !== 0 ? ((x / y) * 100).toFixed(2) : 0;
        document.getElementById('p2-res').textContent = res + '%';
      }

      function calc3() {
        const x = parseFloat(p3x.value) || 0;
        const y = parseFloat(p3y.value) || 0;
        if (x === 0) {
          document.getElementById('p3-res').textContent = 'N/A';
          return;
        }
        const diff = y - x;
        const pct = ((diff / x) * 100).toFixed(2);
        const el = document.getElementById('p3-res');
        if (pct >= 0) {
          el.textContent = '+' + pct + '% (Increase)';
          el.style.color = 'var(--success)';
        } else {
          el.textContent = pct + '% (Decrease)';
          el.style.color = 'var(--danger)';
        }
      }
    `
  },

  // 17. Discount Calculator
  "discount-calculator": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label">Original Price ($ / ₹)</label>
            <input type="number" class="form-control" id="disc-orig" value="2500" min="0">
          </div>

          <div class="form-group">
            <div class="range-header">
              <label class="form-label">Discount Percentage (%): <strong id="disc-pct-label" style="color:var(--primary);">30%</strong></label>
            </div>
            <input type="range" class="range-slider" id="disc-slider" min="1" max="95" value="30">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Extra Coupon / Off (%)</label>
              <input type="number" class="form-control" id="disc-extra" value="5" min="0" max="90">
            </div>
            <div class="form-group">
              <label class="form-label">Sales Tax (%)</label>
              <input type="number" class="form-control" id="disc-tax" value="8" min="0" max="50">
            </div>
          </div>

          <button class="btn btn-primary" id="btn-calc-disc" style="width:100%;">
            Calculate Savings
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box">
            <div class="result-header">
              <span class="result-title">Final Price Summary</span>
              <span class="badge badge-success">Deal</span>
            </div>

            <div style="text-align:center; margin-bottom:1.5rem;">
              <div class="stat-label">Final Price to Pay</div>
              <div class="result-value-big" id="disc-final-price">₹ 1,795.50</div>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value" id="disc-saved-val" style="font-size:1.35rem; color:var(--success);">₹ 837.50</div>
                <div class="stat-label">Total You Save</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" id="disc-effective-pct" style="font-size:1.35rem;">33.5%</div>
                <div class="stat-label">Effective Off</div>
              </div>
            </div>

            <table class="calc-table">
              <tr>
                <td>Original Price</td>
                <td style="text-align:right;" id="t-orig">₹ 2,500.00</td>
              </tr>
              <tr>
                <td>Discount Savings</td>
                <td style="text-align:right; color:var(--success);" id="t-saved">- ₹ 837.50</td>
              </tr>
              <tr>
                <td>Sales Tax Added</td>
                <td style="text-align:right; color:var(--text-muted);" id="t-tax">+ ₹ 133.00</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    `,
    script: `
      const origInput = document.getElementById('disc-orig');
      const slider = document.getElementById('disc-slider');
      const sliderLabel = document.getElementById('disc-pct-label');
      const extraInput = document.getElementById('disc-extra');
      const taxInput = document.getElementById('disc-tax');

      slider.addEventListener('input', (e) => {
        sliderLabel.textContent = e.target.value + '%';
        calc();
      });

      [origInput, extraInput, taxInput].forEach(el => el.addEventListener('input', calc));

      calc();

      function calc() {
        const orig = parseFloat(origInput.value) || 0;
        const disc1 = parseFloat(slider.value) || 0;
        const extra = parseFloat(extraInput.value) || 0;
        const tax = parseFloat(taxInput.value) || 0;

        const after1 = orig - (orig * (disc1 / 100));
        const afterExtra = after1 - (after1 * (extra / 100));
        const totalSaved = orig - afterExtra;

        const taxAmount = afterExtra * (tax / 100);
        const finalPrice = afterExtra + taxAmount;

        const effPct = orig > 0 ? ((totalSaved / orig) * 100).toFixed(1) : 0;

        document.getElementById('disc-final-price').textContent = '₹ ' + finalPrice.toFixed(2);
        document.getElementById('disc-saved-val').textContent = '₹ ' + totalSaved.toFixed(2);
        document.getElementById('disc-effective-pct').textContent = effPct + '%';

        document.getElementById('t-orig').textContent = '₹ ' + orig.toFixed(2);
        document.getElementById('t-saved').textContent = '- ₹ ' + totalSaved.toFixed(2);
        document.getElementById('t-tax').textContent = '+ ₹ ' + taxAmount.toFixed(2);
      }
    `
  },

  // 18. Profit & Loss Calculator
  "profit-loss-calculator": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label">Cost Price (CP)</label>
            <input type="number" class="form-control" id="pl-cp" value="1200" min="0">
          </div>

          <div class="form-group">
            <label class="form-label">Selling Price (SP)</label>
            <input type="number" class="form-control" id="pl-sp" value="1650" min="0">
          </div>

          <div class="form-group">
            <label class="form-label">Additional Expenses (Shipping, packaging, fees)</label>
            <input type="number" class="form-control" id="pl-exp" value="50" min="0">
          </div>

          <button class="btn btn-primary" id="btn-calc-pl" style="width:100%;">
            Calculate Profit & Loss
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box">
            <div class="result-header">
              <span class="result-title">Financial Outcome</span>
              <span class="badge badge-success" id="pl-badge">PROFIT</span>
            </div>

            <div style="text-align:center; margin-bottom:1.5rem;">
              <div class="stat-label" id="pl-label">Net Profit</div>
              <div class="result-value-big" id="pl-amount" style="color:var(--success);">₹ 400.00</div>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value" id="pl-pct" style="font-size:1.35rem; color:var(--success);">32.0%</div>
                <div class="stat-label">Margin %</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" id="pl-markup" style="font-size:1.35rem;">37.5%</div>
                <div class="stat-label">Markup %</div>
              </div>
            </div>

            <table class="calc-table">
              <tr>
                <td>Total Cost Incurred</td>
                <td style="text-align:right;" id="pl-total-cost">₹ 1,250.00</td>
              </tr>
              <tr>
                <td>Revenue Earned</td>
                <td style="text-align:right;" id="pl-revenue">₹ 1,650.00</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    `,
    script: `
      const cpInput = document.getElementById('pl-cp');
      const spInput = document.getElementById('pl-sp');
      const expInput = document.getElementById('pl-exp');

      [cpInput, spInput, expInput].forEach(el => el.addEventListener('input', calcPL));

      calcPL();

      function calcPL() {
        const cp = parseFloat(cpInput.value) || 0;
        const sp = parseFloat(spInput.value) || 0;
        const exp = parseFloat(expInput.value) || 0;

        const totalCost = cp + exp;
        const diff = sp - totalCost;

        const badge = document.getElementById('pl-badge');
        const amountEl = document.getElementById('pl-amount');
        const labelEl = document.getElementById('pl-label');
        const pctEl = document.getElementById('pl-pct');

        if (diff >= 0) {
          badge.textContent = 'PROFIT';
          badge.className = 'badge badge-success';
          labelEl.textContent = 'Net Profit';
          amountEl.textContent = '₹ ' + diff.toFixed(2);
          amountEl.style.color = 'var(--success)';
          pctEl.style.color = 'var(--success)';
        } else {
          badge.textContent = 'LOSS';
          badge.className = 'badge badge-danger';
          labelEl.textContent = 'Net Loss';
          amountEl.textContent = '₹ ' + Math.abs(diff).toFixed(2);
          amountEl.style.color = 'var(--danger)';
          pctEl.style.color = 'var(--danger)';
        }

        const marginPct = totalCost > 0 ? ((diff / totalCost) * 100).toFixed(1) : 0;
        const markupPct = cp > 0 ? (((sp - cp) / cp) * 100).toFixed(1) : 0;

        pctEl.textContent = marginPct + '%';
        document.getElementById('pl-markup').textContent = markupPct + '%';
        document.getElementById('pl-total-cost').textContent = '₹ ' + totalCost.toFixed(2);
        document.getElementById('pl-revenue').textContent = '₹ ' + sp.toFixed(2);
      }
    `
  }
};
