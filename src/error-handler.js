/**
 * 錯誤處理模組
 * 提供統一的錯誤處理機制和自訂錯誤類別
 * 
 * @module error-handler
 * @author Josh
 * @version 1.0.0
 */

const { logger } = require('./logger');

/**
 * 應用程式錯誤基類
 * 所有自訂錯誤都應繼承此類別
 */
class AppError extends Error {
  /**
   * @param {string} message - 錯誤訊息
   * @param {number} statusCode - HTTP 狀態碼
   * @param {string} [code] - 錯誤代碼
   * @param {Object} [details] - 額外錯誤詳情
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = {}) {
    super(message);
    
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true; // 標記為可預期的操作錯誤
    this.timestamp = new Date().toISOString();

    // 捕獲堆疊追蹤
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * 轉換為 JSON 格式（用於 API 回應）
   * @returns {Object}
   */
  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
        details: this.details,
        timestamp: this.timestamp
      }
    };
  }
}

/**
 * 驗證錯誤
 * 用於輸入資料驗證失敗
 */
class ValidationError extends AppError {
  constructor(message = '資料驗證失敗', details = {}) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

/**
 * 認證錯誤
 * 用於登入/權限相關錯誤
 */
class AuthenticationError extends AppError {
  constructor(message = '認證失敗', details = {}) {
    super(message, 401, 'AUTHENTICATION_ERROR', details);
  }
}

/**
 * 授權錯誤
 * 用於權限不足
 */
class AuthorizationError extends AppError {
  constructor(message = '權限不足', details = {}) {
    super(message, 403, 'AUTHORIZATION_ERROR', details);
  }
}

/**
 * 資源未找到錯誤
 */
class NotFoundError extends AppError {
  constructor(resource = '資源', identifier = '') {
    super(
      `${resource} 不存在${identifier ? `: ${identifier}` : ''}`,
      404,
      'NOT_FOUND',
      { resource, identifier }
    );
  }
}

/**
 * 重複資源錯誤
 */
class ConflictError extends AppError {
  constructor(message = '資源已存在', details = {}) {
    super(message, 409, 'CONFLICT', details);
  }
}

/**
 * 檔案處理錯誤
 */
class FileError extends AppError {
  constructor(message = '檔案處理失敗', details = {}) {
    super(message, 400, 'FILE_ERROR', details);
  }
}

/**
 * PDF 處理錯誤
 */
class PdfError extends AppError {
  constructor(message = 'PDF 處理失敗', details = {}) {
    super(message, 400, 'PDF_ERROR', details);
  }
}

/**
 * 資料庫錯誤
 */
class DatabaseError extends AppError {
  constructor(message = '資料庫操作失敗', details = {}) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

/**
 * 外部服務錯誤
 */
class ExternalServiceError extends AppError {
  constructor(service, message = '外部服務呼叫失敗', details = {}) {
    super(
      `[${service}] ${message}`,
      502,
      'EXTERNAL_SERVICE_ERROR',
      { service, ...details }
    );
  }
}

/**
 * 全域錯誤處理器（Express 中介軟體）
 * @param {Error} err - 錯誤物件
 * @param {Object} req - Express 請求物件
 * @param {Object} res - Express 回應物件
 * @param {Function} next - Express next 函數
 */
function globalErrorHandler(err, req, res, next) {
  // 預設錯誤資訊
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  let message = '伺服器內部錯誤';
  let details = {};

  // 處理自訂 AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.code;
    message = err.message;
    details = err.details;
  } 
  // 處理語法錯誤（JSON 解析失敗）
  else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    errorCode = 'SYNTAX_ERROR';
    message = '請求格式錯誤';
    details = { body: err.body };
  }
  // 處理其他錯誤
  else {
    // 在開發環境顯示詳細錯誤
    if (process.env.NODE_ENV === 'development') {
      details = {
        stack: err.stack,
        originalMessage: err.message
      };
    }
  }

  // 記錄錯誤
  const logLevel = statusCode >= 500 ? 'error' : 'warn';
  logger[logLevel]('錯誤處理', {
    code: errorCode,
    statusCode,
    message: err.message,
    url: req.originalUrl || req.url,
    method: req.method,
    ip: req.ip || req.connection?.remoteAddress,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // 發送回應
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      details: Object.keys(details).length > 0 ? details : undefined,
      timestamp: new Date().toISOString(),
      path: req.originalUrl || req.url
    }
  });
}

/**
 * 非同步錯誤包裝器
 * 用於自動捕獲 async 路由處理器中的錯誤
 * @param {Function} fn - 非同步函數
 * @returns {Function} - Express 中介軟體函數
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 未捕獲的例外處理
 */
function setupUncaughtExceptionHandler() {
  process.on('uncaughtException', (err) => {
    logger.error('未捕獲的例外', {
      error: err.message,
      stack: err.stack,
      type: err.name
    });

    // 給予時間記錄日誌後退出
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });
}

/**
 * 未處理的 Promise 拒絕處理
 */
function setupUnhandledRejectionHandler() {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('未處理的 Promise 拒絕', {
      reason: reason instanceof Error ? reason.message : reason,
      stack: reason instanceof Error ? reason.stack : undefined
    });

    // 可以選擇退出或繼續執行
    // process.exit(1);
  });
}

/**
 * 建立錯誤響應物件
 * @param {string} code - 錯誤代碼
 * @param {string} message - 錯誤訊息
 * @param {Object} [details] - 額外詳情
 * @returns {Object}
 */
function createErrorResponse(code, message, details = {}) {
  return {
    success: false,
    error: {
      code,
      message,
      details: Object.keys(details).length > 0 ? details : undefined,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * 建立成功響應物件
 * @param {*} data - 回應資料
 * @param {string} [message] - 成功訊息
 * @returns {Object}
 */
function createSuccessResponse(data, message = '操作成功') {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  // 錯誤類別
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  FileError,
  PdfError,
  DatabaseError,
  ExternalServiceError,
  
  // 處理函數
  globalErrorHandler,
  asyncHandler,
  setupUncaughtExceptionHandler,
  setupUnhandledRejectionHandler,
  
  // 響應工具
  createErrorResponse,
  createSuccessResponse
};
