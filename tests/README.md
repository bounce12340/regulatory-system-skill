# 測試檔案目錄

此目錄用於存放測試檔案：

- `*.test.js` - Jest 測試檔案
- `fixtures/` - 測試資料（PDF、JSON 等）
- `mocks/` - Mock 物件和函數

## 執行測試

```bash
# 執行所有測試
npm test

# 執行特定測試檔案
npm test pdf-extractor.test.js

# 監看模式
npm run test:watch
```
