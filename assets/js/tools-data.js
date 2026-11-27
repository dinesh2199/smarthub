/**
 * SMARTHUB - Centralized Tools Registry Data
 * Contains all 39 online tools categorized and mapped with search metadata.
 */

const SMARTHUB_CATEGORIES = [
  {
    id: "image",
    name: "Image Tools",
    desc: "Compress, resize, convert, crop and convert your pictures privately.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    badge: "6 Tools"
  },
  {
    id: "pdf",
    name: "PDF Tools",
    desc: "Merge, split, compress, rotate and convert PDF documents in your browser.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    badge: "6 Tools"
  },
  {
    id: "calculators",
    name: "Calculators",
    desc: "Instant financial, age, percentage, EMI and business calculators.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>`,
    badge: "6 Tools"
  },
  {
    id: "qr",
    name: "QR Code Tools",
    desc: "Generate custom QR codes for websites, WhatsApp, WiFi networks and text.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><line x1="10" y1="7" x2="10" y2="7.01"/><line x1="14" y1="10" x2="14" y2="10.01"/><line x1="7" y1="10" x2="7" y2="10.01"/><line x1="10" y1="14" x2="10" y2="14.01"/></svg>`,
    badge: "4 Tools"
  },
  {
    id: "text",
    name: "Text Tools",
    desc: "Word and character counters, case converters, space cleaner, and text-to-speech.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
    badge: "5 Tools"
  },
  {
    id: "developer",
    name: "Developer Tools",
    desc: "JSON and HTML formatters, Base64 encoder/decoder and secure password generator.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    badge: "4 Tools"
  },
  {
    id: "converters",
    name: "Unit Converters",
    desc: "Quick, accurate conversions for distance, weight, temperature and digital storage.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 14 5-5-5-5"/><path d="M4 9h16"/><path d="m9 10-5 5 5 5"/><path d="M20 15H4"/></svg>`,
    badge: "4 Tools"
  },
  {
    id: "other",
    name: "Other Tools",
    desc: "Useful productivity utilities including stopwatch, timer, calendar and random generator.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    badge: "4 Tools"
  }
];

const SMARTHUB_TOOLS = [
  // Image Tools (6)
  {
    id: "image-compressor",
    name: "Image Compressor",
    category: "image",
    categoryName: "Image Tools",
    desc: "Compress JPG, PNG, and WebP images to smaller file sizes with real-time preview and quality control.",
    popular: true,
    recent: false,
    keywords: ["image compressor", "compress image", "reduce photo size", "optimize jpg", "shrink png", "kb mb reducer"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/><path d="M12 7v6m-3-3l3 3 3-3"/></svg>`
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    category: "image",
    categoryName: "Image Tools",
    desc: "Resize pictures by pixel dimensions or percentage while maintaining exact aspect ratio.",
    popular: true,
    recent: false,
    keywords: ["image resizer", "resize image", "change picture dimensions", "scale photo", "aspect ratio"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 3H3v18h18V3z"/><path d="M21 9h-6V3"/><path d="M9 21v-6H3"/></svg>`
  },
  {
    id: "jpg-to-png",
    name: "JPG to PNG Converter",
    category: "image",
    categoryName: "Image Tools",
    desc: "Convert JPEG and JPG photos to high quality lossless PNG format in seconds.",
    popular: false,
    recent: true,
    keywords: ["jpg to png", "jpeg to png", "convert image", "convert jpg", "lossless png"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>`
  },
  {
    id: "png-to-jpg",
    name: "PNG to JPG Converter",
    category: "image",
    categoryName: "Image Tools",
    desc: "Convert PNG images to standard lightweight JPG format with custom background color fill.",
    popular: false,
    recent: false,
    keywords: ["png to jpg", "png to jpeg", "convert png", "image format converter"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 16V4m0 0l4 4m-4-4l-4 4"/><path d="M7 8v12m0 0l-4-4m4 4l4-4"/></svg>`
  },
  {
    id: "image-cropper",
    name: "Image Cropper",
    category: "image",
    categoryName: "Image Tools",
    desc: "Crop any photo with customizable crop boxes, freeform or preset social media aspect ratios.",
    popular: true,
    recent: true,
    keywords: ["image cropper", "crop photo", "cut picture", "square crop", "avatar cropper"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>`
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF Converter",
    category: "image",
    categoryName: "Image Tools",
    desc: "Convert single or multiple JPG and PNG images into a clean, unified PDF document.",
    popular: true,
    recent: false,
    keywords: ["image to pdf", "jpg to pdf", "png to pdf", "photos to pdf document"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="13" r="1.5"/><polyline points="15 17 12 14 9 17"/></svg>`
  },

  // PDF Tools (6)
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG Converter",
    category: "pdf",
    categoryName: "PDF Tools",
    desc: "Extract pages from your PDF documents and convert each page into crisp, high-resolution JPG images.",
    popular: true,
    recent: false,
    keywords: ["pdf to jpg", "pdf to image", "extract pdf pages", "pdf to jpeg"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18l4-4-4-4"/><line x1="8" y1="14" x2="16" y2="14"/></svg>`
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF Converter",
    category: "pdf",
    categoryName: "PDF Tools",
    desc: "Batch convert JPG photos into high-quality PDFs with custom orientation and margins.",
    popular: false,
    recent: true,
    keywords: ["jpg to pdf", "jpeg to pdf converter", "pictures to pdf file", "documents pdf"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 12v6m-3-3l3 3 3-3"/></svg>`
  },
  {
    id: "merge-pdf",
    name: "Merge PDF",
    category: "pdf",
    categoryName: "PDF Tools",
    desc: "Combine multiple PDF documents into a single organized file in seconds.",
    popular: true,
    recent: false,
    keywords: ["merge pdf", "combine pdf", "join pdf", "unite pdf files"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 7h8m-8 4h8m-8 4h5"/><rect x="4" y="3" width="16" height="18" rx="2"/></svg>`
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    category: "pdf",
    categoryName: "PDF Tools",
    desc: "Separate one PDF into individual pages or extract custom page ranges effortlessly.",
    popular: false,
    recent: false,
    keywords: ["split pdf", "separate pdf", "extract pdf pages", "cut pdf"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-5-5z"/><line x1="4" y1="12" x2="20" y2="12"/></svg>`
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    category: "pdf",
    categoryName: "PDF Tools",
    desc: "Reduce PDF document file size while preserving readability and image quality.",
    popular: true,
    recent: true,
    keywords: ["compress pdf", "reduce pdf size", "shrink pdf", "optimize pdf"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13l3 3 3-3"/><path d="M9 17l3-3 3 3"/></svg>`
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    category: "pdf",
    categoryName: "PDF Tools",
    desc: "Rotate PDF pages 90, 180, or 270 degrees and permanently save the corrected orientation.",
    popular: false,
    recent: false,
    keywords: ["rotate pdf", "turn pdf", "flip pdf pages", "pdf orientation"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><polyline points="21 3 21 8 16 8"/></svg>`
  },

  // Calculators (6)
  {
    id: "age-calculator",
    name: "Age Calculator",
    category: "calculators",
    categoryName: "Calculators",
    desc: "Calculate your exact age in years, months, days, hours, and find upcoming birthday countdown.",
    popular: true,
    recent: false,
    keywords: ["age calculator", "calculate age", "birthday calculator", "how old am i"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="15" r="2"/></svg>`
  },
  {
    id: "gst-calculator",
    name: "GST Calculator",
    category: "calculators",
    categoryName: "Calculators",
    desc: "Calculate inclusive or exclusive Goods and Services Tax (GST) with CGST, SGST & IGST breakdown.",
    popular: true,
    recent: false,
    keywords: ["gst calculator", "tax calculator", "inclusive gst", "exclusive gst", "sales tax"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
  },
  {
    id: "emi-calculator",
    name: "EMI Calculator",
    category: "calculators",
    categoryName: "Calculators",
    desc: "Calculate home, car, or personal loan monthly EMI with total interest and payment summary.",
    popular: true,
    recent: false,
    keywords: ["emi calculator", "loan calculator", "monthly installment", "interest calculator", "home loan emi"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>`
  },
  {
    id: "percentage-calculator",
    name: "Percentage Calculator",
    category: "calculators",
    categoryName: "Calculators",
    desc: "Quickly compute percentages, percentage increase or decrease, and ratio proportions.",
    popular: false,
    recent: true,
    keywords: ["percentage calculator", "percent off", "percentage increase", "math calculator"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`
  },
  {
    id: "discount-calculator",
    name: "Discount Calculator",
    category: "calculators",
    categoryName: "Calculators",
    desc: "Find final sale price and total savings after applying percentage discounts and coupon deductions.",
    popular: false,
    recent: false,
    keywords: ["discount calculator", "sale calculator", "price savings", "shopping discount"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`
  },
  {
    id: "profit-loss-calculator",
    name: "Profit & Loss Calculator",
    category: "calculators",
    categoryName: "Calculators",
    desc: "Determine net profit or loss amount and percentage margin based on cost price and selling price.",
    popular: false,
    recent: true,
    keywords: ["profit and loss", "profit loss calculator", "margin calculator", "cost price selling price"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`
  },

  // QR Code Tools (4)
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    category: "qr",
    categoryName: "QR Code Tools",
    desc: "Create custom QR codes from any text or links with customizable colors and instant PNG download.",
    popular: true,
    recent: false,
    keywords: ["qr code generator", "create qr code", "make qr", "custom qr code maker"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><circle cx="6.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="6.5" r="1.5"/><circle cx="6.5" cy="17.5" r="1.5"/></svg>`
  },
  {
    id: "website-qr-code",
    name: "Website QR Code",
    category: "qr",
    categoryName: "QR Code Tools",
    desc: "Generate scannable QR codes specifically optimized for website URLs and landing pages.",
    popular: false,
    recent: true,
    keywords: ["website qr code", "url qr code", "link qr code", "qr for web page"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
  },
  {
    id: "whatsapp-qr-code",
    name: "WhatsApp QR Code",
    category: "qr",
    categoryName: "QR Code Tools",
    desc: "Generate direct WhatsApp chat QR codes with pre-filled greeting messages for business or personal use.",
    popular: true,
    recent: false,
    keywords: ["whatsapp qr code", "wa qr code", "chat qr code", "direct whatsapp link"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`
  },
  {
    id: "wifi-qr-code",
    name: "WiFi QR Code",
    category: "qr",
    categoryName: "QR Code Tools",
    desc: "Allow guests to scan and instantly connect to your home or office WiFi without typing passwords.",
    popular: false,
    recent: true,
    keywords: ["wifi qr code", "wireless qr code", "wifi connect qr", "scan wifi password"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`
  },

  // Text Tools (5)
  {
    id: "word-counter",
    name: "Word Counter",
    category: "text",
    categoryName: "Text Tools",
    desc: "Count words, characters, sentences, paragraphs and calculate estimated reading and speaking times.",
    popular: true,
    recent: false,
    keywords: ["word counter", "count words", "character counter", "reading time", "text analyzer"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`
  },
  {
    id: "character-counter",
    name: "Character Counter",
    category: "text",
    categoryName: "Text Tools",
    desc: "Detailed character counter with spaces, without spaces, bytes length, and social media post limits.",
    popular: false,
    recent: false,
    keywords: ["character counter", "letter counter", "tweet counter", "sms length checker"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`
  },
  {
    id: "case-converter",
    name: "Case Converter",
    category: "text",
    categoryName: "Text Tools",
    desc: "Convert text instantly between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case.",
    popular: true,
    recent: false,
    keywords: ["case converter", "uppercase", "lowercase", "title case", "camelcase", "slugify"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7V5h10v2"/><path d="M8 5v14"/><path d="M15 13v-2h6v2"/><path d="M18 11v8"/></svg>`
  },
  {
    id: "remove-extra-spaces",
    name: "Remove Extra Spaces",
    category: "text",
    categoryName: "Text Tools",
    desc: "Clean up messy text by removing duplicate spaces, leading/trailing whitespace, and redundant empty lines.",
    popular: false,
    recent: true,
    keywords: ["remove extra spaces", "clean text", "trim spaces", "remove blank lines", "text formatter"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="12" cy="12" r="3"/></svg>`
  },
  {
    id: "text-to-speech",
    name: "Text to Speech",
    category: "text",
    categoryName: "Text Tools",
    desc: "Convert written text into natural spoken voice using your browser's speech synthesis engine.",
    popular: true,
    recent: false,
    keywords: ["text to speech", "tts", "read text aloud", "voice reader", "speech synthesizer"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`
  },

  // Developer Tools (4)
  {
    id: "json-formatter",
    name: "JSON Formatter & Validator",
    category: "developer",
    categoryName: "Developer Tools",
    desc: "Format, beautify, minify, and validate JSON code with syntax error detection and quick copy.",
    popular: true,
    recent: false,
    keywords: ["json formatter", "json beautifier", "json validator", "json parser", "minify json"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
  },
  {
    id: "html-formatter",
    name: "HTML Formatter",
    category: "developer",
    categoryName: "Developer Tools",
    desc: "Beautify messy HTML code with proper indentation or minify it for maximum webpage performance.",
    popular: false,
    recent: false,
    keywords: ["html formatter", "html beautifier", "format html", "minify html", "clean html code"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7 8 3 12 7 16"/><polyline points="17 8 21 12 17 16"/><line x1="14" y1="4" x2="10" y2="20"/></svg>`
  },
  {
    id: "base64-encoder",
    name: "Base64 Encoder / Decoder",
    category: "developer",
    categoryName: "Developer Tools",
    desc: "Encode string text into Base64 format or decode Base64 strings back to readable text securely.",
    popular: false,
    recent: true,
    keywords: ["base64 encoder", "base64 decoder", "encode base64", "decode base64", "binary to text"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
  },
  {
    id: "password-generator",
    name: "Password Generator",
    category: "developer",
    categoryName: "Developer Tools",
    desc: "Generate ultra-secure, cryptographically random passwords with custom length and character sets.",
    popular: true,
    recent: false,
    keywords: ["password generator", "strong password", "random password", "secure password maker"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/><circle cx="12" cy="16" r="1"/></svg>`
  },

  // Unit Converters (4)
  {
    id: "km-to-miles",
    name: "KM to Miles Converter",
    category: "converters",
    categoryName: "Unit Converters",
    desc: "Convert kilometers to miles, meters, feet, and nautical miles with exact conversion formulas.",
    popular: true,
    recent: false,
    keywords: ["km to miles", "kilometers to miles", "distance converter", "miles to km", "length converter"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 14 5-5-5-5"/><path d="M4 9h16"/><path d="m9 10-5 5 5 5"/><path d="M20 15H4"/></svg>`
  },
  {
    id: "kg-to-pounds",
    name: "KG to Pounds Converter",
    category: "converters",
    categoryName: "Unit Converters",
    desc: "Convert kilograms to pounds (lbs), grams, ounces, and stones with precision calculations.",
    popular: false,
    recent: false,
    keywords: ["kg to pounds", "kilograms to lbs", "weight converter", "lbs to kg", "mass conversion"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`
  },
  {
    id: "celsius-to-fahrenheit",
    name: "Celsius to Fahrenheit",
    category: "converters",
    categoryName: "Unit Converters",
    desc: "Convert temperatures between Celsius (°C), Fahrenheit (°F), and Kelvin (K) instantaneously.",
    popular: false,
    recent: true,
    keywords: ["celsius to fahrenheit", "temperature converter", "fahrenheit to celsius", "degrees conversion"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`
  },
  {
    id: "mb-to-gb",
    name: "MB to GB Converter",
    category: "converters",
    categoryName: "Unit Converters",
    desc: "Convert digital storage between Bytes, KB, MB, GB, and TB using binary (1024) or decimal standards.",
    popular: false,
    recent: false,
    keywords: ["mb to gb", "megabytes to gigabytes", "data converter", "storage converter", "gb to mb"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`
  },

  // Other Tools (4)
  {
    id: "stopwatch",
    name: "Stopwatch",
    category: "other",
    categoryName: "Other Tools",
    desc: "Precise online stopwatch with millisecond accuracy, start/pause controls, and lap split recording.",
    popular: true,
    recent: false,
    keywords: ["stopwatch", "online stopwatch", "lap timer", "chronometer", "time tracker"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3L2 6"/><path d="M22 6l-3-3"/><path d="M12 2v3"/></svg>`
  },
  {
    id: "timer",
    name: "Countdown Timer",
    category: "other",
    categoryName: "Other Tools",
    desc: "Set custom hours, minutes, and seconds countdown timers with visual progress bar and completion sound.",
    popular: false,
    recent: true,
    keywords: ["timer", "countdown timer", "online timer", "clock alarm", "study timer"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>`
  },
  {
    id: "calendar",
    name: "Interactive Calendar",
    category: "other",
    categoryName: "Other Tools",
    desc: "Browse any month and year, check day-of-week, jump to today, and view week numbers effortlessly.",
    popular: false,
    recent: false,
    keywords: ["calendar", "online calendar", "monthly calendar", "date picker", "day of week"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
  },
  {
    id: "random-number-generator",
    name: "Random Number Generator",
    category: "other",
    categoryName: "Other Tools",
    desc: "Generate truly random numbers within custom ranges, generate multiple picks, or roll dice.",
    popular: false,
    recent: true,
    keywords: ["random number generator", "rng", "pick random number", "dice roller", "lottery generator"],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="4"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="16" cy="8" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/></svg>`
  }
];

if (typeof window !== "undefined") {
  window.SMARTHUB_CATEGORIES = SMARTHUB_CATEGORIES;
  window.SMARTHUB_TOOLS = SMARTHUB_TOOLS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SMARTHUB_CATEGORIES, SMARTHUB_TOOLS };
}
