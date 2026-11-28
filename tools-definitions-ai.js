/**
 * Workspace definitions & client-side scripts for AI Tools (5 tools)
 * 100% Client-side browser processing with zero server dependencies.
 */

module.exports = {
  // 1. AI Email Writer
  "ai-email-writer": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label" for="email-type">Email Purpose / Type</label>
            <select class="form-control" id="email-type">
              <option value="job_app">Job Application / Cover Letter Email</option>
              <option value="cold_outreach">Cold Sales / Business Outreach</option>
              <option value="follow_up">Polite Follow-up / Status Reminder</option>
              <option value="resignation">Formal Resignation Notice</option>
              <option value="leave_req">Sick / Annual Leave Request</option>
              <option value="support">Customer Support / Issue Resolution</option>
              <option value="meeting">Meeting Request / Scheduling</option>
              <option value="thank_you">Thank You & Appreciation Note</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="email-tone">Tone of Voice</label>
            <select class="form-control" id="email-tone">
              <option value="professional">Professional & Respectful</option>
              <option value="friendly">Friendly & Warm</option>
              <option value="urgent">Urgent & Direct</option>
              <option value="executive">Executive & Formal</option>
              <option value="persuasive">Persuasive & Confident</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="email-recipient">Recipient Name / Role</label>
            <input type="text" class="form-control" id="email-recipient" placeholder="e.g. Hiring Manager, Sarah, Team Lead">
          </div>

          <div class="form-group">
            <label class="form-label" for="email-points">Key Details & Context to Include</label>
            <textarea class="form-control" id="email-points" rows="4" placeholder="e.g. Applying for Senior Frontend Engineer, 5 years React experience, portfolio link attached, available next week for interview."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="email-sender">Your Name</label>
            <input type="text" class="form-control" id="email-sender" placeholder="e.g. Dinesh Kumar">
          </div>

          <button class="btn btn-primary btn-block" id="btn-generate-email" style="margin-top:0.75rem;">
            <span>✨ Generate Email with AI</span>
          </button>
        </div>

        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
              <span>Suggested Subject Line</span>
              <button class="btn btn-sm btn-secondary" id="btn-copy-subject" style="padding:0.25rem 0.5rem; font-size:0.75rem;">Copy Subject</button>
            </label>
            <input type="text" class="form-control" id="output-subject" readonly placeholder="Subject will appear here...">
          </div>

          <div class="form-group">
            <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
              <span>Generated Email Body</span>
              <span id="email-word-count" style="font-size:0.8rem; color:var(--text-muted);">0 words</span>
            </label>
            <textarea class="form-control" id="output-body" rows="12" readonly placeholder="Your AI-crafted email will generate here instantly..."></textarea>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem; margin-top:0.75rem;">
            <button class="btn btn-secondary" id="btn-copy-email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy Email</span>
            </button>
            <a href="#" class="btn btn-primary" id="btn-open-mail" target="_blank" style="text-decoration:none; text-align:center;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>Open in Mail</span>
            </a>
          </div>
        </div>
      </div>
    `,
    script: `
      const emailType = document.getElementById('email-type');
      const emailTone = document.getElementById('email-tone');
      const emailRecipient = document.getElementById('email-recipient');
      const emailPoints = document.getElementById('email-points');
      const emailSender = document.getElementById('email-sender');
      const btnGenerate = document.getElementById('btn-generate-email');
      const outSubject = document.getElementById('output-subject');
      const outBody = document.getElementById('output-body');
      const wordCountEl = document.getElementById('email-word-count');
      const btnCopySub = document.getElementById('btn-copy-subject');
      const btnCopyEmail = document.getElementById('btn-copy-email');
      const btnOpenMail = document.getElementById('btn-open-mail');

      btnGenerate.addEventListener('click', () => {
        const type = emailType.value;
        const tone = emailTone.value;
        const recipient = emailRecipient.value.trim() || 'Hiring Team / Colleagues';
        const points = emailPoints.value.trim() || 'Discussing upcoming project priorities and schedule.';
        const sender = emailSender.value.trim() || 'Best regards';

        let subject = '';
        let body = '';

        const greeting = tone === 'friendly' ? ('Hi ' + recipient + ',') : ('Dear ' + recipient + ',');

        if (type === 'job_app') {
          subject = 'Application for Open Role: ' + (points.slice(0, 30) || 'Job Position') + ' - ' + (sender !== 'Best regards' ? sender : '');
          body = greeting + '\\n\\nI am writing to express my strong interest in the open position. With my relevant background and proven track record, I am confident in my ability to deliver immediate value to your team.\\n\\nKey Highlights & Qualifications:\\n' + points + '\\n\\nI have attached my resume for your review. I would welcome the opportunity to discuss how my skillset aligns with your goals.\\n\\nThank you for your time and consideration.\\n\\nWarm regards,\\n' + sender;
        } else if (type === 'cold_outreach') {
          subject = 'Quick question regarding your growth strategy';
          body = greeting + '\\n\\nI hope you are having a productive week.\\n\\nI came across your work recently and wanted to reach out regarding:\\n' + points + '\\n\\nWe have helped similar leaders optimize their workflow and achieve measurable ROI with zero downtime. Would you be open to a brief 10-minute introductory call next Tuesday or Thursday?\\n\\nBest regards,\\n' + sender;
        } else if (type === 'follow_up') {
          subject = 'Gentle Follow-up: ' + (points.slice(0, 35) || 'Previous Discussion');
          body = greeting + '\\n\\nI hope this email finds you well.\\n\\nI am following up on our previous conversation regarding:\\n' + points + '\\n\\nPlease let me know if you need any additional information or if you have had a chance to review the details. Looking forward to your guidance on the next steps.\\n\\nWarm regards,\\n' + sender;
        } else if (type === 'resignation') {
          subject = 'Formal Resignation Notice - ' + sender;
          body = greeting + '\\n\\nPlease accept this email as formal notification that I am resigning from my position. My last working day will be two weeks from today.\\n\\n' + points + '\\n\\nI am deeply grateful for the opportunities and mentorship I have received during my tenure here. I am committed to ensuring a smooth handover of all my current responsibilities.\\n\\nSincerely,\\n' + sender;
        } else if (type === 'leave_req') {
          subject = 'Leave of Absence Request - ' + sender;
          body = greeting + '\\n\\nI am writing to formally request leave due to the following reasons:\\n' + points + '\\n\\nI have made arrangements to ensure my immediate tasks are covered during my absence. I will monitor critical notifications if urgent matters arise.\\n\\nThank you for your understanding.\\n\\nBest regards,\\n' + sender;
        } else if (type === 'support') {
          subject = 'Resolution regarding your recent inquiry';
          body = greeting + '\\n\\nThank you for reaching out to us. We appreciate your patience while we investigated your issue.\\n\\nRegarding your request:\\n' + points + '\\n\\nPlease let us know if this solves the problem or if you require any further assistance. We are always here to help!\\n\\nBest regards,\\n' + sender;
        } else if (type === 'meeting') {
          subject = 'Meeting Invitation: Discussion on ' + (points.slice(0, 30) || 'Project Updates');
          body = greeting + '\\n\\nI would like to schedule a brief meeting to sync up on:\\n' + points + '\\n\\nPlease let me know your availability over the next few days, or feel free to propose a time that suits your calendar.\\n\\nBest regards,\\n' + sender;
        } else {
          subject = 'Thank you for your partnership and support';
          body = greeting + '\\n\\nI wanted to take a moment to express my sincere appreciation for:\\n' + points + '\\n\\nYour collaboration and dedication have made a tremendous positive impact. Looking forward to our continued success together!\\n\\nWarm regards,\\n' + sender;
        }

        outSubject.value = subject;
        outBody.value = body;
        wordCountEl.textContent = body.split(/\\s+/).filter(Boolean).length + ' words';
        btnOpenMail.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        if (typeof showToast === 'function') showToast('Email generated successfully! ✨', 'success');
      });

      btnCopySub.addEventListener('click', () => {
        if (!outSubject.value) return;
        copyToClipboard(outSubject.value, btnCopySub);
      });

      btnCopyEmail.addEventListener('click', () => {
        if (!outBody.value) return;
        copyToClipboard('Subject: ' + outSubject.value + '\\n\\n' + outBody.value, btnCopyEmail);
      });
    `
  },

  // 2. AI Paragraph Rewriter
  "ai-paragraph-rewriter": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label" for="rewrite-mode">Rewriting Mode & Tone</label>
            <select class="form-control" id="rewrite-mode">
              <option value="fluent">Fluent & Natural (Improves flow & clarity)</option>
              <option value="professional">Professional & Formal (Business ready)</option>
              <option value="simplified">Simplify (Easy to understand for everyone)</option>
              <option value="creative">Creative & Engaging (Captivating vocabulary)</option>
              <option value="shorten">Shorten & Concise (Cuts fluff and filler)</option>
              <option value="academic">Academic & Authoritative (Scholarly tone)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
              <span>Original Text</span>
              <span id="input-stats" style="font-size:0.8rem; color:var(--text-muted);">0 words | 0 chars</span>
            </label>
            <textarea class="form-control" id="input-text" rows="10" placeholder="Paste or type any paragraph here to rewrite and paraphrase..."></textarea>
          </div>

          <button class="btn btn-primary btn-block" id="btn-rewrite">
            <span>🔄 Rewrite Paragraph with AI</span>
          </button>
        </div>

        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
              <span>Rewritten Output</span>
              <span id="output-stats" style="font-size:0.8rem; color:var(--text-muted);">0 words | 0 chars</span>
            </label>
            <textarea class="form-control" id="output-text" rows="12" readonly placeholder="Rewritten content will appear here..."></textarea>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem;">
            <button class="btn btn-secondary" id="btn-copy-rewritten">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy Output</span>
            </button>
            <button class="btn btn-secondary" id="btn-download-txt">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Download .txt</span>
            </button>
          </div>
        </div>
      </div>
    `,
    script: `
      const inText = document.getElementById('input-text');
      const outText = document.getElementById('output-text');
      const modeSelect = document.getElementById('rewrite-mode');
      const btnRewrite = document.getElementById('btn-rewrite');
      const inStats = document.getElementById('input-stats');
      const outStats = document.getElementById('output-stats');
      const btnCopy = document.getElementById('btn-copy-rewritten');
      const btnDownload = document.getElementById('btn-download-txt');

      inText.addEventListener('input', () => {
        const val = inText.value;
        const words = val.trim().split(/\\s+/).filter(Boolean).length;
        inStats.textContent = words + ' words | ' + val.length + ' chars';
      });

      const SYNONYMS = {
        "very": ["exceptionally", "remarkably", "highly", "notably"],
        "good": ["excellent", "superb", "superior", "commendable"],
        "bad": ["unfavorable", "subpar", "deficient", "inadequate"],
        "big": ["substantial", "extensive", "significant", "considerable"],
        "small": ["compact", "modest", "concise", "minimal"],
        "help": ["assist", "support", "facilitate", "empower"],
        "make": ["produce", "develop", "construct", "formulate"],
        "use": ["utilize", "leverage", "implement", "employ"],
        "get": ["obtain", "acquire", "secure", "receive"],
        "show": ["demonstrate", "illustrate", "exhibit", "reveal"],
        "important": ["crucial", "essential", "vital", "pivotal"],
        "fast": ["rapid", "swift", "expedient", "accelerated"],
        "easy": ["straightforward", "effortless", "seamless", "accessible"],
        "problem": ["challenge", "complication", "obstacle", "impediment"],
        "think": ["consider", "evaluate", "contemplate", "envisage"],
        "start": ["initiate", "commence", "launch", "embark upon"],
        "change": ["transform", "modify", "adapt", "evolve"],
        "need": ["require", "demand", "necessitate"],
        "a lot of": ["numerous", "an abundance of", "multiple", "extensive"],
        "in order to": ["to"],
        "due to the fact that": ["because"],
        "at this point in time": ["currently", "now"]
      };

      btnRewrite.addEventListener('click', () => {
        const text = inText.value.trim();
        if (!text) {
          showToast('Please enter text to rewrite', 'error');
          return;
        }

        const mode = modeSelect.value;
        let sentences = text.split(/([.!?]+)/).filter(Boolean);
        let result = '';

        for (let i = 0; i < sentences.length; i += 2) {
          let s = sentences[i].trim();
          let punct = sentences[i + 1] || '.';
          if (!s) continue;

          // Process words
          let words = s.split(/\\s+/);
          let transformed = words.map(w => {
            let lower = w.toLowerCase().replace(/[^a-z]/g, '');
            if (SYNONYMS[lower]) {
              const synList = SYNONYMS[lower];
              const pick = synList[Math.floor(Math.random() * synList.length)];
              return w[0] === w[0].toUpperCase() ? (pick.charAt(0).toUpperCase() + pick.slice(1)) : pick;
            }
            return w;
          }).join(' ');

          if (mode === 'professional') {
            transformed = transformed.replace(/can't/gi, 'cannot')
              .replace(/won't/gi, 'will not')
              .replace(/don't/gi, 'do not')
              .replace(/it's/gi, 'it is')
              .replace(/\\bawesome\\b/gi, 'exceptional')
              .replace(/\\bcool\\b/gi, 'innovative');
          } else if (mode === 'simplified') {
            transformed = transformed.replace(/utilize/gi, 'use')
              .replace(/implement/gi, 'apply')
              .replace(/subsequently/gi, 'then')
              .replace(/facilitate/gi, 'help');
          } else if (mode === 'shorten') {
            transformed = transformed.replace(/\\bvery\\b/gi, '')
              .replace(/\\breally\\b/gi, '')
              .replace(/\\bbasically\\b/gi, '')
              .replace(/\\bactually\\b/gi, '')
              .replace(/\\s+/g, ' ');
          }

          result += (result ? ' ' : '') + transformed + punct;
        }

        outText.value = result;
        const words = result.trim().split(/\\s+/).filter(Boolean).length;
        outStats.textContent = words + ' words | ' + result.length + ' chars';
        showToast('Paragraph rewritten successfully! 🔄', 'success');
      });

      btnCopy.addEventListener('click', () => {
        if (!outText.value) return;
        copyToClipboard(outText.value, btnCopy);
      });

      btnDownload.addEventListener('click', () => {
        if (!outText.value) return;
        const blob = new Blob([outText.value], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'rewritten-text.txt';
        a.click();
      });
    `
  },

  // 3. AI Grammar Checker
  "ai-grammar-checker": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
              <span>Input Text</span>
              <button class="btn btn-sm btn-secondary" id="btn-load-sample" style="padding:0.2rem 0.5rem; font-size:0.75rem;">Load Sample</button>
            </label>
            <textarea class="form-control" id="grammar-input" rows="12" placeholder="Paste your essay, article, or business draft to check grammar, spelling, and readability..."></textarea>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem;">
            <button class="btn btn-primary" id="btn-check-grammar">
              <span>🔍 Check Grammar</span>
            </button>
            <button class="btn btn-secondary" id="btn-auto-fix">
              <span>✨ Fix All Mistakes</span>
            </button>
          </div>
        </div>

        <div class="workspace-col">
          <div class="stats-grid" style="margin-bottom:1rem;">
            <div class="stat-card">
              <div class="stat-value" id="stat-issues" style="color:var(--danger, #ef4444);">0</div>
              <div class="stat-label">Issues Found</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="stat-words">0</div>
              <div class="stat-label">Word Count</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="stat-readability">Good</div>
              <div class="stat-label">Readability</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Detected Corrections & Improvements</label>
            <div id="issues-list" style="max-height:220px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.75rem; background:var(--bg-surface-alt);">
              <div style="color:var(--text-muted); font-size:0.875rem; text-align:center; padding:1.5rem;">Click "Check Grammar" to analyze your writing.</div>
            </div>
          </div>

          <button class="btn btn-secondary btn-block" id="btn-copy-grammar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Copy Polished Text</span>
          </button>
        </div>
      </div>
    `,
    script: `
      const inputEl = document.getElementById('grammar-input');
      const btnCheck = document.getElementById('btn-check-grammar');
      const btnAutoFix = document.getElementById('btn-auto-fix');
      const btnSample = document.getElementById('btn-load-sample');
      const btnCopy = document.getElementById('btn-copy-grammar');
      const statIssues = document.getElementById('stat-issues');
      const statWords = document.getElementById('stat-words');
      const statRead = document.getElementById('stat-readability');
      const issuesList = document.getElementById('issues-list');

      const RULES = [
        { pattern: /\\b(teh)\\b/gi, fix: 'the', type: 'Spelling error', desc: 'Typo detected: "teh" -> "the"' },
        { pattern: /\\b(recieve)\\b/gi, fix: 'receive', type: 'Spelling error', desc: 'Rule: "i" before "e" except after "c"' },
        { pattern: /\\b(seperate)\\b/gi, fix: 'separate', type: 'Spelling error', desc: 'Misspelled: "seperate" -> "separate"' },
        { pattern: /\\b(definately)\\b/gi, fix: 'definitely', type: 'Spelling error', desc: 'Misspelled: "definately" -> "definitely"' },
        { pattern: /\\b(occured)\\b/gi, fix: 'occurred', type: 'Spelling error', desc: 'Double "r": "occured" -> "occurred"' },
        { pattern: /\\b(untill)\\b/gi, fix: 'until', type: 'Spelling error', desc: 'Single "l": "untill" -> "until"' },
        { pattern: /\\b(their)\\s+(are|is)\\b/gi, fix: 'there $2', type: 'Grammar error', desc: 'Confusion of "their" (belonging) with "there"' },
        { pattern: /\\b(your)\\s+(welcome|right|wrong)\\b/gi, fix: "you're $2", type: "Grammar error", desc: "Use contraction you're (you are)" },
        { pattern: /\\b(its)\\s+(a|the|not|going)\\b/gi, fix: "it's $2", type: 'Punctuation error', desc: 'Needs apostrophe for "it is"' },
        { pattern: /\\b(\\w+)\\s+\\1\\b/gi, fix: '$1', type: 'Duplicate word', desc: 'Repeated word removed' },
        { pattern: /\\s+,/g, fix: ',', type: 'Punctuation error', desc: 'Extra space before comma' },
        { pattern: /\\s+\\./g, fix: '.', type: 'Punctuation error', desc: 'Extra space before period' },
        { pattern: /\\b(alot)\\b/gi, fix: 'a lot', type: 'Grammar error', desc: '"a lot" should be two words' }
      ];

      btnSample.addEventListener('click', () => {
        inputEl.value = "Teh team will recieve their report untill tomorrow. It was a alot of work and its very important that your ready. We must not make the the same mistake.";
        btnCheck.click();
      });

      function analyzeText() {
        const text = inputEl.value;
        const words = text.trim().split(/\\s+/).filter(Boolean).length;
        statWords.textContent = words;

        let detected = [];
        RULES.forEach(r => {
          let match;
          const re = new RegExp(r.pattern.source, 'gi');
          while ((match = re.exec(text)) !== null) {
            detected.push({
              match: match[0],
              fix: r.fix,
              type: r.type,
              desc: r.desc,
              index: match.index
            });
          }
        });

        statIssues.textContent = detected.length;
        statRead.textContent = detected.length === 0 ? 'Excellent' : (detected.length < 4 ? 'Good' : 'Needs Review');
        statIssues.style.color = detected.length === 0 ? 'var(--success, #10b981)' : 'var(--danger, #ef4444)';

        if (detected.length === 0) {
          issuesList.innerHTML = '<div style="color:var(--success, #10b981); text-align:center; padding:1.5rem; font-weight:600;">✨ No grammatical errors detected! Your text looks great.</div>';
        } else {
          issuesList.innerHTML = detected.map(d => \`
            <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.5rem 0.75rem; margin-bottom:0.5rem; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span class="badge badge-warning" style="font-size:0.75rem;">\${d.type}</span>
                <span style="font-size:0.875rem; font-weight:600; margin-left:0.5rem; text-decoration:line-through; color:var(--danger, #ef4444);">\${d.match}</span>
                <span style="font-size:0.875rem; font-weight:600; margin-left:0.25rem; color:var(--success, #10b981);">→ \${d.fix}</span>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem;">\${d.desc}</div>
              </div>
            </div>
          \`).join('');
        }
      }

      btnCheck.addEventListener('click', analyzeText);

      btnAutoFix.addEventListener('click', () => {
        let text = inputEl.value;
        if (!text) {
          showToast('Please enter text to fix', 'error');
          return;
        }

        RULES.forEach(r => {
          text = text.replace(r.pattern, r.fix);
        });

        inputEl.value = text;
        analyzeText();
        showToast('All detected mistakes corrected! ✨', 'success');
      });

      btnCopy.addEventListener('click', () => {
        if (!inputEl.value) return;
        copyToClipboard(inputEl.value, btnCopy);
      });
    `
  },

  // 4. AI Resume Builder
  "ai-resume-builder": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid" style="grid-template-columns: 1fr 1fr; gap:1.5rem;">
        <!-- Left: Form Editor -->
        <div class="workspace-col" style="max-height:85vh; overflow-y:auto; padding-right:0.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 style="font-size:1.15rem; margin:0;">Resume Details</h3>
            <button class="btn btn-sm btn-secondary" id="btn-load-resume-sample">⚡ Load Sample Data</button>
          </div>

          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" id="res-name" placeholder="Dinesh Kumar">
          </div>

          <div class="form-group">
            <label class="form-label">Professional Title</label>
            <input type="text" class="form-control" id="res-title" placeholder="Full Stack Web Developer">
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" id="res-email" placeholder="dinesh@example.com">
            </div>
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input type="text" class="form-control" id="res-phone" placeholder="+91 98765 43210">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="form-group">
              <label class="form-label">City, State</label>
              <input type="text" class="form-control" id="res-location" placeholder="New Delhi, India">
            </div>
            <div class="form-group">
              <label class="form-label">LinkedIn / Portfolio URL</label>
              <input type="text" class="form-control" id="res-link" placeholder="linkedin.com/in/dinesh">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Professional Summary</label>
            <textarea class="form-control" id="res-summary" rows="3" placeholder="Passionate developer with 4+ years of building web applications, APIs, and modern user experiences..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Experience (Company, Role, Dates, Achievements)</label>
            <textarea class="form-control" id="res-experience" rows="4" placeholder="Lead Developer at TechCorp (2022 - Present)&#10;• Led team of 5 engineers delivering high-scale web apps&#10;• Reduced load times by 40% with clean architecture"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Education (Degree, University, Year)</label>
            <textarea class="form-control" id="res-education" rows="2" placeholder="B.Tech in Computer Science&#10;Delhi Technological University, 2018 - 2022"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Key Skills (Comma separated)</label>
            <input type="text" class="form-control" id="res-skills" placeholder="JavaScript, React, Node.js, HTML5, CSS3, Git, SQL, Python">
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-top:1rem;">
            <button class="btn btn-primary" id="btn-print-resume">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              <span>Download / Print PDF</span>
            </button>
            <button class="btn btn-secondary" id="btn-copy-resume-txt">
              <span>Copy as Text</span>
            </button>
          </div>
        </div>

        <!-- Right: Real-time ATS Resume Preview -->
        <div class="workspace-col" style="background:#ffffff; color:#1e293b; padding:2rem; border:1px solid #cbd5e1; border-radius:var(--radius-md); box-shadow:0 10px 25px rgba(0,0,0,0.06); min-height:600px;" id="resume-preview">
          <div style="border-bottom:2px solid #2563eb; padding-bottom:1rem; margin-bottom:1.25rem;">
            <h1 id="prev-name" style="font-size:1.75rem; font-weight:800; color:#0f172a; margin:0 0 0.25rem;">Dinesh Kumar</h1>
            <div id="prev-title" style="font-size:1.05rem; font-weight:600; color:#2563eb; margin-bottom:0.5rem;">Full Stack Web Developer</div>
            <div id="prev-contact" style="font-size:0.85rem; color:#64748b; display:flex; flex-wrap:wrap; gap:0.75rem;">
              <span>📧 dinesh@example.com</span>
              <span>📞 +91 98765 43210</span>
              <span>📍 New Delhi, India</span>
              <span>🔗 linkedin.com/in/dinesh</span>
            </div>
          </div>

          <div style="margin-bottom:1.25rem;">
            <h3 style="font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; font-weight:700; color:#0f172a; border-bottom:1px solid #e2e8f0; padding-bottom:0.25rem; margin-bottom:0.5rem;">Professional Summary</h3>
            <p id="prev-summary" style="font-size:0.9rem; line-height:1.6; color:#334155; margin:0;">Passionate developer with 4+ years of building web applications, APIs, and modern user experiences.</p>
          </div>

          <div style="margin-bottom:1.25rem;">
            <h3 style="font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; font-weight:700; color:#0f172a; border-bottom:1px solid #e2e8f0; padding-bottom:0.25rem; margin-bottom:0.5rem;">Experience</h3>
            <div id="prev-experience" style="font-size:0.9rem; line-height:1.6; color:#334155; white-space:pre-line;">Lead Developer at TechCorp (2022 - Present)&#10;• Led team of 5 engineers delivering high-scale web apps&#10;• Reduced load times by 40% with clean architecture</div>
          </div>

          <div style="margin-bottom:1.25rem;">
            <h3 style="font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; font-weight:700; color:#0f172a; border-bottom:1px solid #e2e8f0; padding-bottom:0.25rem; margin-bottom:0.5rem;">Education</h3>
            <div id="prev-education" style="font-size:0.9rem; line-height:1.6; color:#334155; white-space:pre-line;">B.Tech in Computer Science&#10;Delhi Technological University, 2018 - 2022</div>
          </div>

          <div>
            <h3 style="font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; font-weight:700; color:#0f172a; border-bottom:1px solid #e2e8f0; padding-bottom:0.25rem; margin-bottom:0.5rem;">Skills</h3>
            <div id="prev-skills" style="display:flex; flex-wrap:wrap; gap:0.4rem; font-size:0.85rem; color:#334155;">
              <span class="badge" style="background:#f1f5f9; color:#1e293b;">JavaScript</span>
              <span class="badge" style="background:#f1f5f9; color:#1e293b;">React</span>
              <span class="badge" style="background:#f1f5f9; color:#1e293b;">Node.js</span>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      const fields = ['name', 'title', 'email', 'phone', 'location', 'link', 'summary', 'experience', 'education', 'skills'];
      
      function updateResume() {
        const name = document.getElementById('res-name').value || 'Dinesh Kumar';
        const title = document.getElementById('res-title').value || 'Full Stack Web Developer';
        const email = document.getElementById('res-email').value || 'dinesh@example.com';
        const phone = document.getElementById('res-phone').value || '+91 98765 43210';
        const loc = document.getElementById('res-location').value || 'New Delhi, India';
        const link = document.getElementById('res-link').value || 'linkedin.com/in/dinesh';
        const summary = document.getElementById('res-summary').value || 'Passionate professional dedicated to delivering excellence and innovative solutions.';
        const exp = document.getElementById('res-experience').value || 'Senior Specialist (2021 - Present)\\n• Delivered key projects on time with high customer satisfaction.';
        const edu = document.getElementById('res-education').value || 'Bachelor Degree in Science & Technology\\nState University, 2017 - 2021';
        const skills = document.getElementById('res-skills').value || 'Problem Solving, Communication, Leadership, Project Management';

        document.getElementById('prev-name').textContent = name;
        document.getElementById('prev-title').textContent = title;
        document.getElementById('prev-contact').innerHTML = \`
          <span>📧 \${email}</span>
          <span>📞 \${phone}</span>
          <span>📍 \${loc}</span>
          <span>🔗 \${link}</span>
        \`;
        document.getElementById('prev-summary').textContent = summary;
        document.getElementById('prev-experience').textContent = exp;
        document.getElementById('prev-education').textContent = edu;

        const skillsArr = skills.split(',').map(s => s.trim()).filter(Boolean);
        document.getElementById('prev-skills').innerHTML = skillsArr.map(s => \`
          <span style="background:#f1f5f9; color:#1e293b; padding:0.2rem 0.6rem; border-radius:4px; font-weight:500;">\${s}</span>
        \`).join('');
      }

      fields.forEach(f => {
        const el = document.getElementById('res-' + f);
        if (el) el.addEventListener('input', updateResume);
      });

      document.getElementById('btn-load-resume-sample').addEventListener('click', () => {
        document.getElementById('res-name').value = 'Aman Sharma';
        document.getElementById('res-title').value = 'Senior Product Designer & UI Architect';
        document.getElementById('res-email').value = 'aman.sharma@email.com';
        document.getElementById('res-phone').value = '+91 99887 66554';
        document.getElementById('res-location').value = 'Bengaluru, India';
        document.getElementById('res-link').value = 'portfolio.amansharma.design';
        document.getElementById('res-summary').value = 'Award-winning product designer with 6+ years specializing in design systems, user engagement, and mobile-first responsive architecture.';
        document.getElementById('res-experience').value = 'Lead UI Designer at Nova Labs (2021 - Present)\\n• Spearheaded core design redesign increasing conversion rates by 34%\\n• Built comprehensive Figma design system used across 12 product squads\\n\\nUI/UX Designer at CreativeMinds (2018 - 2021)\\n• Designed cross-platform iOS & Android mobile applications';
        document.getElementById('res-education').value = 'B.Des in Interaction Design\\nNational Institute of Design, 2014 - 2018';
        document.getElementById('res-skills').value = 'Figma, Design Systems, UI/UX, Wireframing, CSS Architecture, User Research, Prototyping';
        updateResume();
        showToast('Sample resume loaded! ⚡', 'success');
      });

      document.getElementById('btn-print-resume').addEventListener('click', () => {
        window.print();
      });

      document.getElementById('btn-copy-resume-txt').addEventListener('click', () => {
        const prev = document.getElementById('resume-preview').innerText;
        copyToClipboard(prev, document.getElementById('btn-copy-resume-txt'));
      });
    `
  },

  // 5. AI Text & Copy Generator
  "ai-text-generator": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="form-group">
            <label class="form-label" for="gen-type">Content Type to Generate</label>
            <select class="form-control" id="gen-type">
              <option value="blog_intro">Catchy Blog / Article Introduction</option>
              <option value="social_post">Social Media Post (LinkedIn / Instagram / X)</option>
              <option value="product_desc">E-Commerce Product Description</option>
              <option value="slogan">Brand Slogans & Catchy Taglines</option>
              <option value="bullet_benefits">Engaging Bullet Points & Features</option>
              <option value="video_hook">YouTube / Reel Hook & Intro</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="gen-topic">Topic / Product Name / Main Idea</label>
            <input type="text" class="form-control" id="gen-topic" placeholder="e.g. Eco-Friendly Bamboo Coffee Tumbler, SmartHub Online Tools">
          </div>

          <div class="form-group">
            <label class="form-label" for="gen-details">Key Details / Audience / Features</label>
            <textarea class="form-control" id="gen-details" rows="3" placeholder="e.g. Keeps drinks hot for 12 hours, zero plastic, lightweight, target audience is busy professionals and students."></textarea>
          </div>

          <button class="btn btn-primary btn-block" id="btn-generate-copy">
            <span>✨ Generate Creative AI Options</span>
          </button>
        </div>

        <div class="workspace-col">
          <label class="form-label">Generated Options (Click Copy on your favorite)</label>
          <div id="copy-options-container" style="display:flex; flex-direction:column; gap:1rem;">
            <div style="background:var(--bg-surface-alt); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.5rem; text-align:center; color:var(--text-muted);">
              Enter your topic on the left and click "Generate Creative AI Options" to get 3 unique copy variations.
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      const genType = document.getElementById('gen-type');
      const genTopic = document.getElementById('gen-topic');
      const genDetails = document.getElementById('gen-details');
      const btnGen = document.getElementById('btn-generate-copy');
      const container = document.getElementById('copy-options-container');

      btnGen.addEventListener('click', () => {
        const topic = genTopic.value.trim() || 'Modern Digital Productivity';
        const details = genDetails.value.trim() || 'Fast, secure, browser-based utilities for creators and professionals.';
        const type = genType.value;

        let options = [];

        if (type === 'blog_intro') {
          options = [
            'In today\\'s fast-paced digital era, ' + topic + ' has transformed from a luxury into an absolute necessity. Whether you\\'re an industry veteran or just getting started, understanding how ' + details + ' can elevate your daily output is the key to staying ahead. Here is everything you need to know.',
            'What if the secret to mastering ' + topic + ' was far simpler than you thought? While most people struggle with outdated workflows, modern techniques focusing on ' + details + ' are revolutionizing results. Let\\'s dive into the core strategies.',
            'We\\'ve all been there: staring at an overwhelming task list wishing for a better way. That\\'s where ' + topic + ' steps in. By harnessing ' + details + ', you can unlock unprecedented efficiency and peace of mind.'
          ];
        } else if (type === 'social_post') {
          options = [
            '🚀 Level up your game with ' + topic + '!\\n\\nMost people overlook this, but focusing on ' + details + ' changes everything.\\n\\n💡 Key takeaway: Work smarter, not harder.\\n\\n👉 What\\'s your favorite strategy? Drop a comment below! #Productivity #Growth #' + topic.replace(/\\s+/g, ''),
            '✨ Stop wasting time on manual work.\\n\\nHere is why ' + topic + ' is a game changer:\\n• Instant results\\n• ' + details + '\\n• 100% private & effortless\\n\\nSave this post for later! 📌 #' + topic.replace(/\\s+/g, ''),
            '🔥 Unpopular opinion: You don\\'t need complex software to achieve big results with ' + topic + '.\\n\\nAll you need is the right approach: ' + details + '.\\n\\nAgree or disagree? Let\\'s discuss below! 👇'
          ];
        } else if (type === 'product_desc') {
          options = [
            'Meet ' + topic + ' — designed for those who demand the highest quality without compromise. Engineered with ' + details + ', this solution delivers unmatched reliability and effortless elegance every single day.',
            'Upgrade your routine with ' + topic + '. Carefully crafted to deliver superior performance, it highlights ' + details + ' so you can focus on what matters most. Experience the difference today.',
            'Discover the future of ' + topic + '. Lightweight, durable, and thoughtfully built around ' + details + ', it\\'s the ultimate companion for creators and professionals alike.'
          ];
        } else if (type === 'slogan') {
          options = [
            topic + ' — Smarter, Faster, Better.',
            'Empowering Your World with ' + topic + '.',
            topic + ': Where Simplicity Meets Power.'
          ];
        } else if (type === 'bullet_benefits') {
          options = [
            '• Lightning-Fast Execution: Experience instant speed with ' + topic + '.\\n• Privacy First: Completely safe with ' + details + '.\\n• Zero Clutter: Clean, intuitive design built for modern workflows.',
            '• 100% Free & Accessible: No subscriptions or hidden fees.\\n• Seamless Usability: ' + details + '.\\n• Guaranteed Precision: Built for reliable, daily excellence.',
            '• Boosted Efficiency: Finish tasks in seconds, not hours.\\n• Tailored for ' + topic + ' enthusiasts.\\n• ' + details + '.'
          ];
        } else {
          options = [
            'Stop scrolling! If you are struggling with ' + topic + ', this one trick will change everything.',
            'Here is the #1 mistake 90% of people make with ' + topic + ' (and how to fix it in 30 seconds):',
            'You won\\'t believe how easy ' + topic + ' becomes once you understand this:'
          ];
        }

        container.innerHTML = options.map((opt, idx) => \`
          <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem; position:relative;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <span class="badge badge-primary">Option \${idx + 1}</span>
              <button class="btn btn-sm btn-secondary copy-opt-btn" data-text="\${encodeURIComponent(opt)}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span>Copy</span>
              </button>
            </div>
            <div style="font-size:0.95rem; line-height:1.6; color:var(--text-main); white-space:pre-line;">\${opt}</div>
          </div>
        \`).join('');

        container.querySelectorAll('.copy-opt-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const raw = decodeURIComponent(btn.dataset.text);
            copyToClipboard(raw, btn);
          });
        });

        showToast('Generated 3 AI options! ✨', 'success');
      });
    `
  }
};
