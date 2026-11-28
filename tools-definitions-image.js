/**
 * Workspace definitions & client-side scripts for Image Tools (6 tools)
 */

module.exports = {
  // 1. Image Compressor
  "image-compressor": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <!-- Input Area -->
        <div class="workspace-col">
          <div class="dropzone" id="compressor-dropzone">
            <input type="file" id="compressor-file" accept="image/jpeg,image/png,image/webp">
            <div class="dropzone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div class="dropzone-title">Click to upload or drag & drop</div>
            <div class="dropzone-subtitle">Supports JPG, PNG, WEBP (Max 25MB)</div>
          </div>

          <div id="file-info-bar" class="file-preview-card" style="display:none;">
            <div class="file-preview-info">
              <img id="source-thumb" src="" alt="Thumbnail">
              <div>
                <div class="file-name" id="source-name">filename.jpg</div>
                <div class="file-meta" id="source-meta">Original: 0 KB</div>
              </div>
            </div>
            <button class="btn btn-sm btn-secondary" id="btn-remove-file">Change</button>
          </div>

          <div class="form-group" style="margin-top:1.5rem;">
            <div class="range-header">
              <label class="form-label">Compression Quality: <strong id="quality-val" style="color:var(--primary);">75%</strong></label>
              <span class="badge badge-primary">Balanced</span>
            </div>
            <input type="range" class="range-slider" id="quality-slider" min="5" max="95" value="75">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-light); margin-top:4px;">
              <span>Smallest File (Low Quality)</span>
              <span>Best Quality (Large File)</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Max Width / Resize (Optional)</label>
            <select class="form-control" id="max-dimension">
              <option value="original">Keep Original Dimensions</option>
              <option value="1920">Resize to 1920px (Full HD)</option>
              <option value="1280">Resize to 1280px (HD)</option>
              <option value="800">Resize to 800px (Web)</option>
              <option value="400">Resize to 400px (Thumbnail)</option>
            </select>
          </div>

          <button class="btn btn-primary" id="btn-compress" style="width:100%;" disabled>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 7v6m-3-3l3 3 3-3"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            Compress Image Now
          </button>
        </div>

        <!-- Output / Preview Area -->
        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">Compression Results</span>
                <span class="badge badge-success" id="savings-badge" style="display:none;">Saved 0%</span>
              </div>

              <div id="result-placeholder" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 1rem; opacity:0.4;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <p>Upload an image and adjust quality to see before/after size comparisons.</p>
              </div>

              <div id="result-content" style="display:none;">
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-value" id="stat-orig-size" style="font-size:1.35rem; color:var(--text-main);">0 KB</div>
                    <div class="stat-label">Original</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value" id="stat-comp-size" style="font-size:1.35rem;">0 KB</div>
                    <div class="stat-label">Compressed</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value" id="stat-saved-pct" style="font-size:1.35rem; color:var(--success);">0%</div>
                    <div class="stat-label">Space Saved</div>
                  </div>
                </div>

                <div style="border:1px solid var(--border-color); border-radius:var(--radius-md); overflow:hidden; margin:1rem 0; max-height:260px; text-align:center; background:var(--bg-surface);">
                  <img id="compressed-preview" src="" alt="Compressed Preview" style="max-height:260px; margin:0 auto; object-fit:contain;">
                </div>
              </div>
            </div>

            <div id="download-actions" style="display:none; margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-download" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Compressed Image
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      let currentFile = null;
      let originalImage = null;
      let compressedBlob = null;

      const fileInput = document.getElementById('compressor-file');
      const dropzone = document.getElementById('compressor-dropzone');
      const qualitySlider = document.getElementById('quality-slider');
      const qualityVal = document.getElementById('quality-val');
      const maxDimension = document.getElementById('max-dimension');
      const btnCompress = document.getElementById('btn-compress');
      const btnDownload = document.getElementById('btn-download');
      const btnRemove = document.getElementById('btn-remove-file');

      qualitySlider.addEventListener('input', (e) => {
        qualityVal.textContent = e.target.value + '%';
        if (originalImage) {
          processCompression();
        }
      });

      maxDimension.addEventListener('change', () => {
        if (originalImage) processCompression();
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
      });

      btnRemove.addEventListener('click', () => {
        currentFile = null;
        originalImage = null;
        fileInput.value = '';
        document.getElementById('file-info-bar').style.display = 'none';
        dropzone.style.display = 'flex';
        btnCompress.disabled = true;
        document.getElementById('result-content').style.display = 'none';
        document.getElementById('download-actions').style.display = 'none';
        document.getElementById('result-placeholder').style.display = 'block';
        document.getElementById('savings-badge').style.display = 'none';
      });

      function handleFile(file) {
        if (!file.type.match(/image.*/)) {
          showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
          return;
        }
        currentFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          originalImage = new Image();
          originalImage.onload = () => {
            document.getElementById('source-thumb').src = e.target.result;
            document.getElementById('source-name').textContent = file.name;
            document.getElementById('source-meta').textContent = formatSize(file.size) + ' • ' + originalImage.naturalWidth + 'x' + originalImage.naturalHeight + 'px';
            dropzone.style.display = 'none';
            document.getElementById('file-info-bar').style.display = 'flex';
            btnCompress.disabled = false;
            processCompression();
          };
          originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }

      btnCompress.addEventListener('click', () => {
        if (originalImage) processCompression();
      });

      function processCompression() {
        if (!originalImage) return;

        const canvas = document.createElement('canvas');
        let width = originalImage.naturalWidth;
        let height = originalImage.naturalHeight;

        const maxDim = maxDimension.value;
        if (maxDim !== 'original') {
          const max = parseInt(maxDim);
          if (width > max || height > max) {
            if (width > height) {
              height = Math.round((height * max) / width);
              width = max;
            } else {
              width = Math.round((width * max) / height);
              height = max;
            }
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(originalImage, 0, 0, width, height);

        const quality = parseInt(qualitySlider.value) / 100;
        canvas.toBlob((blob) => {
          compressedBlob = blob;
          const url = URL.createObjectURL(blob);
          document.getElementById('compressed-preview').src = url;

          const savedBytes = currentFile.size - blob.size;
          const savedPct = Math.max(0, Math.round((savedBytes / currentFile.size) * 100));

          document.getElementById('stat-orig-size').textContent = formatSize(currentFile.size);
          document.getElementById('stat-comp-size').textContent = formatSize(blob.size);
          document.getElementById('stat-saved-pct').textContent = savedPct + '%';

          const badge = document.getElementById('savings-badge');
          badge.textContent = savedPct > 0 ? 'Saved ' + savedPct + '%' : 'Original Size';
          badge.style.display = 'inline-block';

          document.getElementById('result-placeholder').style.display = 'none';
          document.getElementById('result-content').style.display = 'block';
          document.getElementById('download-actions').style.display = 'block';
          showToast('Image compressed successfully!', 'success');
        }, 'image/jpeg', quality);
      }

      btnDownload.addEventListener('click', () => {
        if (!compressedBlob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(compressedBlob);
        const nameParts = currentFile.name.split('.');
        const ext = nameParts.pop();
        link.download = nameParts.join('.') + '-compressed.jpg';
        link.click();
      });

      function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(2) + ' MB';
      }
    `
  },

  // 2. Image Resizer
  "image-resizer": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="dropzone" id="resizer-dropzone">
            <input type="file" id="resizer-file" accept="image/*">
            <div class="dropzone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 3H3v18h18V3z"/><path d="M21 9h-6V3"/><path d="M9 21v-6H3"/></svg>
            </div>
            <div class="dropzone-title">Select an Image to Resize</div>
            <div class="dropzone-subtitle">JPG, PNG, WEBP, GIF (Processed Locally)</div>
          </div>

          <div id="resizer-file-info" class="file-preview-card" style="display:none; margin-bottom:1.5rem;">
            <div class="file-preview-info">
              <img id="resizer-thumb" src="" alt="Thumbnail">
              <div>
                <div class="file-name" id="resizer-name">filename.jpg</div>
                <div class="file-meta" id="resizer-original-dims">0 x 0 px</div>
              </div>
            </div>
            <button class="btn btn-sm btn-secondary" id="btn-resizer-reset">Change</button>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Width (px)</label>
              <input type="number" class="form-control" id="resize-w" min="1" max="10000" placeholder="Width">
            </div>
            <div class="form-group">
              <label class="form-label">Height (px)</label>
              <input type="number" class="form-control" id="resize-h" min="1" max="10000" placeholder="Height">
            </div>
          </div>

          <div class="form-group">
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="lock-aspect" checked>
              <span style="font-size:0.875rem; font-weight:600;">Lock Aspect Ratio</span>
            </label>
          </div>

          <div class="form-group">
            <label class="form-label">Social &amp; Document Presets</label>
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:0.75rem;">
              <button type="button" class="btn btn-sm btn-secondary doc-preset" data-w="350" data-h="450">📸 Passport Photo (350x450)</button>
              <button type="button" class="btn btn-sm btn-secondary doc-preset" data-w="200" data-h="200">🆔 PAN / Signature (200x200)</button>
              <button type="button" class="btn btn-sm btn-secondary doc-preset" data-w="1080" data-h="1080">📱 Instagram (1080x1080)</button>
              <button type="button" class="btn btn-sm btn-secondary doc-preset" data-w="1280" data-h="720">🎥 YouTube Thumbnail (1280x720)</button>
              <button type="button" class="btn btn-sm btn-secondary doc-preset" data-w="1920" data-h="1080">🖥️ Full HD (1920x1080)</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Quick Scale Presets</label>
            <div class="quick-tags">
              <button class="btn btn-sm btn-secondary scale-preset" data-pct="25">25%</button>
              <button class="btn btn-sm btn-secondary scale-preset" data-pct="50">50%</button>
              <button class="btn btn-sm btn-secondary scale-preset" data-pct="75">75%</button>
              <button class="btn btn-sm btn-secondary scale-preset" data-pct="100">100%</button>
              <button class="btn btn-sm btn-secondary scale-preset" data-pct="150">150%</button>
              <button class="btn btn-sm btn-secondary scale-preset" data-pct="200">200%</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Output Format</label>
            <select class="form-control" id="resize-format">
              <option value="image/jpeg">JPG / JPEG</option>
              <option value="image/png">PNG (Lossless)</option>
              <option value="image/webp">WEBP (Modern Web)</option>
            </select>
          </div>

          <button class="btn btn-primary" id="btn-resize-action" style="width:100%;" disabled>
            Resize Image
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">Resized Preview</span>
                <span class="badge badge-primary" id="resized-badge" style="display:none;">Ready</span>
              </div>

              <div id="resizer-placeholder" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
                <p>Upload an image and specify dimensions to preview the resized result.</p>
              </div>

              <div id="resizer-result-display" style="display:none; text-align:center;">
                <div style="border:1px solid var(--border-color); border-radius:var(--radius-md); overflow:hidden; margin-bottom:1rem; max-height:280px; background:var(--bg-surface);">
                  <img id="resized-preview-img" src="" alt="Resized Preview" style="max-height:280px; margin:0 auto; object-fit:contain;">
                </div>
                <div class="file-meta" id="resized-meta" style="font-size:0.875rem; font-weight:600; color:var(--text-main);"></div>
              </div>
            </div>

            <div id="resizer-download-wrap" style="display:none; margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-download-resized" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Resized Image
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      let origImg = null;
      let origFile = null;
      let naturalAspect = 1;
      let resizedBlob = null;

      const fileInput = document.getElementById('resizer-file');
      const dropzone = document.getElementById('resizer-dropzone');
      const inputW = document.getElementById('resize-w');
      const inputH = document.getElementById('resize-h');
      const lockAspect = document.getElementById('lock-aspect');
      const btnAction = document.getElementById('btn-resize-action');
      const btnReset = document.getElementById('btn-resizer-reset');
      const btnDownload = document.getElementById('btn-download-resized');

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) loadFile(e.target.files[0]);
      });

      btnReset.addEventListener('click', () => {
        origImg = null;
        origFile = null;
        fileInput.value = '';
        dropzone.style.display = 'flex';
        document.getElementById('resizer-file-info').style.display = 'none';
        btnAction.disabled = true;
        document.getElementById('resizer-placeholder').style.display = 'block';
        document.getElementById('resizer-result-display').style.display = 'none';
        document.getElementById('resizer-download-wrap').style.display = 'none';
      });

      function loadFile(file) {
        origFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          origImg = new Image();
          origImg.onload = () => {
            naturalAspect = origImg.naturalWidth / origImg.naturalHeight;
            inputW.value = origImg.naturalWidth;
            inputH.value = origImg.naturalHeight;
            document.getElementById('resizer-thumb').src = e.target.result;
            document.getElementById('resizer-name').textContent = file.name;
            document.getElementById('resizer-original-dims').textContent = origImg.naturalWidth + ' x ' + origImg.naturalHeight + ' px (' + (file.size/1024).toFixed(1) + ' KB)';
            dropzone.style.display = 'none';
            document.getElementById('resizer-file-info').style.display = 'flex';
            btnAction.disabled = false;
            applyResize();
          };
          origImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }

      inputW.addEventListener('input', () => {
        if (lockAspect.checked && origImg && naturalAspect) {
          const w = parseFloat(inputW.value);
          if (w > 0) inputH.value = Math.round(w / naturalAspect);
        }
      });

      inputH.addEventListener('input', () => {
        if (lockAspect.checked && origImg && naturalAspect) {
          const h = parseFloat(inputH.value);
          if (h > 0) inputW.value = Math.round(h * naturalAspect);
        }
      });

      document.querySelectorAll('.doc-preset').forEach(btn => {
        btn.addEventListener('click', () => {
          inputW.value = btn.dataset.w;
          inputH.value = btn.dataset.h;
          lockAspect.checked = false;
          if (origImg) applyResize();
        });
      });

      document.querySelectorAll('.scale-preset').forEach(btn => {
        btn.addEventListener('click', () => {
          if (!origImg) return;
          const pct = parseFloat(btn.dataset.pct) / 100;
          inputW.value = Math.round(origImg.naturalWidth * pct);
          inputH.value = Math.round(origImg.naturalHeight * pct);
          applyResize();
        });
      });

      btnAction.addEventListener('click', applyResize);

      function applyResize() {
        if (!origImg) return;
        const w = parseInt(inputW.value) || origImg.naturalWidth;
        const h = parseInt(inputH.value) || origImg.naturalHeight;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        const format = document.getElementById('resize-format').value;

        if (format === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
        }
        ctx.drawImage(origImg, 0, 0, w, h);

        canvas.toBlob((blob) => {
          resizedBlob = blob;
          const url = URL.createObjectURL(blob);
          document.getElementById('resized-preview-img').src = url;
          document.getElementById('resized-meta').textContent = w + ' x ' + h + ' px • ' + (blob.size/1024).toFixed(1) + ' KB';
          document.getElementById('resizer-placeholder').style.display = 'none';
          document.getElementById('resizer-result-display').style.display = 'block';
          document.getElementById('resizer-download-wrap').style.display = 'block';
          document.getElementById('resized-badge').style.display = 'inline-block';
          showToast('Image resized to ' + w + 'x' + h + ' px', 'success');
        }, format, 0.9);
      }

      btnDownload.addEventListener('click', () => {
        if (!resizedBlob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(resizedBlob);
        const ext = document.getElementById('resize-format').value.split('/')[1];
        link.download = 'smarthub-resized-' + inputW.value + 'x' + inputH.value + '.' + (ext === 'jpeg' ? 'jpg' : ext);
        link.click();
      });
    `
  },

  // 3. JPG to PNG Converter
  "jpg-to-png": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="dropzone" id="jpg-dropzone">
            <input type="file" id="jpg-input" accept="image/jpeg,image/jpg">
            <div class="dropzone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
            </div>
            <div class="dropzone-title">Upload JPG Image</div>
            <div class="dropzone-subtitle">Convert JPEG to Lossless Transparent-ready PNG</div>
          </div>

          <div id="jpg-info" class="file-preview-card" style="display:none; margin-top:1rem;">
            <div class="file-preview-info">
              <img id="jpg-thumb" src="" alt="Thumbnail">
              <div>
                <div class="file-name" id="jpg-name">photo.jpg</div>
                <div class="file-meta" id="jpg-size">0 KB</div>
              </div>
            </div>
            <button class="btn btn-sm btn-secondary" id="btn-jpg-reset">Change</button>
          </div>

          <button class="btn btn-primary" id="btn-convert-png" style="width:100%; margin-top:1.5rem;" disabled>
            Convert to PNG
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">Converted PNG Output</span>
                <span class="badge badge-success" id="png-badge" style="display:none;">PNG Ready</span>
              </div>

              <div id="png-placeholder" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
                <p>Upload a JPG file to instantaneously generate a high-quality PNG.</p>
              </div>

              <div id="png-result-view" style="display:none; text-align:center;">
                <div style="border:1px solid var(--border-color); border-radius:var(--radius-md); overflow:hidden; margin-bottom:1rem; max-height:260px; background:repeating-conic-gradient(#f1f5f9 0% 25%, #ffffff 0% 50%) 50% / 16px 16px;">
                  <img id="png-preview" src="" alt="PNG Output" style="max-height:260px; margin:0 auto; object-fit:contain;">
                </div>
                <div class="file-meta" id="png-meta-text" style="font-weight:600; color:var(--text-main);"></div>
              </div>
            </div>

            <div id="png-download-box" style="display:none; margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-download-png" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download PNG Image
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      let origJpg = null;
      let pngBlob = null;
      let rawName = 'image';

      const fileInput = document.getElementById('jpg-input');
      const dropzone = document.getElementById('jpg-dropzone');
      const btnConvert = document.getElementById('btn-convert-png');
      const btnDownload = document.getElementById('btn-download-png');
      const btnReset = document.getElementById('btn-jpg-reset');

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
          const file = e.target.files[0];
          rawName = file.name.replace(/\\.[^/.]+$/, "");
          const reader = new FileReader();
          reader.onload = (ev) => {
            origJpg = new Image();
            origJpg.onload = () => {
              document.getElementById('jpg-thumb').src = ev.target.result;
              document.getElementById('jpg-name').textContent = file.name;
              document.getElementById('jpg-size').textContent = (file.size/1024).toFixed(1) + ' KB';
              dropzone.style.display = 'none';
              document.getElementById('jpg-info').style.display = 'flex';
              btnConvert.disabled = false;
              convert();
            };
            origJpg.src = ev.target.result;
          };
          reader.readAsDataURL(file);
        }
      });

      btnReset.addEventListener('click', () => {
        origJpg = null;
        pngBlob = null;
        fileInput.value = '';
        dropzone.style.display = 'flex';
        document.getElementById('jpg-info').style.display = 'none';
        btnConvert.disabled = true;
        document.getElementById('png-placeholder').style.display = 'block';
        document.getElementById('png-result-view').style.display = 'none';
        document.getElementById('png-download-box').style.display = 'none';
      });

      btnConvert.addEventListener('click', convert);

      function convert() {
        if (!origJpg) return;
        const canvas = document.createElement('canvas');
        canvas.width = origJpg.naturalWidth;
        canvas.height = origJpg.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(origJpg, 0, 0);

        canvas.toBlob((blob) => {
          pngBlob = blob;
          document.getElementById('png-preview').src = URL.createObjectURL(blob);
          document.getElementById('png-meta-text').textContent = 'PNG Image • ' + (blob.size/1024).toFixed(1) + ' KB • ' + canvas.width + 'x' + canvas.height + ' px';
          document.getElementById('png-placeholder').style.display = 'none';
          document.getElementById('png-result-view').style.display = 'block';
          document.getElementById('png-download-box').style.display = 'block';
          document.getElementById('png-badge').style.display = 'inline-block';
          showToast('Converted to PNG successfully!', 'success');
        }, 'image/png');
      }

      btnDownload.addEventListener('click', () => {
        if (!pngBlob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pngBlob);
        link.download = rawName + '.png';
        link.click();
      });
    `
  },

  // 4. PNG to JPG Converter
  "png-to-jpg": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="dropzone" id="png-dropzone">
            <input type="file" id="png-input" accept="image/png">
            <div class="dropzone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 16V4m0 0l4 4m-4-4l-4 4"/><path d="M7 8v12m0 0l-4-4m4 4l4-4"/></svg>
            </div>
            <div class="dropzone-title">Upload PNG Image</div>
            <div class="dropzone-subtitle">Converts transparent PNG to standard JPG</div>
          </div>

          <div id="png-file-info" class="file-preview-card" style="display:none; margin-top:1rem;">
            <div class="file-preview-info">
              <img id="png-source-thumb" src="" alt="Thumbnail">
              <div>
                <div class="file-name" id="png-file-name">graphic.png</div>
                <div class="file-meta" id="png-file-size">0 KB</div>
              </div>
            </div>
            <button class="btn btn-sm btn-secondary" id="btn-png-reset">Change</button>
          </div>

          <div class="form-group" style="margin-top:1.5rem;">
            <label class="form-label">Background Color for Transparency</label>
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <input type="color" id="bg-color" value="#ffffff" style="width:48px; height:40px; padding:0; border:1px solid var(--border-color); border-radius:var(--radius-sm); cursor:pointer;">
              <span style="font-size:0.875rem; color:var(--text-muted);">Default: White (ensures clean background)</span>
            </div>
          </div>

          <div class="form-group">
            <div class="range-header">
              <label class="form-label">JPG Output Quality: <strong id="jpg-quality-val" style="color:var(--primary);">90%</strong></label>
            </div>
            <input type="range" class="range-slider" id="jpg-quality-slider" min="50" max="100" value="90">
          </div>

          <button class="btn btn-primary" id="btn-convert-jpg" style="width:100%;" disabled>
            Convert to JPG
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">JPG Output</span>
                <span class="badge badge-success" id="jpg-badge" style="display:none;">Ready</span>
              </div>

              <div id="jpg-placeholder" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
                <p>Upload a PNG file and click Convert to generate a compact JPG image.</p>
              </div>

              <div id="jpg-result-view" style="display:none; text-align:center;">
                <div style="border:1px solid var(--border-color); border-radius:var(--radius-md); overflow:hidden; margin-bottom:1rem; max-height:260px; background:var(--bg-surface);">
                  <img id="jpg-preview" src="" alt="JPG Output" style="max-height:260px; margin:0 auto; object-fit:contain;">
                </div>
                <div class="file-meta" id="jpg-meta-text" style="font-weight:600; color:var(--text-main);"></div>
              </div>
            </div>

            <div id="jpg-download-box" style="display:none; margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-download-jpg" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download JPG Image
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      let origPng = null;
      let jpgBlob = null;
      let originalBaseName = 'converted-image';

      const fileInput = document.getElementById('png-input');
      const dropzone = document.getElementById('png-dropzone');
      const btnConvert = document.getElementById('btn-convert-jpg');
      const btnDownload = document.getElementById('btn-download-jpg');
      const btnReset = document.getElementById('btn-png-reset');
      const qualitySlider = document.getElementById('jpg-quality-slider');
      const qualityVal = document.getElementById('jpg-quality-val');
      const bgColor = document.getElementById('bg-color');

      qualitySlider.addEventListener('input', (e) => {
        qualityVal.textContent = e.target.value + '%';
        if (origPng) convert();
      });

      bgColor.addEventListener('input', () => {
        if (origPng) convert();
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
          const file = e.target.files[0];
          originalBaseName = file.name.replace(/\\.[^/.]+$/, "");
          const reader = new FileReader();
          reader.onload = (ev) => {
            origPng = new Image();
            origPng.onload = () => {
              document.getElementById('png-source-thumb').src = ev.target.result;
              document.getElementById('png-file-name').textContent = file.name;
              document.getElementById('png-file-size').textContent = (file.size/1024).toFixed(1) + ' KB';
              dropzone.style.display = 'none';
              document.getElementById('png-file-info').style.display = 'flex';
              btnConvert.disabled = false;
              convert();
            };
            origPng.src = ev.target.result;
          };
          reader.readAsDataURL(file);
        }
      });

      btnReset.addEventListener('click', () => {
        origPng = null;
        jpgBlob = null;
        fileInput.value = '';
        dropzone.style.display = 'flex';
        document.getElementById('png-file-info').style.display = 'none';
        btnConvert.disabled = true;
        document.getElementById('jpg-placeholder').style.display = 'block';
        document.getElementById('jpg-result-view').style.display = 'none';
        document.getElementById('jpg-download-box').style.display = 'none';
      });

      btnConvert.addEventListener('click', convert);

      function convert() {
        if (!origPng) return;
        const canvas = document.createElement('canvas');
        canvas.width = origPng.naturalWidth;
        canvas.height = origPng.naturalHeight;
        const ctx = canvas.getContext('2d');

        // Fill background color
        ctx.fillStyle = bgColor.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(origPng, 0, 0);

        const quality = parseInt(qualitySlider.value) / 100;
        canvas.toBlob((blob) => {
          jpgBlob = blob;
          document.getElementById('jpg-preview').src = URL.createObjectURL(blob);
          document.getElementById('jpg-meta-text').textContent = 'JPG Image • ' + (blob.size/1024).toFixed(1) + ' KB • ' + canvas.width + 'x' + canvas.height + ' px';
          document.getElementById('jpg-placeholder').style.display = 'none';
          document.getElementById('jpg-result-view').style.display = 'block';
          document.getElementById('jpg-download-box').style.display = 'block';
          document.getElementById('jpg-badge').style.display = 'inline-block';
          showToast('Converted to JPG format!', 'success');
        }, 'image/jpeg', quality);
      }

      btnDownload.addEventListener('click', () => {
        if (!jpgBlob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(jpgBlob);
        link.download = originalBaseName + '.jpg';
        link.click();
      });
    `
  },

  // 5. Image Cropper
  "image-cropper": {
    extraHead: `
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css"/>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>
    `,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="dropzone" id="crop-dropzone">
            <input type="file" id="crop-input" accept="image/*">
            <div class="dropzone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>
            </div>
            <div class="dropzone-title">Upload Image to Crop</div>
            <div class="dropzone-subtitle">JPG, PNG, WebP supported</div>
          </div>

          <div id="crop-editor-box" style="display:none; margin-top:1rem;">
            <div style="max-height:400px; background:#000; overflow:hidden; border-radius:var(--radius-md);">
              <img id="image-to-crop" src="" alt="Target to Crop" style="max-width:100%;">
            </div>

            <div style="margin-top:1.25rem;">
              <label class="form-label">Aspect Ratio</label>
              <div class="quick-tags" id="aspect-buttons">
                <button class="btn btn-sm btn-primary aspect-btn" data-ratio="NaN">Freeform</button>
                <button class="btn btn-sm btn-secondary aspect-btn" data-ratio="1">1:1 Square</button>
                <button class="btn btn-sm btn-secondary aspect-btn" data-ratio="1.7777777777777777">16:9 Landscape</button>
                <button class="btn btn-sm btn-secondary aspect-btn" data-ratio="1.3333333333333333">4:3 Standard</button>
                <button class="btn btn-sm btn-secondary aspect-btn" data-ratio="0.8">4:5 Portrait</button>
              </div>
            </div>

            <div style="display:flex; gap:0.5rem; margin-top:1rem;">
              <button class="btn btn-sm btn-secondary" id="btn-rotate-left">↶ Rotate Left</button>
              <button class="btn btn-sm btn-secondary" id="btn-rotate-right">↷ Rotate Right</button>
              <button class="btn btn-sm btn-secondary" id="btn-reset-crop">Reset</button>
            </div>

            <button class="btn btn-primary" id="btn-execute-crop" style="width:100%; margin-top:1.25rem;">
              Crop & Generate Preview
            </button>
          </div>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">Cropped Output</span>
                <span class="badge badge-success" id="cropped-badge" style="display:none;">Cropped</span>
              </div>

              <div id="crop-placeholder" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
                <p>Upload an image and adjust the crop boundaries to preview the result.</p>
              </div>

              <div id="crop-result-view" style="display:none; text-align:center;">
                <div style="border:1px solid var(--border-color); border-radius:var(--radius-md); overflow:hidden; margin-bottom:1rem; max-height:280px; background:var(--bg-surface);">
                  <img id="cropped-preview" src="" alt="Cropped Preview" style="max-height:280px; margin:0 auto; object-fit:contain;">
                </div>
                <div class="file-meta" id="crop-meta-text" style="font-weight:600; color:var(--text-main);"></div>
              </div>
            </div>

            <div id="crop-download-box" style="display:none; margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-download-cropped" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Cropped Image
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      let cropper = null;
      let croppedCanvas = null;

      const fileInput = document.getElementById('crop-input');
      const dropzone = document.getElementById('crop-dropzone');
      const imgElement = document.getElementById('image-to-crop');
      const editorBox = document.getElementById('crop-editor-box');
      const btnCrop = document.getElementById('btn-execute-crop');
      const btnDownload = document.getElementById('btn-download-cropped');

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (ev) => {
            imgElement.src = ev.target.result;
            dropzone.style.display = 'none';
            editorBox.style.display = 'block';

            if (cropper) cropper.destroy();
            cropper = new Cropper(imgElement, {
              aspectRatio: NaN,
              viewMode: 1,
              autoCropArea: 0.8,
              responsive: true
            });
          };
          reader.readAsDataURL(file);
        }
      });

      document.querySelectorAll('.aspect-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.aspect-btn').forEach(b => {
            b.classList.remove('btn-primary');
            b.classList.add('btn-secondary');
          });
          btn.classList.add('btn-primary');
          btn.classList.remove('btn-secondary');

          const ratio = parseFloat(btn.dataset.ratio);
          if (cropper) cropper.setAspectRatio(ratio);
        });
      });

      document.getElementById('btn-rotate-left').addEventListener('click', () => {
        if (cropper) cropper.rotate(-90);
      });
      document.getElementById('btn-rotate-right').addEventListener('click', () => {
        if (cropper) cropper.rotate(90);
      });
      document.getElementById('btn-reset-crop').addEventListener('click', () => {
        if (cropper) cropper.reset();
      });

      btnCrop.addEventListener('click', () => {
        if (!cropper) return;
        croppedCanvas = cropper.getCroppedCanvas();
        if (!croppedCanvas) return;

        const dataUrl = croppedCanvas.toDataURL('image/jpeg', 0.92);
        document.getElementById('cropped-preview').src = dataUrl;
        document.getElementById('crop-meta-text').textContent = croppedCanvas.width + ' x ' + croppedCanvas.height + ' px';

        document.getElementById('crop-placeholder').style.display = 'none';
        document.getElementById('crop-result-view').style.display = 'block';
        document.getElementById('crop-download-box').style.display = 'block';
        document.getElementById('cropped-badge').style.display = 'inline-block';
        showToast('Image cropped successfully!', 'success');
      });

      btnDownload.addEventListener('click', () => {
        if (!croppedCanvas) return;
        const link = document.createElement('a');
        link.href = croppedCanvas.toDataURL('image/jpeg', 0.92);
        link.download = 'smarthub-cropped.jpg';
        link.click();
      });
    `
  },

  // 6. Image to PDF Converter
  "image-to-pdf": {
    extraHead: `
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    `,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="dropzone" id="img2pdf-dropzone">
            <input type="file" id="img2pdf-input" multiple accept="image/jpeg,image/png,image/webp">
            <div class="dropzone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="13" r="1.5"/><polyline points="15 17 12 14 9 17"/></svg>
            </div>
            <div class="dropzone-title">Select Single or Multiple Images</div>
            <div class="dropzone-subtitle">JPG, PNG, WEBP (Batch to PDF)</div>
          </div>

          <div id="image-queue-wrapper" style="display:none; margin-top:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <span class="form-label" style="margin:0;">Uploaded Images (<span id="queue-count">0</span>)</span>
              <button class="btn btn-sm btn-secondary" id="btn-clear-queue">Clear All</button>
            </div>
            <div id="image-queue-list" style="display:flex; flex-direction:column; gap:0.5rem; max-height:220px; overflow-y:auto; padding-right:4px;"></div>
          </div>

          <div class="form-row" style="margin-top:1.5rem;">
            <div class="form-group">
              <label class="form-label">Page Orientation</label>
              <select class="form-control" id="pdf-orientation">
                <option value="p">Portrait</option>
                <option value="l">Landscape</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Page Format</label>
              <select class="form-control" id="pdf-format">
                <option value="a4">A4 (Standard)</option>
                <option value="letter">US Letter</option>
              </select>
            </div>
          </div>

          <button class="btn btn-primary" id="btn-generate-pdf" style="width:100%;" disabled>
            Convert Images to PDF
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">Generated PDF</span>
                <span class="badge badge-success" id="pdf-badge" style="display:none;">Ready</span>
              </div>

              <div id="img2pdf-placeholder" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
                <p>Add one or more images on the left and convert to combine them into a single clean PDF.</p>
              </div>

              <div id="img2pdf-result-view" style="display:none; text-align:center; padding:1.5rem 0;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5" style="margin:0 auto 1rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <h4 style="font-size:1.15rem; font-weight:700;" id="result-pdf-name">smarthub-document.pdf</h4>
                <p class="file-meta" id="result-pdf-meta" style="margin-top:0.35rem; font-size:0.875rem;">1 Page(s)</p>
              </div>
            </div>

            <div id="img2pdf-download-wrap" style="display:none; margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-download-doc" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download PDF Document
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      let uploadedFiles = [];
      let generatedPdfBlob = null;

      const fileInput = document.getElementById('img2pdf-input');
      const queueList = document.getElementById('image-queue-list');
      const queueWrapper = document.getElementById('image-queue-wrapper');
      const queueCount = document.getElementById('queue-count');
      const btnGenerate = document.getElementById('btn-generate-pdf');
      const btnClear = document.getElementById('btn-clear-queue');
      const btnDownload = document.getElementById('btn-download-doc');

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
          for (let file of e.target.files) {
            uploadedFiles.push(file);
          }
          renderQueue();
        }
      });

      btnClear.addEventListener('click', () => {
        uploadedFiles = [];
        fileInput.value = '';
        renderQueue();
        document.getElementById('img2pdf-placeholder').style.display = 'block';
        document.getElementById('img2pdf-result-view').style.display = 'none';
        document.getElementById('img2pdf-download-wrap').style.display = 'none';
      });

      function renderQueue() {
        queueCount.textContent = uploadedFiles.length;
        if (uploadedFiles.length === 0) {
          queueWrapper.style.display = 'none';
          btnGenerate.disabled = true;
          return;
        }

        queueWrapper.style.display = 'block';
        btnGenerate.disabled = false;
        queueList.innerHTML = uploadedFiles.map((f, idx) => \`
          <div class="file-preview-card" style="margin:0; padding:0.5rem 0.75rem;">
            <div class="file-preview-info">
              <span class="badge badge-primary">\${idx + 1}</span>
              <span class="file-name" style="max-width:180px;">\${f.name}</span>
            </div>
            <button class="btn btn-sm" style="color:var(--danger); padding:0.2rem 0.5rem;" onclick="removeQueueItem(\${idx})">✕</button>
          </div>
        \`).join('');
      }

      window.removeQueueItem = function(index) {
        uploadedFiles.splice(index, 1);
        renderQueue();
      };

      btnGenerate.addEventListener('click', async () => {
        if (uploadedFiles.length === 0) return;
        const { jsPDF } = window.jspdf;
        const orientation = document.getElementById('pdf-orientation').value;
        const format = document.getElementById('pdf-format').value;

        const doc = new jsPDF({
          orientation: orientation,
          unit: 'mm',
          format: format
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;

        for (let i = 0; i < uploadedFiles.length; i++) {
          if (i > 0) doc.addPage(format, orientation);
          const imgData = await readFileAsDataURL(uploadedFiles[i]);
          const imgProps = await getImageProperties(imgData);

          const maxW = pageWidth - (margin * 2);
          const maxH = pageHeight - (margin * 2);

          let w = maxW;
          let h = (imgProps.height * w) / imgProps.width;

          if (h > maxH) {
            h = maxH;
            w = (imgProps.width * h) / imgProps.height;
          }

          const x = (pageWidth - w) / 2;
          const y = (pageHeight - h) / 2;

          doc.addImage(imgData, 'JPEG', x, y, w, h);
        }

        generatedPdfBlob = doc.output('blob');
        document.getElementById('result-pdf-name').textContent = 'smarthub-' + uploadedFiles.length + '-images.pdf';
        document.getElementById('result-pdf-meta').textContent = uploadedFiles.length + ' page(s) • ' + (generatedPdfBlob.size/1024).toFixed(1) + ' KB';
        document.getElementById('img2pdf-placeholder').style.display = 'none';
        document.getElementById('img2pdf-result-view').style.display = 'block';
        document.getElementById('img2pdf-download-wrap').style.display = 'block';
        document.getElementById('pdf-badge').style.display = 'inline-block';
        showToast('PDF created successfully with ' + uploadedFiles.length + ' page(s)!', 'success');
      });

      btnDownload.addEventListener('click', () => {
        if (!generatedPdfBlob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(generatedPdfBlob);
        link.download = 'smarthub-document.pdf';
        link.click();
      });

      function readFileAsDataURL(file) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      }

      function getImageProperties(url) {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
          img.src = url;
        });
      }
    `
  },

  // 7. Smart Background Remover
  "background-remover": {
    extraHead: ``,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="dropzone" id="bg-dropzone">
            <input type="file" id="bg-file" accept="image/jpeg,image/png,image/webp">
            <div class="dropzone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <div class="dropzone-title">Upload Image to Remove Background</div>
            <div class="dropzone-subtitle">Supports JPG, PNG, WEBP (Max 20MB)</div>
          </div>

          <div id="bg-controls" style="display:none; margin-top:1.25rem;">
            <div class="form-group">
              <label class="form-label" style="display:flex; justify-content:space-between;">
                <span>Color Detection Sensitivity / Tolerance</span>
                <span id="tol-val" style="font-weight:700; color:var(--primary);">35%</span>
              </label>
              <input type="range" class="form-range" id="bg-tolerance" min="5" max="85" value="35">
            </div>

            <div class="form-group">
              <label class="form-label" for="bg-replace-mode">Replacement Background</label>
              <select class="form-control" id="bg-replace-mode">
                <option value="transparent">Transparent (PNG)</option>
                <option value="#ffffff">Solid Pure White</option>
                <option value="#111827">Dark Studio (#111827)</option>
                <option value="#f3f4f6">Soft Light Gray (#F3F4F6)</option>
                <option value="#3b82f6">Vibrant Blue (#3B82F6)</option>
              </select>
            </div>

            <button class="btn btn-primary btn-block" id="btn-reprocess-bg" style="margin-top:0.75rem;">
              <span>✨ Re-process Background</span>
            </button>
          </div>
        </div>

        <div class="workspace-col">
          <div style="background: repeating-conic-gradient(#e2e8f0 0% 25%, #ffffff 0% 50%) 50% / 16px 16px; border:2px dashed var(--border-color); border-radius:var(--radius-md); min-height:360px; display:flex; align-items:center; justify-content:center; overflow:hidden; position:relative;" id="canvas-wrap">
            <div id="bg-placeholder" style="color:var(--text-muted); text-align:center; padding:2rem;">
              Upload an image to see the transparent cutout preview here.
            </div>
            <canvas id="bg-canvas" style="display:none; max-width:100%; max-height:480px; object-fit:contain;"></canvas>
          </div>

          <div id="bg-download-wrap" style="display:none; margin-top:1rem;">
            <button class="btn btn-primary btn-block" id="btn-download-bg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Download Cutout PNG</span>
            </button>
          </div>
        </div>
      </div>
    `,
    script: `
      const dropzone = document.getElementById('bg-dropzone');
      const fileInput = document.getElementById('bg-file');
      const controls = document.getElementById('bg-controls');
      const tolSlider = document.getElementById('bg-tolerance');
      const tolVal = document.getElementById('tol-val');
      const replaceMode = document.getElementById('bg-replace-mode');
      const btnReprocess = document.getElementById('btn-reprocess-bg');
      const placeholder = document.getElementById('bg-placeholder');
      const canvas = document.getElementById('bg-canvas');
      const ctx = canvas.getContext('2d');
      const dlWrap = document.getElementById('bg-download-wrap');
      const btnDownload = document.getElementById('btn-download-bg');

      let originalImg = null;
      let rawPixels = null;

      dropzone.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleImage(e.target.files[0]);
      });

      dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) handleImage(e.dataTransfer.files[0]);
      });

      tolSlider.addEventListener('input', () => {
        tolVal.textContent = tolSlider.value + '%';
      });

      function handleImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            originalImg = img;
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            rawPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
            controls.style.display = 'block';
            placeholder.style.display = 'none';
            canvas.style.display = 'block';
            dlWrap.style.display = 'block';
            removeBackground();
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }

      function removeBackground() {
        if (!originalImg || !rawPixels) return;
        const w = canvas.width;
        const h = canvas.height;
        const src = rawPixels.data;
        const imgData = ctx.createImageData(w, h);
        const dst = imgData.data;

        // Sample corner pixels to determine background reference color
        const corners = [
          0, // top-left
          (w - 1) * 4, // top-right
          ((h - 1) * w) * 4, // bottom-left
          ((h - 1) * w + (w - 1)) * 4 // bottom-right
        ];

        let bgR = 0, bgG = 0, bgB = 0;
        corners.forEach(idx => {
          bgR += src[idx];
          bgG += src[idx + 1];
          bgB += src[idx + 2];
        });
        bgR /= 4; bgG /= 4; bgB /= 4;

        const tolerance = (parseInt(tolSlider.value) / 100) * 441; // Max RGB distance is sqrt(255^2*3) ~ 441.67
        const bgChoice = replaceMode.value;

        let fillR = 0, fillG = 0, fillB = 0, fillA = 0;
        if (bgChoice !== 'transparent') {
          if (bgChoice.startsWith('#')) {
            fillR = parseInt(bgChoice.slice(1, 3), 16);
            fillG = parseInt(bgChoice.slice(3, 5), 16);
            fillB = parseInt(bgChoice.slice(5, 7), 16);
            fillA = 255;
          }
        }

        for (let i = 0; i < src.length; i += 4) {
          const r = src[i];
          const g = src[i + 1];
          const b = src[i + 2];
          const a = src[i + 3];

          // Euclidean color distance from background sample
          const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);

          if (dist < tolerance) {
            // Match background
            if (bgChoice === 'transparent') {
              dst[i] = r;
              dst[i + 1] = g;
              dst[i + 2] = b;
              dst[i + 3] = 0; // Transparent
            } else {
              dst[i] = fillR;
              dst[i + 1] = fillG;
              dst[i + 2] = fillB;
              dst[i + 3] = fillA;
            }
          } else {
            dst[i] = r;
            dst[i + 1] = g;
            dst[i + 2] = b;
            dst[i + 3] = a;
          }
        }

        ctx.putImageData(imgData, 0, 0);
        showToast('Background processed successfully! ✨', 'success');
      }

      btnReprocess.addEventListener('click', removeBackground);
      replaceMode.addEventListener('change', removeBackground);

      btnDownload.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'cutout-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    `
  }
};
