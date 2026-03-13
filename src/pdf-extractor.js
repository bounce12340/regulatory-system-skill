/**
 * PDF 文字提取模組
 * 使用 pdf-parse 函式庫讀取 PDF 檔案並提取文字內容
 * 
 * @module pdf-extractor
 * @author Josh
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const logger = require('./logger');

/**
 * PDF 提取結果物件
 * @typedef {Object} PdfExtractResult
 * @property {boolean} success - 是否成功提取
 * @property {string} [text] - 提取的文字內容
 * @property {number} [pageCount] - PDF 頁數
 * @property {Object} [info] - PDF 元數據
 * @property {string} [error] - 錯誤訊息（如果失敗）
 */

/**
 * 驗證 PDF 檔案
 * @param {string} filePath - PDF 檔案路徑
 * @returns {Promise<boolean>} - 是否為有效的 PDF
 */
async function validatePdf(filePath) {
  try {
    // 檢查檔案是否存在
    if (!fs.existsSync(filePath)) {
      throw new Error(`檔案不存在: ${filePath}`);
    }

    // 檢查檔案大小
    const stats = fs.statSync(filePath);
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (stats.size > maxSize) {
      throw new Error(`檔案大小超過限制 (${stats.size} bytes > ${maxSize} bytes)`);
    }

    // 檢查檔案副檔名
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.pdf') {
      throw new Error(`不支援的檔案格式: ${ext}`);
    }

    return true;
  } catch (error) {
    logger.error(`PDF 驗證失敗: ${error.message}`, { filePath });
    return false;
  }
}

/**
 * 從檔案路徑提取 PDF 文字
 * @param {string} filePath - PDF 檔案路徑
 * @param {Object} [options={}] - 提取選項
 * @param {number} [options.maxPages=1000] - 最大頁數限制
 * @returns {Promise<PdfExtractResult>} - 提取結果
 */
async function extractFromFile(filePath, options = {}) {
  const startTime = Date.now();
  
  try {
    logger.info(`開始提取 PDF: ${filePath}`);

    // 驗證檔案
    const isValid = await validatePdf(filePath);
    if (!isValid) {
      return {
        success: false,
        error: 'PDF 檔案驗證失敗'
      };
    }

    // 讀取檔案內容
    const dataBuffer = fs.readFileSync(filePath);
    
    // 設定提取選項
    const parseOptions = {
      max: options.maxPages || 1000,
      // 自訂頁面渲染函數（可選）
      pagerender: function(pageData) {
        return pageData.getTextContent()
          .then(function(textContent) {
            let lastY, text = '';
            for (let item of textContent.items) {
              if (lastY !== item.transform[5] && text) {
                text += '\n';
              }
              text += item.str;
              lastY = item.transform[5];
            }
            return text;
          });
      }
    };

    // 解析 PDF
    const pdfData = await pdfParse(dataBuffer, parseOptions);

    const duration = Date.now() - startTime;
    logger.info(`PDF 提取完成`, {
      filePath,
      pageCount: pdfData.numpages,
      duration: `${duration}ms`
    });

    return {
      success: true,
      text: pdfData.text,
      pageCount: pdfData.numpages,
      info: {
        title: pdfData.info?.Title || null,
        author: pdfData.info?.Author || null,
        subject: pdfData.info?.Subject || null,
        creator: pdfData.info?.Creator || null,
        producer: pdfData.info?.Producer || null,
        creationDate: pdfData.info?.CreationDate || null,
        modificationDate: pdfData.info?.ModDate || null
      }
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`PDF 提取失敗`, {
      filePath,
      error: error.message,
      duration: `${duration}ms`
    });

    return {
      success: false,
      error: `PDF 提取失敗: ${error.message}`
    };
  }
}

/**
 * 從 Buffer 提取 PDF 文字
 * @param {Buffer} buffer - PDF 檔案 Buffer
 * @param {Object} [options={}] - 提取選項
 * @returns {Promise<PdfExtractResult>} - 提取結果
 */
async function extractFromBuffer(buffer, options = {}) {
  const startTime = Date.now();
  
  try {
    logger.info(`開始從 Buffer 提取 PDF`);

    // 驗證 Buffer
    if (!Buffer.isBuffer(buffer)) {
      throw new Error('輸入必須是 Buffer 物件');
    }

    if (buffer.length === 0) {
      throw new Error('Buffer 為空');
    }

    // 檢查 PDF 檔頭標記 (%PDF)
    const pdfHeader = buffer.slice(0, 4).toString('ascii');
    if (pdfHeader !== '%PDF') {
      throw new Error('無效的 PDF 格式');
    }

    // 解析 PDF
    const parseOptions = {
      max: options.maxPages || 1000
    };

    const pdfData = await pdfParse(buffer, parseOptions);

    const duration = Date.now() - startTime;
    logger.info(`Buffer PDF 提取完成`, {
      pageCount: pdfData.numpages,
      duration: `${duration}ms`
    });

    return {
      success: true,
      text: pdfData.text,
      pageCount: pdfData.numpages,
      info: pdfData.info || {}
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Buffer PDF 提取失敗`, {
      error: error.message,
      duration: `${duration}ms`
    });

    return {
      success: false,
      error: `PDF 提取失敗: ${error.message}`
    };
  }
}

/**
 * 提取特定頁面的文字
 * @param {string} filePath - PDF 檔案路徑
 * @param {number[]} pageNumbers - 頁碼陣列（從 1 開始）
 * @returns {Promise<PdfExtractResult>} - 提取結果
 */
async function extractPages(filePath, pageNumbers) {
  try {
    logger.info(`提取特定頁面`, { filePath, pages: pageNumbers });

    const result = await extractFromFile(filePath);
    
    if (!result.success) {
      return result;
    }

    // 這裡需要更複雜的邏輯來提取特定頁面
    // pdf-parse 本身不支援單頁提取，這裡是預留介面
    logger.warn('單頁提取功能需要額外實作');

    return {
      success: true,
      text: result.text,
      pageCount: result.pageCount,
      info: result.info,
      note: '目前提取全部內容，單頁篩選需額外實作'
    };

  } catch (error) {
    logger.error(`提取特定頁面失敗`, {
      filePath,
      pages: pageNumbers,
      error: error.message
    });

    return {
      success: false,
      error: `提取特定頁面失敗: ${error.message}`
    };
  }
}

/**
 * 批次處理多個 PDF 檔案
 * @param {string[]} filePaths - PDF 檔案路徑陣列
 * @param {Object} [options={}] - 提取選項
 * @returns {Promise<Object[]>} - 批次處理結果
 */
async function batchExtract(filePaths, options = {}) {
  logger.info(`開始批次提取`, { count: filePaths.length });

  const results = [];
  const concurrency = options.concurrency || 3;

  // 使用批次處理避免記憶體問題
  for (let i = 0; i < filePaths.length; i += concurrency) {
    const batch = filePaths.slice(i, i + concurrency);
    const batchPromises = batch.map(filePath => extractFromFile(filePath, options));
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    logger.info(`批次處理進度`, {
      completed: Math.min(i + concurrency, filePaths.length),
      total: filePaths.length
    });
  }

  const successCount = results.filter(r => r.success).length;
  logger.info(`批次提取完成`, {
    total: filePaths.length,
    success: successCount,
    failed: filePaths.length - successCount
  });

  return results;
}

module.exports = {
  extractFromFile,
  extractFromBuffer,
  extractPages,
  batchExtract,
  validatePdf
};
