# Regulatory System Skill

A complete regulatory document management system built with OpenClaw and Claude Code.

## Features

- PDF text extraction (pdf-parse)
- Winston logging system
- Global error handling
- Configuration management
- Test suite included

## Installation

```bash
npm install
```

## Usage

```bash
npm run dev
```

## Project Structure

```
├── config/         # Configuration files
├── src/            # Source modules
├── tests/          # Test files
├── data/           # Data directory
└── README.md       # Documentation
```

## Modules

- **pdf-extractor.js**: Extract text from PDF files
- **logger.js**: Winston logging with daily rotation
- **error-handler.js**: Custom error classes and global handler

## License

MIT

