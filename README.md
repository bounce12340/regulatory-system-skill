# Regulatory System Skill for OpenClaw 📋

<p align="center">
  <h2 align="center">Regulatory Document Management System</h2>
  <p align="center">法規文件管理系統 - 用於管理藥品、醫療器材、化妝品、食品等法規文件</p>
  <p align="center">
    <a href="#english">🇺🇸 English</a> • 
    <a href="#繁體中文">🇹🇼 繁體中文</a>
  </p>
</p>

---

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Jest-29.7+-red?style=flat-square&logo=jest" alt="Jest">
  <img src="https://img.shields.io/badge/License-MIT-brightgreen?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/OpenClaw-Skill-blue?style=flat-square" alt="OpenClaw">
</p>

---

<a name="english"></a>

## 🇺🇸 English

> A comprehensive regulatory document management system for OpenClaw, designed to handle pharmaceutical, medical device, cosmetic, and food regulatory documents with PDF text extraction, structured logging, and robust error handling.

### ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **PDF Text Extraction** | Extract text from regulatory PDF documents using pdf-parse |
| 📝 **Structured Logging** | Winston logging with daily rotation and multiple log levels |
| ⚠️ **Error Handling** | Custom error classes and global error handler for robust operations |
| 🧪 **Test Suite** | Comprehensive Jest test coverage |
| 📦 **Modular Design** | Clean separation of concerns with independent modules |
| 🔧 **Configuration** | Environment-based configuration management |

### 📋 Prerequisites

- **Node.js** 18+ [Download](https://nodejs.org/)
- **npm** or **yarn**
- **OpenClaw** installed

### 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/bounce12340/regulatory-system-skill.git
cd regulatory-system-skill

# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm run dev
```

### 📁 Project Structure

```
regulatory-system-skill/
├── 📂 config/              # Configuration files
│   ├── default.js          # Default configuration
│   └── production.js       # Production configuration
├── 📂 src/                 # Source modules
│   ├── 📄 pdf-extractor.js    # PDF text extraction module
│   ├── 📄 logger.js           # Winston logging system
│   ├── 📄 error-handler.js    # Error handling utilities
│   └── 📄 index.js            # Main entry point
├── 📂 tests/               # Test files
│   ├── pdf-extractor.test.js
│   ├── logger.test.js
│   └── error-handler.test.js
├── 📂 data/                # Data directory
├── 📂 logs/                # Log files (auto-generated)
│   ├── error-%DATE%.log
│   ├── combined-%DATE%.log
│   ├── exceptions-%DATE%.log
│   └── rejections-%DATE%.log
├── 📄 package.json         # Project dependencies
├── 📄 .gitignore           # Git ignore rules
└── 📄 README.md            # Documentation
```

### 📚 Usage

#### PDF Text Extraction

```javascript
const { extractFromFile, extractFromBuffer, batchExtract } = require('./src/pdf-extractor');

// Extract from file
const result = await extractFromFile('./regulatory-document.pdf');
if (result.success) {
  console.log('Text:', result.text);
  console.log('Pages:', result.pageCount);
  console.log('Metadata:', result.info);
}

// Extract from buffer
const fs = require('fs');
const buffer = fs.readFileSync('./document.pdf');
const result = await extractFromBuffer(buffer);

// Batch process multiple files
const files = ['./doc1.pdf', './doc2.pdf', './doc3.pdf'];
const results = await batchExtract(files, { concurrency: 3 });
```

#### Structured Logging

```javascript
const { logger, createChildLogger, logRequest, logPerformance } = require('./src/logger');

// Basic logging
logger.info('Operation started', { userId: '123', operation: 'pdf-extract' });
logger.error('Operation failed', { error: err.message });

// Create module-specific logger
const pdfLogger = createChildLogger('pdf-extractor');
pdfLogger.info('Processing PDF', { file: 'document.pdf' });

// Log API requests
logRequest(req, duration);  // duration in milliseconds

// Log performance metrics
logPerformance('pdf-extraction', 1250, { pages: 10 });
```

#### Error Handling

```javascript
const { 
  ValidationError, 
  FileError, 
  PdfError,
  globalErrorHandler,
  asyncHandler 
} = require('./src/error-handler');

// Throw custom errors
throw new ValidationError('Invalid file format', { field: 'fileType' });
throw new FileError('File not found', { path: './missing.pdf' });
throw new PdfError('PDF parsing failed', { page: 5 });

// Express error handling middleware
app.use(globalErrorHandler);

// Wrap async routes
app.get('/extract', asyncHandler(async (req, res) => {
  const result = await extractFromFile(req.body.filePath);
  res.json(result);
}));
```

### 🎛️ Configuration

Create a `.env` file in the project root:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Logging
LOG_LEVEL=info

# PDF Settings
MAX_PDF_SIZE=52428800  # 50MB in bytes
MAX_PDF_PAGES=1000
```

### 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test pdf-extractor.test.js

# Run in watch mode
npm run test:watch
```

### 📊 Log Files

Logs are automatically rotated daily and stored in the `logs/` directory:

| Log File | Description |
|----------|-------------|
| `error-%DATE%.log` | Error-level logs only |
| `combined-%DATE%.log` | All log levels |
| `exceptions-%DATE%.log` | Uncaught exceptions |
| `rejections-%DATE%.log` | Unhandled promise rejections |

Old logs are automatically compressed and deleted after 30 days.

### 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `PDF extraction fails` | Check file exists and is valid PDF format |
| `Out of memory` | Reduce `concurrency` in batch operations |
| `Logs not writing` | Ensure `logs/` directory exists and is writable |
| `Tests failing` | Run `npm install` to ensure dependencies are installed |
| `Port already in use` | Change `PORT` in environment variables |

### 📄 License

MIT License — See [LICENSE](LICENSE) for details.

---

<a name="繁體中文"></a>

## 🇹🇼 繁體中文

> 完整的法規文件管理系統，專為 OpenClaw 設計，用於處理藥品、醫療器材、化妝品、食品等法規文件，具備 PDF 文字提取、結構化日誌記錄和強健的錯誤處理機制。

### ✨ 特色

| 特色 | 說明 |
|------|------|
| 📄 **PDF 文字提取** | 使用 pdf-parse 從法規 PDF 文件中提取文字 |
| 📝 **結構化日誌** | Winston 日誌系統，支援每日輪替和多種日誌層級 |
| ⚠️ **錯誤處理** | 自訂錯誤類別和全域錯誤處理器，確保操作穩定 |
| 🧪 **測試套件** | 完整的 Jest 測試覆蓋 |
| 📦 **模組化設計** | 關注點分離，獨立模組設計 |
| 🔧 **設定管理** | 基於環境的設定管理 |

### 📋 系統需求

- **Node.js** 18+ [下載](https://nodejs.org/)
- **npm** 或 **yarn**
- **OpenClaw** 已安裝

### 🚀 安裝

```bash
# 複製此專案
git clone https://github.com/bounce12340/regulatory-system-skill.git
cd regulatory-system-skill

# 安裝依賴
npm install

# 執行測試
npm test

# 啟動開發伺服器
npm run dev
```

### 📁 專案結構

```
regulatory-system-skill/
├── 📂 config/              # 設定檔案
│   ├── default.js          # 預設設定
│   └── production.js       # 生產環境設定
├── 📂 src/                 # 原始碼模組
│   ├── 📄 pdf-extractor.js    # PDF 文字提取模組
│   ├── 📄 logger.js           # Winston 日誌系統
│   ├── 📄 error-handler.js    # 錯誤處理工具
│   └── 📄 index.js            # 主要入口點
├── 📂 tests/               # 測試檔案
│   ├── pdf-extractor.test.js
│   ├── logger.test.js
│   └── error-handler.test.js
├── 📂 data/                # 資料目錄
├── 📂 logs/                # 日誌檔案（自動產生）
│   ├── error-%DATE%.log
│   ├── combined-%DATE%.log
│   ├── exceptions-%DATE%.log
│   └── rejections-%DATE%.log
├── 📄 package.json         # 專案依賴
├── 📄 .gitignore           # Git 忽略規則
└── 📄 README.md            # 文件
```

### 📚 使用方式

#### PDF 文字提取

```javascript
const { extractFromFile, extractFromBuffer, batchExtract } = require('./src/pdf-extractor');

// 從檔案提取
const result = await extractFromFile('./regulatory-document.pdf');
if (result.success) {
  console.log('文字:', result.text);
  console.log('頁數:', result.pageCount);
  console.log('元資料:', result.info);
}

// 從 Buffer 提取
const fs = require('fs');
const buffer = fs.readFileSync('./document.pdf');
const result = await extractFromBuffer(buffer);

// 批次處理多個檔案
const files = ['./doc1.pdf', './doc2.pdf', './doc3.pdf'];
const results = await batchExtract(files, { concurrency: 3 });
```

#### 結構化日誌

```javascript
const { logger, createChildLogger, logRequest, logPerformance } = require('./src/logger');

// 基本日誌
logger.info('操作開始', { userId: '123', operation: 'pdf-extract' });
logger.error('操作失敗', { error: err.message });

// 建立模組專用日誌
const pdfLogger = createChildLogger('pdf-extractor');
pdfLogger.info('處理 PDF', { file: 'document.pdf' });

// 記錄 API 請求
logRequest(req, duration);  // duration 為毫秒

// 記錄效能指標
logPerformance('pdf-extraction', 1250, { pages: 10 });
```

#### 錯誤處理

```javascript
const { 
  ValidationError, 
  FileError, 
  PdfError,
  globalErrorHandler,
  asyncHandler 
} = require('./src/error-handler');

// 拋出自訂錯誤
throw new ValidationError('無效的檔案格式', { field: 'fileType' });
throw new FileError('找不到檔案', { path: './missing.pdf' });
throw new PdfError('PDF 解析失敗', { page: 5 });

// Express 錯誤處理中介軟體
app.use(globalErrorHandler);

// 包裝非同步路由
app.get('/extract', asyncHandler(async (req, res) => {
  const result = await extractFromFile(req.body.filePath);
  res.json(result);
}));
```

### 🎛️ 設定

在專案根目錄建立 `.env` 檔案：

```env
# 伺服器設定
NODE_ENV=development
PORT=3000

# 日誌設定
LOG_LEVEL=info

# PDF 設定
MAX_PDF_SIZE=52428800  # 50MB（位元組）
MAX_PDF_PAGES=1000
```

### 🧪 測試

```bash
# 執行所有測試
npm test

# 執行並產生覆蓋率報告
npm run test:coverage

# 執行特定測試檔案
npm test pdf-extractor.test.js

# 監看模式執行
npm run test:watch
```

### 📊 日誌檔案

日誌會自動每日輪替，儲存在 `logs/` 目錄：

| 日誌檔案 | 說明 |
|----------|------|
| `error-%DATE%.log` | 僅限 Error 層級的日誌 |
| `combined-%DATE%.log` | 所有層級的日誌 |
| `exceptions-%DATE%.log` | 未捕獲的例外 |
| `rejections-%DATE%.log` | 未處理的 Promise 拒絕 |

舊的日誌會在 30 天後自動壓縮和刪除。

### 🐛 疑難排解

| 問題 | 解決方案 |
|------|----------|
| `PDF 提取失敗` | 檢查檔案是否存在且為有效的 PDF 格式 |
| `記憶體不足` | 在批次操作中降低 `concurrency` 設定 |
| `日誌無法寫入` | 確保 `logs/` 目錄存在且可寫入 |
| `測試失敗` | 執行 `npm install` 確保依賴已安裝 |
| `連接埠已被使用` | 在環境變數中變更 `PORT` 設定 |

### 📄 授權

MIT 授權 — 詳見 [LICENSE](LICENSE)

---

## 🙏 Acknowledgments / 致謝

This skill is designed to work with [OpenClaw](https://github.com/openclaw/openclaw), the open-source AI agent framework.

本 Skill 設計用於 [OpenClaw](https://github.com/openclaw/openclaw)，開源 AI Agent 框架。

---

<p align="center">
  Made with ❤️ for regulatory professionals
</p>
