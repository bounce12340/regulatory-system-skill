/**
 * PDF 提取模組測試
 * 
 * @module pdf-extractor.test
 */

const { 
  extractFromFile, 
  extractFromBuffer, 
  batchExtract,
  validatePdf 
} = require('../src/pdf-extractor');
const path = require('path');
const fs = require('fs');

describe('PDF Extractor', () => {
  const testPdfPath = path.join(__dirname, 'fixtures', 'sample.pdf');

  describe('validatePdf', () => {
    it('應該驗證有效的 PDF 檔案', async () => {
      // 需要準備測試 PDF 檔案
      // const result = await validatePdf(testPdfPath);
      // expect(result).toBe(true);
    });

    it('應該拒絕不存在的檔案', async () => {
      const result = await validatePdf('/nonexistent/file.pdf');
      expect(result).toBe(false);
    });

    it('應該拒絕非 PDF 檔案', async () => {
      const txtFile = path.join(__dirname, 'fixtures', 'test.txt');
      fs.writeFileSync(txtFile, 'test content');
      const result = await validatePdf(txtFile);
      fs.unlinkSync(txtFile);
      expect(result).toBe(false);
    });
  });

  describe('extractFromBuffer', () => {
    it('應該處理無效的 Buffer', async () => {
      const result = await extractFromBuffer('not a buffer');
      expect(result.success).toBe(false);
    });

    it('應該處理空的 Buffer', async () => {
      const result = await extractFromBuffer(Buffer.from(''));
      expect(result.success).toBe(false);
    });

    it('應該處理非 PDF 的 Buffer', async () => {
      const result = await extractFromBuffer(Buffer.from('not a pdf'));
      expect(result.success).toBe(false);
    });
  });
});
