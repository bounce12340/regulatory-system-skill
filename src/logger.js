/**
 * 日誌模組
 * 使用 Winston 函式庫提供結構化日誌記錄功能
 * 
 * @module logger
 * @author Josh
 * @version 1.0.0
 */

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// 確保日誌目錄存在
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

/**
 * 日誌格式設定
 * 包含時間戳、日誌層級、訊息和元數據
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

/**
 * 控制台輸出格式（開發環境使用，較易讀）
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

/**
 * 建立 Winston Logger 實例
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: {
    service: 'regulatory-system',
    pid: process.pid
  },
  format: logFormat,
  transports: [
    // 錯誤日誌（單獨檔案）
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '10m',
      maxFiles: '30d',
      zippedArchive: true
    }),
    
    // 所有日誌（合併檔案）
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      maxFiles: '30d',
      zippedArchive: true
    })
  ],
  // 未捕獲的例外處理
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      maxFiles: '30d'
    })
  ],
  // 未處理的 Promise 拒絕
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      maxFiles: '30d'
    })
  ]
});

/**
 * 開發環境：同時輸出到控制台
 */
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'debug'
  }));
}

/**
 * 建立子 Logger（用於特定模組）
 * @param {string} moduleName - 模組名稱
 * @returns {Object} - 子 Logger 實例
 */
function createChildLogger(moduleName) {
  return logger.child({ module: moduleName });
}

/**
 * 記錄 API 請求
 * @param {Object} req - Express 請求物件
 * @param {number} [duration] - 請求處理時間（毫秒）
 */
function logRequest(req, duration) {
  logger.info('API Request', {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.get?.('user-agent'),
    duration: duration ? `${duration}ms` : undefined
  });
}

/**
 * 記錄系統啟動資訊
 * @param {Object} config - 系統設定
 */
function logStartup(config) {
  logger.info('系統啟動', {
    version: config?.app?.version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
  });
}

/**
 * 記錄效能指標
 * @param {string} operation - 操作名稱
 * @param {number} duration - 執行時間（毫秒）
 * @param {Object} [metadata] - 額外元數據
 */
function logPerformance(operation, duration, metadata = {}) {
  logger.info('效能指標', {
    operation,
    duration: `${duration}ms`,
    ...metadata
  });
}

/**
 * 記錄業務事件
 * @param {string} event - 事件名稱
 * @param {Object} [data] - 事件數據
 */
function logBusinessEvent(event, data = {}) {
  logger.info('業務事件', {
    event,
    timestamp: new Date().toISOString(),
    ...data
  });
}

/**
 * 記錄安全相關事件
 * @param {string} type - 安全事件類型
 * @param {Object} [details] - 事件詳情
 */
function logSecurityEvent(type, details = {}) {
  logger.warn('安全事件', {
    type,
    timestamp: new Date().toISOString(),
    ...details
  });
}

/**
 * 關閉 Logger（優雅關機時使用）
 * @returns {Promise<void>}
 */
async function closeLogger() {
  return new Promise((resolve) => {
    logger.end();
    logger.on('finish', resolve);
    // 超時保護
    setTimeout(resolve, 1000);
  });
}

module.exports = {
  logger,
  createChildLogger,
  logRequest,
  logStartup,
  logPerformance,
  logBusinessEvent,
  logSecurityEvent,
  closeLogger
};
