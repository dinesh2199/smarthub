/**
 * Workspace definitions & client-side scripts for PDF Tools (6 tools)
 */

module.exports = {
  // 7. PDF to JPG Converter
  "pdf-to-jpg": {
    extraHead: `
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    `,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="dropzone" id="p2j-dropzone">
            <input type="file" id="p2j-file" accept="application/pdf">
            <div class="dropzone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18l4-4-4-4"/><line x1="8" y1="14" x2="16" y2="14"/></svg>
            </div>
            <div class="dropzone-title">Upload PDF File</div>
            <div class="dropzone-subtitle">Convert every page into high-res JPG photos</div>
          </div>

          <div id="p2j-file-info" class="file-preview-card" style="display:none; margin-top:1rem;">
            <div class="file-preview-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
              <div>
                <div class="file-name" id="p2j-name">document.pdf</div>
                <div class="file-meta" id="p2j-pages">0 Pages</div>
              </div>
            </div>
            <button class="btn btn-sm btn-secondary" id="btn-p2j-reset">Change</button>
          </div>

          <div class="form-group" style="margin-top:1.5rem;">
            <label class="form-label">Render Resolution Quality</label>
            <select class="form-control" id="p2j-dpi">
              <option value="1.5">Standard HD (1.5x - Fast)</option>
              <option value="2.0" selected>High Resolution (2x - Recommended)</option>
              <option value="3.0">Ultra Crisp (3x - Best Details)</option>
            </select>
          </div>

          <button class="btn btn-primary" id="btn-p2j-convert" style="width:100%;" disabled>
            Extract & Convert All Pages
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">Converted Pages</span>
                <span class="badge badge-success" id="p2j-badge" style="display:none;">0 Pages Ready</span>
              </div>

              <div id="p2j-placeholder" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
                <p>Upload a PDF to render and extract every page as standalone JPG images.</p>
              </div>

              <div id="p2j-progress-box" style="display:none; text-align:center; padding:2rem 0;">
                <p style="font-weight:600; margin-bottom:0.5rem;" id="p2j-status-text">Rendering pages...</p>
                <div style="background:var(--border-color); height:8px; border-radius:4px; overflow:hidden;">
                  <div id="p2j-progress-bar" style="width:0%; height:100%; background:var(--primary); transition:width 0.2s;"></div>
                </div>
              </div>

              <div id="p2j-gallery" style="display:none; max-height:350px; overflow-y:auto; gap:1rem; flex-direction:column;"></div>
            </div>

            <div id="p2j-zip-download" style="display:none; margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-download-all-zip" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download All Pages (ZIP)
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      let currentPdfDoc = null;
      let convertedImages = [];
      let baseDocName = 'pdf-page';

      const fileInput = document.getElementById('p2j-file');
      const dropzone = document.getElementById('p2j-dropzone');
      const btnConvert = document.getElementById('btn-p2j-convert');
      const btnReset = document.getElementById('btn-p2j-reset');
      const gallery = document.getElementById('p2j-gallery');
      const btnZip = document.getElementById('btn-download-all-zip');

      fileInput.addEventListener('change', async (e) => {
        if (!e.target.files.length) return;
        const file = e.target.files[0];
        baseDocName = file.name.replace(/\\.[^/.]+$/, "");
        document.getElementById('p2j-name').textContent = file.name;

        const arrayBuffer = await file.arrayBuffer();
        try {
          currentPdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          document.getElementById('p2j-pages').textContent = currentPdfDoc.numPages + ' Page(s) • ' + (file.size/1024).toFixed(1) + ' KB';
          dropzone.style.display = 'none';
          document.getElementById('p2j-file-info').style.display = 'flex';
          btnConvert.disabled = false;
        } catch (err) {
          showToast('Failed to open PDF document.', 'error');
        }
      });

      btnReset.addEventListener('click', () => {
        currentPdfDoc = null;
        convertedImages = [];
        fileInput.value = '';
        dropzone.style.display = 'flex';
        document.getElementById('p2j-file-info').style.display = 'none';
        btnConvert.disabled = true;
        document.getElementById('p2j-placeholder').style.display = 'block';
        document.getElementById('p2j-gallery').style.display = 'none';
        document.getElementById('p2j-zip-download').style.display = 'none';
      });

      btnConvert.addEventListener('click', async () => {
        if (!currentPdfDoc) return;
        convertedImages = [];
        gallery.innerHTML = '';
        document.getElementById('p2j-placeholder').style.display = 'none';
        document.getElementById('p2j-progress-box').style.display = 'block';
        btnConvert.disabled = true;

        const scale = parseFloat(document.getElementById('p2j-dpi').value) || 2.0;
        const total = currentPdfDoc.numPages;

        for (let p = 1; p <= total; p++) {
          document.getElementById('p2j-status-text').textContent = 'Rendering page ' + p + ' of ' + total + '...';
          document.getElementById('p2j-progress-bar').style.width = Math.round((p / total) * 100) + '%';

          const page = await currentPdfDoc.getPage(p);
          const viewport = page.getViewport({ scale: scale });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({ canvasContext: ctx, viewport: viewport }).promise;
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          convertedImages.push({ pageNumber: p, dataUrl: dataUrl });
        }

        document.getElementById('p2j-progress-box').style.display = 'none';
        renderGallery();
        document.getElementById('p2j-zip-download').style.display = 'block';
        document.getElementById('p2j-badge').textContent = total + ' Pages Ready';
        document.getElementById('p2j-badge').style.display = 'inline-block';
        showToast('Converted all ' + total + ' pages to JPG!', 'success');
      });

      function renderGallery() {
        gallery.style.display = 'flex';
        gallery.innerHTML = convertedImages.map(item => \`
          <div class="file-preview-card" style="margin:0; padding:0.75rem 1rem;">
            <div class="file-preview-info">
              <img src="\${item.dataUrl}" style="width:48px; height:60px; object-fit:cover; border-radius:4px; border:1px solid var(--border-color);">
              <div>
                <div class="file-name">Page \${item.pageNumber}</div>
                <div class="file-meta">JPG Format</div>
              </div>
            </div>
            <a href="\${item.dataUrl}" download="\${baseDocName}-page-\${item.pageNumber}.jpg" class="btn btn-sm btn-primary">Download JPG</a>
          </div>
        \`).join('');
      }

      btnZip.addEventListener('click', async () => {
        if (convertedImages.length === 0) return;
        const zip = new JSZip();
        for (let item of convertedImages) {
          const base64Data = item.dataUrl.split(',')[1];
          zip.file(baseDocName + '-page-' + item.pageNumber + '.jpg', base64Data, { base64: true });
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = baseDocName + '-pages.zip';
        link.click();
      });
    `
  },

  // 8. JPG to PDF Converter
  "jpg-to-pdf": {
    extraHead: `
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    `,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="dropzone" id="j2p-dropzone">
            <input type="file" id="j2p-file" multiple accept="image/jpeg,image/jpg">
            <div class="dropzone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 12v6m-3-3l3 3 3-3"/></svg>
            </div>
            <div class="dropzone-title">Upload JPG Photos</div>
            <div class="dropzone-subtitle">Batch convert JPG images into unified PDF</div>
          </div>

          <div id="j2p-list-box" style="display:none; margin-top:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <span class="form-label" style="margin:0;">Files Selected (<span id="j2p-count">0</span>)</span>
              <button class="btn btn-sm btn-secondary" id="btn-j2p-clear">Clear</button>
            </div>
            <div id="j2p-items" style="display:flex; flex-direction:column; gap:0.5rem; max-height:220px; overflow-y:auto;"></div>
          </div>

          <div class="form-row" style="margin-top:1.5rem;">
            <div class="form-group">
              <label class="form-label">Orientation</label>
              <select class="form-control" id="j2p-orientation">
                <option value="p">Portrait</option>
                <option value="l">Landscape</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Page Size</label>
              <select class="form-control" id="j2p-size">
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
              </select>
            </div>
          </div>

          <button class="btn btn-primary" id="btn-j2p-action" style="width:100%;" disabled>
            Generate PDF
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">PDF Preview</span>
                <span class="badge badge-success" id="j2p-badge" style="display:none;">Ready</span>
              </div>

              <div id="j2p-placeholder" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
                <p>Add JPG pictures to merge and format them into a single PDF document.</p>
              </div>

              <div id="j2p-result-view" style="display:none; text-align:center; padding:1.5rem 0;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5" style="margin:0 auto 1rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <h4 style="font-size:1.15rem; font-weight:700;" id="j2p-doc-title">converted.pdf</h4>
                <p class="file-meta" id="j2p-doc-details">Ready to download</p>
              </div>
            </div>

            <div id="j2p-dl-wrap" style="display:none; margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-j2p-download" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Converted PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      let jpgFiles = [];
      let pdfOutputBlob = null;

      const fileInput = document.getElementById('j2p-file');
      const itemsContainer = document.getElementById('j2p-items');
      const countLabel = document.getElementById('j2p-count');
      const listBox = document.getElementById('j2p-list-box');
      const btnAction = document.getElementById('btn-j2p-action');
      const btnClear = document.getElementById('btn-j2p-clear');
      const btnDownload = document.getElementById('btn-j2p-download');

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
          for (let f of e.target.files) jpgFiles.push(f);
          updateList();
        }
      });

      btnClear.addEventListener('click', () => {
        jpgFiles = [];
        fileInput.value = '';
        updateList();
        document.getElementById('j2p-placeholder').style.display = 'block';
        document.getElementById('j2p-result-view').style.display = 'none';
        document.getElementById('j2p-dl-wrap').style.display = 'none';
      });

      function updateList() {
        countLabel.textContent = jpgFiles.length;
        if (jpgFiles.length === 0) {
          listBox.style.display = 'none';
          btnAction.disabled = true;
          return;
        }
        listBox.style.display = 'block';
        btnAction.disabled = false;
        itemsContainer.innerHTML = jpgFiles.map((f, i) => \`
          <div class="file-preview-card" style="margin:0; padding:0.4rem 0.75rem;">
            <div class="file-preview-info">
              <span class="badge badge-primary">\${i+1}</span>
              <span class="file-name" style="max-width:180px;">\${f.name}</span>
            </div>
            <button class="btn btn-sm" style="color:var(--danger);" onclick="removeJpg(\${i})">✕</button>
          </div>
        \`).join('');
      }

      window.removeJpg = function(i) {
        jpgFiles.splice(i, 1);
        updateList();
      };

      btnAction.addEventListener('click', async () => {
        if (jpgFiles.length === 0) return;
        const { jsPDF } = window.jspdf;
        const orientation = document.getElementById('j2p-orientation').value;
        const format = document.getElementById('j2p-size').value;

        const doc = new jsPDF({ orientation, unit: 'mm', format });
        const pW = doc.internal.pageSize.getWidth();
        const pH = doc.internal.pageSize.getHeight();
        const margin = 10;

        for (let i = 0; i < jpgFiles.length; i++) {
          if (i > 0) doc.addPage(format, orientation);
          const dataUrl = await new Promise(res => {
            const r = new FileReader();
            r.onload = ev => res(ev.target.result);
            r.readAsDataURL(jpgFiles[i]);
          });
          const img = await new Promise(res => {
            const im = new Image();
            im.onload = () => res(im);
            im.src = dataUrl;
          });

          const maxW = pW - (margin * 2);
          const maxH = pH - (margin * 2);
          let w = maxW;
          let h = (img.naturalHeight * w) / img.naturalWidth;
          if (h > maxH) {
            h = maxH;
            w = (img.naturalWidth * h) / img.naturalHeight;
          }
          const x = (pW - w) / 2;
          const y = (pH - h) / 2;
          doc.addImage(dataUrl, 'JPEG', x, y, w, h);
        }

        pdfOutputBlob = doc.output('blob');
        document.getElementById('j2p-doc-title').textContent = 'smarthub-jpgs.pdf';
        document.getElementById('j2p-doc-details').textContent = jpgFiles.length + ' page(s) • ' + (pdfOutputBlob.size/1024).toFixed(1) + ' KB';
        document.getElementById('j2p-placeholder').style.display = 'none';
        document.getElementById('j2p-result-view').style.display = 'block';
        document.getElementById('j2p-dl-wrap').style.display = 'block';
        document.getElementById('j2p-badge').style.display = 'inline-block';
        showToast('Generated PDF successfully!', 'success');
      });

      btnDownload.addEventListener('click', () => {
        if (!pdfOutputBlob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfOutputBlob);
        link.download = 'smarthub-document.pdf';
        link.click();
      });
    `
  },

  // 9. Merge PDF
  "merge-pdf": {
    extraHead: `
      <script src="https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js"></script>
    `,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="dropzone" id="merge-dropzone">
            <input type="file" id="merge-file-input" multiple accept="application/pdf">
            <div class="dropzone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 7h8m-8 4h8m-8 4h5"/><rect x="4" y="3" width="16" height="18" rx="2"/></svg>
            </div>
            <div class="dropzone-title">Select 2 or More PDFs to Merge</div>
            <div class="dropzone-subtitle">Drag to reorder files and unite into one file</div>
          </div>

          <div id="merge-list-wrap" style="display:none; margin-top:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <span class="form-label" style="margin:0;">PDFs to Merge (<span id="merge-file-count">0</span>)</span>
              <button class="btn btn-sm btn-secondary" id="btn-merge-clear">Clear All</button>
            </div>
            <div id="merge-files-list" style="display:flex; flex-direction:column; gap:0.5rem; max-height:240px; overflow-y:auto;"></div>
          </div>

          <button class="btn btn-primary" id="btn-merge-action" style="width:100%; margin-top:1.5rem;" disabled>
            Merge PDFs Now
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">Merged PDF Document</span>
                <span class="badge badge-success" id="merge-badge" style="display:none;">Merged</span>
              </div>

              <div id="merge-placeholder" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
                <p>Upload at least two PDF files and click merge to produce a single document.</p>
              </div>

              <div id="merge-result-view" style="display:none; text-align:center; padding:1.5rem 0;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5" style="margin:0 auto 1rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <h4 style="font-size:1.15rem; font-weight:700;">merged-document.pdf</h4>
                <p class="file-meta" id="merge-result-meta" style="margin-top:0.35rem;">0 Pages</p>
              </div>
            </div>

            <div id="merge-dl-wrap" style="display:none; margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-download-merged" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Merged PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      let pdfDocs = [];
      let mergedBlob = null;

      const fileInput = document.getElementById('merge-file-input');
      const filesList = document.getElementById('merge-files-list');
      const listWrap = document.getElementById('merge-list-wrap');
      const countSpan = document.getElementById('merge-file-count');
      const btnMerge = document.getElementById('btn-merge-action');
      const btnClear = document.getElementById('btn-merge-clear');
      const btnDownload = document.getElementById('btn-download-merged');

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
          for (let f of e.target.files) pdfDocs.push(f);
          renderList();
        }
      });

      btnClear.addEventListener('click', () => {
        pdfDocs = [];
        fileInput.value = '';
        renderList();
        document.getElementById('merge-placeholder').style.display = 'block';
        document.getElementById('merge-result-view').style.display = 'none';
        document.getElementById('merge-dl-wrap').style.display = 'none';
      });

      function renderList() {
        countSpan.textContent = pdfDocs.length;
        if (pdfDocs.length < 2) {
          listWrap.style.display = pdfDocs.length > 0 ? 'block' : 'none';
          btnMerge.disabled = true;
        } else {
          listWrap.style.display = 'block';
          btnMerge.disabled = false;
        }

        filesList.innerHTML = pdfDocs.map((f, i) => \`
          <div class="file-preview-card" style="margin:0; padding:0.5rem 0.75rem;">
            <div class="file-preview-info">
              <span class="badge badge-primary">\${i+1}</span>
              <div>
                <div class="file-name" style="max-width:160px;">\${f.name}</div>
                <div class="file-meta">\${(f.size/1024).toFixed(1)} KB</div>
              </div>
            </div>
            <div style="display:flex; gap:4px;">
              \${i > 0 ? '<button class="btn btn-sm btn-secondary" onclick="movePdf('+i+', -1)">↑</button>' : ''}
              \${i < pdfDocs.length - 1 ? '<button class="btn btn-sm btn-secondary" onclick="movePdf('+i+', 1)">↓</button>' : ''}
              <button class="btn btn-sm" style="color:var(--danger);" onclick="removePdf('+i+')">✕</button>
            </div>
          </div>
        \`).join('');
      }

      window.movePdf = function(index, dir) {
        const item = pdfDocs.splice(index, 1)[0];
        pdfDocs.splice(index + dir, 0, item);
        renderList();
      };

      window.removePdf = function(index) {
        pdfDocs.splice(index, 1);
        renderList();
      };

      btnMerge.addEventListener('click', async () => {
        if (pdfDocs.length < 2) return;
        const { PDFDocument } = PDFLib;
        const mergedPdf = await PDFDocument.create();
        let totalPages = 0;

        for (let file of pdfDocs) {
          const arrayBuffer = await file.arrayBuffer();
          const srcPdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
          copiedPages.forEach(p => mergedPdf.addPage(p));
          totalPages += srcPdf.getPageCount();
        }

        const pdfBytes = await mergedPdf.save();
        mergedBlob = new Blob([pdfBytes], { type: 'application/pdf' });

        document.getElementById('merge-result-meta').textContent = totalPages + ' total pages • ' + (mergedBlob.size/1024).toFixed(1) + ' KB';
        document.getElementById('merge-placeholder').style.display = 'none';
        document.getElementById('merge-result-view').style.display = 'block';
        document.getElementById('merge-dl-wrap').style.display = 'block';
        document.getElementById('merge-badge').style.display = 'inline-block';
        showToast('Successfully merged ' + pdfDocs.length + ' PDF files!', 'success');
      });

      btnDownload.addEventListener('click', () => {
        if (!mergedBlob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(mergedBlob);
        link.download = 'smarthub-merged.pdf';
        link.click();
      });
    `
  },

  // 10. Split PDF
  "split-pdf": {
    extraHead: `
      <script src="https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js"></script>
    `,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="dropzone" id="split-dropzone">
            <input type="file" id="split-file" accept="application/pdf">
            <div class="dropzone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-5-5z"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
            </div>
            <div class="dropzone-title">Upload PDF to Split</div>
            <div class="dropzone-subtitle">Extract single pages or custom ranges</div>
          </div>

          <div id="split-info" class="file-preview-card" style="display:none; margin-top:1rem;">
            <div class="file-preview-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
              <div>
                <div class="file-name" id="split-filename">doc.pdf</div>
                <div class="file-meta" id="split-pagecount">Total Pages: 0</div>
              </div>
            </div>
            <button class="btn btn-sm btn-secondary" id="btn-split-reset">Change</button>
          </div>

          <div class="form-group" style="margin-top:1.5rem;">
            <label class="form-label">Page Range to Extract</label>
            <input type="text" class="form-control" id="split-range" placeholder="e.g. 1-3, 5, 7-9">
            <div class="form-hint">Enter comma-separated page numbers or ranges (e.g. 1-3, 5).</div>
          </div>

          <button class="btn btn-primary" id="btn-split-action" style="width:100%;" disabled>
            Extract Pages & Download
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">Extracted PDF</span>
                <span class="badge badge-success" id="split-badge" style="display:none;">Ready</span>
              </div>

              <div id="split-placeholder" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
                <p>Upload a document and specify the page range you want to extract.</p>
              </div>

              <div id="split-result-view" style="display:none; text-align:center; padding:1.5rem 0;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5" style="margin:0 auto 1rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <h4 style="font-size:1.15rem; font-weight:700;">extracted-pages.pdf</h4>
                <p class="file-meta" id="split-result-meta">Ready</p>
              </div>
            </div>

            <div id="split-dl-wrap" style="display:none; margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-download-split" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Extracted PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      let splitPdfBytes = null;
      let totalDocPages = 0;
      let splitResultBlob = null;

      const fileInput = document.getElementById('split-file');
      const dropzone = document.getElementById('split-dropzone');
      const rangeInput = document.getElementById('split-range');
      const btnAction = document.getElementById('btn-split-action');
      const btnReset = document.getElementById('btn-split-reset');
      const btnDownload = document.getElementById('btn-download-split');

      fileInput.addEventListener('change', async (e) => {
        if (!e.target.files.length) return;
        const file = e.target.files[0];
        splitPdfBytes = await file.arrayBuffer();

        const { PDFDocument } = PDFLib;
        const pdf = await PDFDocument.load(splitPdfBytes);
        totalDocPages = pdf.getPageCount();

        document.getElementById('split-filename').textContent = file.name;
        document.getElementById('split-pagecount').textContent = 'Total Pages: ' + totalDocPages;
        rangeInput.value = '1-' + Math.min(totalDocPages, 3);

        dropzone.style.display = 'none';
        document.getElementById('split-info').style.display = 'flex';
        btnAction.disabled = false;
      });

      btnReset.addEventListener('click', () => {
        splitPdfBytes = null;
        fileInput.value = '';
        dropzone.style.display = 'flex';
        document.getElementById('split-info').style.display = 'none';
        btnAction.disabled = true;
        document.getElementById('split-placeholder').style.display = 'block';
        document.getElementById('split-result-view').style.display = 'none';
        document.getElementById('split-dl-wrap').style.display = 'none';
      });

      btnAction.addEventListener('click', async () => {
        if (!splitPdfBytes) return;
        const rangeText = rangeInput.value.trim();
        const pagesToExtract = parsePageRange(rangeText, totalDocPages);

        if (pagesToExtract.length === 0) {
          showToast('Please specify valid pages within 1 to ' + totalDocPages, 'error');
          return;
        }

        const { PDFDocument } = PDFLib;
        const srcPdf = await PDFDocument.load(splitPdfBytes);
        const outPdf = await PDFDocument.create();

        const indices = pagesToExtract.map(p => p - 1);
        const copied = await outPdf.copyPages(srcPdf, indices);
        copied.forEach(p => outPdf.addPage(p));

        const bytes = await outPdf.save();
        splitResultBlob = new Blob([bytes], { type: 'application/pdf' });

        document.getElementById('split-result-meta').textContent = pagesToExtract.length + ' page(s) extracted • ' + (splitResultBlob.size/1024).toFixed(1) + ' KB';
        document.getElementById('split-placeholder').style.display = 'none';
        document.getElementById('split-result-view').style.display = 'block';
        document.getElementById('split-dl-wrap').style.display = 'block';
        document.getElementById('split-badge').style.display = 'inline-block';
        showToast('Extracted ' + pagesToExtract.length + ' page(s)!', 'success');
      });

      function parsePageRange(str, max) {
        const pages = new Set();
        const parts = str.split(',');
        for (let part of parts) {
          part = part.trim();
          if (part.includes('-')) {
            const [s, e] = part.split('-').map(x => parseInt(x.trim()));
            if (!isNaN(s) && !isNaN(e)) {
              for (let i = Math.max(1, s); i <= Math.min(max, e); i++) pages.add(i);
            }
          } else {
            const p = parseInt(part);
            if (!isNaN(p) && p >= 1 && p <= max) pages.add(p);
          }
        }
        return Array.from(pages).sort((a,b) => a - b);
      }

      btnDownload.addEventListener('click', () => {
        if (!splitResultBlob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(splitResultBlob);
        link.download = 'smarthub-extracted-pages.pdf';
        link.click();
      });
    `
  },

  // 11. Compress PDF
  "compress-pdf": {
    extraHead: `
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    `,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="dropzone" id="cpdf-dropzone">
            <input type="file" id="cpdf-file" accept="application/pdf">
            <div class="dropzone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13l3 3 3-3"/><path d="M9 17l3-3 3 3"/></svg>
            </div>
            <div class="dropzone-title">Upload PDF to Compress</div>
            <div class="dropzone-subtitle">Reduce file size while preserving legibility</div>
          </div>

          <div id="cpdf-info" class="file-preview-card" style="display:none; margin-top:1rem;">
            <div class="file-preview-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
              <div>
                <div class="file-name" id="cpdf-filename">doc.pdf</div>
                <div class="file-meta" id="cpdf-meta">0 KB</div>
              </div>
            </div>
            <button class="btn btn-sm btn-secondary" id="btn-cpdf-reset">Change</button>
          </div>

          <div class="form-group" style="margin-top:1.5rem;">
            <label class="form-label">Compression Level</label>
            <select class="form-control" id="cpdf-level">
              <option value="0.75" selected>Recommended Compression (Good quality, lower size)</option>
              <option value="0.55">High Compression (Smallest size)</option>
              <option value="0.90">Low Compression (High quality)</option>
            </select>
          </div>

          <button class="btn btn-primary" id="btn-cpdf-action" style="width:100%;" disabled>
            Compress PDF Now
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">Compression Results</span>
                <span class="badge badge-success" id="cpdf-badge" style="display:none;">Saved 0%</span>
              </div>

              <div id="cpdf-placeholder" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
                <p>Upload your PDF document to compare size before and after compression.</p>
              </div>

              <div id="cpdf-result-content" style="display:none;">
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-value" id="cpdf-orig-val" style="font-size:1.35rem; color:var(--text-main);">0 KB</div>
                    <div class="stat-label">Original</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value" id="cpdf-comp-val" style="font-size:1.35rem;">0 KB</div>
                    <div class="stat-label">Compressed</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value" id="cpdf-saved-pct" style="font-size:1.35rem; color:var(--success);">0%</div>
                    <div class="stat-label">Savings</div>
                  </div>
                </div>
              </div>
            </div>

            <div id="cpdf-dl-wrap" style="display:none; margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-download-cpdf" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Compressed PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      let origPdfFile = null;
      let compressedPdfBlob = null;

      const fileInput = document.getElementById('cpdf-file');
      const dropzone = document.getElementById('cpdf-dropzone');
      const btnAction = document.getElementById('btn-cpdf-action');
      const btnReset = document.getElementById('btn-cpdf-reset');
      const btnDownload = document.getElementById('btn-download-cpdf');

      fileInput.addEventListener('change', (e) => {
        if (!e.target.files.length) return;
        origPdfFile = e.target.files[0];
        document.getElementById('cpdf-filename').textContent = origPdfFile.name;
        document.getElementById('cpdf-meta').textContent = (origPdfFile.size/1024).toFixed(1) + ' KB';
        dropzone.style.display = 'none';
        document.getElementById('cpdf-info').style.display = 'flex';
        btnAction.disabled = false;
      });

      btnReset.addEventListener('click', () => {
        origPdfFile = null;
        compressedPdfBlob = null;
        fileInput.value = '';
        dropzone.style.display = 'flex';
        document.getElementById('cpdf-info').style.display = 'none';
        btnAction.disabled = true;
        document.getElementById('cpdf-placeholder').style.display = 'block';
        document.getElementById('cpdf-result-content').style.display = 'none';
        document.getElementById('cpdf-dl-wrap').style.display = 'none';
      });

      btnAction.addEventListener('click', async () => {
        if (!origPdfFile) return;
        showToast('Compressing PDF pages...', 'info');
        const quality = parseFloat(document.getElementById('cpdf-level').value) || 0.75;

        const arrayBuffer = await origPdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const total = pdf.numPages;

        const { jsPDF } = window.jspdf;
        let outDoc = null;

        for (let p = 1; p <= total; p++) {
          const page = await pdf.getPage(p);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({ canvasContext: ctx, viewport: viewport }).promise;
          const imgData = canvas.toDataURL('image/jpeg', quality);

          const orientation = viewport.width > viewport.height ? 'l' : 'p';
          if (!outDoc) {
            outDoc = new jsPDF({ orientation, unit: 'px', format: [viewport.width, viewport.height] });
          } else {
            outDoc.addPage([viewport.width, viewport.height], orientation);
          }
          outDoc.addImage(imgData, 'JPEG', 0, 0, viewport.width, viewport.height);
        }

        compressedPdfBlob = outDoc.output('blob');
        const savedBytes = origPdfFile.size - compressedPdfBlob.size;
        const savedPct = Math.max(0, Math.round((savedBytes / origPdfFile.size) * 100));

        document.getElementById('cpdf-orig-val').textContent = (origPdfFile.size/1024).toFixed(1) + ' KB';
        document.getElementById('cpdf-comp-val').textContent = (compressedPdfBlob.size/1024).toFixed(1) + ' KB';
        document.getElementById('cpdf-saved-pct').textContent = savedPct + '%';

        const badge = document.getElementById('cpdf-badge');
        badge.textContent = savedPct > 0 ? 'Saved ' + savedPct + '%' : 'Optimized';
        badge.style.display = 'inline-block';

        document.getElementById('cpdf-placeholder').style.display = 'none';
        document.getElementById('cpdf-result-content').style.display = 'block';
        document.getElementById('cpdf-dl-wrap').style.display = 'block';
        showToast('PDF compressed successfully!', 'success');
      });

      btnDownload.addEventListener('click', () => {
        if (!compressedPdfBlob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(compressedPdfBlob);
        link.download = 'smarthub-compressed.pdf';
        link.click();
      });
    `
  },

  // 12. Rotate PDF
  "rotate-pdf": {
    extraHead: `
      <script src="https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js"></script>
    `,
    renderWorkspace: () => `
      <div class="workspace-grid">
        <div class="workspace-col">
          <div class="dropzone" id="rot-dropzone">
            <input type="file" id="rot-file" accept="application/pdf">
            <div class="dropzone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><polyline points="21 3 21 8 16 8"/></svg>
            </div>
            <div class="dropzone-title">Upload PDF to Rotate</div>
            <div class="dropzone-subtitle">Rotate pages by 90°, 180°, or 270°</div>
          </div>

          <div id="rot-info" class="file-preview-card" style="display:none; margin-top:1rem;">
            <div class="file-preview-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
              <div>
                <div class="file-name" id="rot-filename">document.pdf</div>
                <div class="file-meta" id="rot-pagecount">0 Pages</div>
              </div>
            </div>
            <button class="btn btn-sm btn-secondary" id="btn-rot-reset">Change</button>
          </div>

          <div class="form-group" style="margin-top:1.5rem;">
            <label class="form-label">Rotation Angle</label>
            <select class="form-control" id="rot-angle">
              <option value="90">90° Clockwise</option>
              <option value="180">180° Flip</option>
              <option value="270">270° (90° Counter-Clockwise)</option>
            </select>
          </div>

          <button class="btn btn-primary" id="btn-rot-action" style="width:100%;" disabled>
            Rotate Pages & Save
          </button>
        </div>

        <div class="workspace-col">
          <div class="result-box" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="result-header">
                <span class="result-title">Rotated Document</span>
                <span class="badge badge-success" id="rot-badge" style="display:none;">Ready</span>
              </div>

              <div id="rot-placeholder" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
                <p>Upload a document and select the rotation angle to adjust your PDF pages.</p>
              </div>

              <div id="rot-result-view" style="display:none; text-align:center; padding:1.5rem 0;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5" style="margin:0 auto 1rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <h4 style="font-size:1.15rem; font-weight:700;">rotated-document.pdf</h4>
                <p class="file-meta" id="rot-meta-text">Ready for download</p>
              </div>
            </div>

            <div id="rot-dl-wrap" style="display:none; margin-top:1.5rem;">
              <button class="btn btn-success" id="btn-download-rot" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Rotated PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    script: `
      let origPdfBytes = null;
      let rotatedPdfBlob = null;

      const fileInput = document.getElementById('rot-file');
      const dropzone = document.getElementById('rot-dropzone');
      const btnAction = document.getElementById('btn-rot-action');
      const btnReset = document.getElementById('btn-rot-reset');
      const btnDownload = document.getElementById('btn-download-rot');

      fileInput.addEventListener('change', async (e) => {
        if (!e.target.files.length) return;
        const file = e.target.files[0];
        origPdfBytes = await file.arrayBuffer();

        const { PDFDocument } = PDFLib;
        const pdf = await PDFDocument.load(origPdfBytes);

        document.getElementById('rot-filename').textContent = file.name;
        document.getElementById('rot-pagecount').textContent = pdf.getPageCount() + ' Page(s)';
        dropzone.style.display = 'none';
        document.getElementById('rot-info').style.display = 'flex';
        btnAction.disabled = false;
      });

      btnReset.addEventListener('click', () => {
        origPdfBytes = null;
        fileInput.value = '';
        dropzone.style.display = 'flex';
        document.getElementById('rot-info').style.display = 'none';
        btnAction.disabled = true;
        document.getElementById('rot-placeholder').style.display = 'block';
        document.getElementById('rot-result-view').style.display = 'none';
        document.getElementById('rot-dl-wrap').style.display = 'none';
      });

      btnAction.addEventListener('click', async () => {
        if (!origPdfBytes) return;
        const angle = parseInt(document.getElementById('rot-angle').value);
        const { PDFDocument, degrees } = PDFLib;

        const pdf = await PDFDocument.load(origPdfBytes);
        const pages = pdf.getPages();

        pages.forEach(p => {
          const currentRotation = p.getRotation().angle;
          p.setRotation(degrees((currentRotation + angle) % 360));
        });

        const bytes = await pdf.save();
        rotatedPdfBlob = new Blob([bytes], { type: 'application/pdf' });

        document.getElementById('rot-meta-text').textContent = pages.length + ' page(s) rotated by ' + angle + '° • ' + (rotatedPdfBlob.size/1024).toFixed(1) + ' KB';
        document.getElementById('rot-placeholder').style.display = 'none';
        document.getElementById('rot-result-view').style.display = 'block';
        document.getElementById('rot-dl-wrap').style.display = 'block';
        document.getElementById('rot-badge').style.display = 'inline-block';
        showToast('PDF rotated by ' + angle + '° successfully!', 'success');
      });

      btnDownload.addEventListener('click', () => {
        if (!rotatedPdfBlob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(rotatedPdfBlob);
        link.download = 'smarthub-rotated.pdf';
        link.click();
      });
    `
  }
};
