/**
 * 錯誤處理模組測試
 * 
 * @module error-handler.test
 */

const {
  AppError,
  ValidationError,
  NotFoundError,
  createSuccessResponse,
  createErrorResponse
} = require('../src/error-handler');

describe('Error Handler', () => {
  describe('AppError', () => {
    it('應該建立具有正確屬性的錯誤', () => {
      const error = new AppError('測試錯誤', 400, 'TEST_ERROR', { detail: 'info' });
      
      expect(error.message).toBe('測試錯誤');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.details).toEqual({ detail: 'info' });
      expect(error.isOperational).toBe(true);
    });

    it('應該能轉換為 JSON', () => {
      const error = new AppError('測試錯誤', 400, 'TEST_ERROR');
      const json = error.toJSON();
      
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('TEST_ERROR');
      expect(json.error.message).toBe('測試錯誤');
    });
  });

  describe('ValidationError', () => {
    it('應該使用預設值建立', () => {
      const error = new ValidationError();
      
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('NotFoundError', () => {
    it('應該建立資源未找到錯誤', () => {
      const error = new NotFoundError('文件', 'doc-123');
      
      expect(error.statusCode).toBe(404);
      expect(error.message).toContain('文件');
      expect(error.message).toContain('doc-123');
    });
  });

  describe('Response Helpers', () => {
    it('應該建立成功響應', () => {
      const response = createSuccessResponse({ id: 1 }, '建立成功');
      
      expect(response.success).toBe(true);
      expect(response.message).toBe('建立成功');
      expect(response.data.id).toBe(1);
      expect(response.timestamp).toBeDefined();
    });

    it('應該建立錯誤響應', () => {
      const response = createErrorResponse('ERROR_CODE', '錯誤訊息', { field: 'value' });
      
      expect(response.success).toBe(false);
      expect(response.error.code).toBe('ERROR_CODE');
      expect(response.error.message).toBe('錯誤訊息');
      expect(response.error.details.field).toBe('value');
    });
  });
});
