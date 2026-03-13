/**
 * 法規文件管理系統
 * 入口點
 * 
 * @module index
 * @author Josh
 * @version 1.0.0
 */

const { logger, logStartup } = require('./src/logger');
const { setupUncaughtExceptionHandler, setupUnhandledRejectionHandler } = require('./src/error-handler');

// 設定全域錯誤處理
setupUncaughtExceptionHandler();
setupUnhandledRejectionHandler();

// 載入設定
let config;
try {
  config = require('./config/config.json');
} catch (error) {
  logger.error('無法載入設定檔', { error: error.message });
  process.exit(1);
}

/**
 * 系統初始化
 */
async function initialize() {
  logStartup(config);
  
  logger.info('系統初始化完成', {
    database: config.database?.path,
    logLevel: config.logging?.level,
    apiBaseUrl: config.api?.baseUrl
  });

  // TODO: 初始化資料庫連線
  // TODO: 初始化 API 伺服器
  // TODO: 初始化檔案監控
}

/**
 * 優雅關機
 */
async function shutdown(signal) {
  logger.info(`收到 ${signal} 訊號，開始優雅關機...`);
  
  // TODO: 關閉資料庫連線
  // TODO: 關閉 HTTP 伺服器
  // TODO: 完成進行中的任務
  
  logger.info('系統已安全關閉');
  process.exit(0);
}

// 監聽關機訊號
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// 啟動系統
if (require.main === module) {
  initialize().catch(error => {
    logger.error('系統啟動失敗', { error: error.message });
    process.exit(1);
  });
}

module.exports = { initialize, shutdown };
