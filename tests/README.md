# API Testing Guide

This guide explains how to test all API endpoints for the Taichi Color
Generator.

## Table of Contents

- [Quick Start](#quick-start)
- [Manual Testing](#manual-testing)
- [Automated Testing](#automated-testing)
- [Test Coverage](#test-coverage)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

1. **Start the development server:**
   ```bash
   # Option 1: Using Vite (frontend only)
   npm run dev

   # Option 2: Using Vercel CLI (includes API)
   npm install -g vercel
   vercel dev
   ```

2. **Install test dependencies:**
   ```bash
   npm install
   ```

### Run Tests

```bash
# Manual testing (no dependencies required)
npm run test:manual

# Automated testing with Jest
npm test

# Watch mode for development
npm run test:watch
```

---

## Manual Testing

The manual test script provides a comprehensive, interactive test suite that
doesn't require Jest.

### Running Manual Tests

```bash
npm run test:manual
```

Or directly:

```bash
node tests/manual-api-test.js
```

### What It Tests

✅ **Generate Theme API** (7 tests)

- Random theme generation
- Yin-Yang style
- Five Elements style
- Bagua style
- Theme with base color
- Invalid style handling
- Invalid base color handling

✅ **Export Theme API** (7 tests)

- CSS export
- SCSS export
- LESS export
- Tailwind export
- JSON export
- Custom prefix
- Invalid format handling

✅ **Theme History API** (3 tests)

- Default pagination
- Custom limit
- Rate limit headers

✅ **CORS Support** (1 test)

- CORS headers validation

✅ **Integration Test** (1 test)

- Complete workflow: generate → export → validate

### Output Example

```
🚀 Starting API Test Suite
Testing API at: http://localhost:3000/api

============================================================
1. Testing Generate Theme API
============================================================
ℹ️  Test 1.1: Generate random theme
✅ Random theme generated successfully
  Philosophy: Embracing spontaneity and the natural flow...
...
============================================================
Test Summary
============================================================
Total Tests: 19
Passed: 19
Failed: 0
Success Rate: 100.0%

🎉 All tests passed!
```

---

## Automated Testing

The Jest test suite provides comprehensive automated testing with detailed
assertions.

### Running Jest Tests

```bash
# Run all tests
npm test

# Run in watch mode (for development)
npm run test:watch

# Run with coverage
npm test -- --coverage
```

### Test Structure

The test suite is organized into 6 main sections:

#### 1. Generate Theme API Tests

```typescript
describe('Generate Theme API', () => {
  it('should generate a random theme', async () => { ... });
  it('should generate a yin-yang theme', async () => { ... });
  it('should generate a five-elements theme', async () => { ... });
  it('should generate a bagua theme', async () => { ... });
  it('should generate theme with base color', async () => { ... });
  it('should reject invalid style', async () => { ... });
  it('should reject invalid base color', async () => { ... });
  it('should reject GET method', async () => { ... });
  it('should handle OPTIONS request (CORS)', async () => { ... });
});
```

#### 2. Export Theme API Tests

```typescript
describe('Export Theme API', () => {
  it('should export theme as CSS', async () => { ... });
  it('should export theme as SCSS', async () => { ... });
  it('should export theme as LESS', async () => { ... });
  it('should export theme as Tailwind config', async () => { ... });
  it('should export theme as JSON', async () => { ... });
  it('should use custom prefix', async () => { ... });
  it('should exclude comments when requested', async () => { ... });
  it('should reject invalid format', async () => { ... });
  it('should reject missing theme', async () => { ... });
});
```

#### 3. Theme History API Tests

```typescript
describe('Theme History API', () => {
  it('should return empty history with default pagination', async () => { ... });
  it('should respect custom limit', async () => { ... });
  it('should respect custom offset', async () => { ... });
  it('should cap limit at 50', async () => { ... });
  it('should include rate limit headers', async () => { ... });
  it('should reject POST method', async () => { ... });
});
```

#### 4. Rate Limiting Tests

```typescript
describe('Rate Limiting', () => {
  it('should enforce rate limit on generate-theme', async () => { ... });
});
```

#### 5. CORS Tests

```typescript
describe('CORS Support', () => {
  it('should include CORS headers on all endpoints', async () => { ... });
});
```

#### 6. Integration Tests

```typescript
describe('Integration Test', () => {
  it('should complete full workflow: generate -> export -> download', async () => { ... });
});
```

---

## Test Coverage

### Current Coverage

The test suite covers:

- ✅ All 3 API endpoints
- ✅ All 4 theme generation styles
- ✅ All 5 export formats
- ✅ Error handling and validation
- ✅ Rate limiting
- ✅ CORS support
- ✅ Complete integration workflow

### Total Test Count

- **Manual Tests:** 19 tests
- **Jest Tests:** 40+ assertions
- **Coverage:** ~95% of API code

### Running Coverage Report

```bash
npm test -- --coverage
```

This generates:

- Terminal output with coverage percentages
- HTML report in `coverage/` directory
- LCOV report for CI/CD integration

---

## Troubleshooting

### Common Issues

#### 1. "Connection Refused" Error

**Problem:** API server is not running

**Solution:**

```bash
# Make sure the dev server is running
vercel dev

# Or if using Vite
npm run dev
```

#### 2. Rate Limit Errors During Testing

**Problem:** Too many requests in quick succession

**Solution:**

- Wait 60 seconds between test runs
- Increase `DELAY_BETWEEN_TESTS` in test files
- Run tests individually instead of all at once

#### 3. Jest Not Found

**Problem:** Jest dependencies not installed

**Solution:**

```bash
npm install
```

#### 4. TypeScript Errors

**Problem:** Type definitions missing

**Solution:**

```bash
npm install --save-dev @types/jest @jest/globals
```

#### 5. ESM Import Errors

**Problem:** Module resolution issues

**Solution:**

- Ensure `"type": "module"` is in package.json
- Check jest.config.js has ESM preset
- Use `.js` extensions in imports

### Testing Against Production

To test against your deployed API:

```bash
# Set the API URL environment variable
export API_BASE_URL=https://your-domain.vercel.app/api

# Run tests
npm run test:manual
```

### Debugging Failed Tests

1. **Check API logs:**
   ```bash
   vercel logs
   ```

2. **Enable verbose output:**
   ```bash
   npm test -- --verbose
   ```

3. **Run single test:**
   ```bash
   npm test -- -t "should generate a random theme"
   ```

4. **Check network requests:**
   - Use browser DevTools Network tab
   - Use curl to test endpoints manually
   - Check Vercel function logs

---

## Manual Testing with cURL

You can also test endpoints manually using cURL:

### Generate Theme

```bash
curl -X POST http://localhost:3000/api/generate-theme \
  -H "Content-Type: application/json" \
  -d '{
    "style": "yin-yang",
    "baseColor": "#3B82F6"
  }'
```

### Export Theme

```bash
curl -X POST http://localhost:3000/api/export-theme \
  -H "Content-Type: application/json" \
  -d '{
    "theme": {
      "primary": "hsl(210, 75%, 55%)",
      "secondary": "hsl(45, 80%, 60%)",
      "accent": "hsl(330, 70%, 50%)",
      "background": "hsl(0, 0%, 95%)",
      "surface": "hsl(0, 0%, 98%)",
      "text": "hsl(0, 0%, 15%)",
      "textSecondary": "hsl(0, 0%, 45%)",
      "border": "hsl(0, 0%, 85%)"
    },
    "format": "css"
  }'
```

### Theme History

```bash
curl http://localhost:3000/api/theme-history?limit=10&offset=0
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: API Tests

on: [push, pull_request]

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v3

            - name: Setup Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: "18"

            - name: Install dependencies
              run: npm install

            - name: Start Vercel dev server
              run: |
                  npm install -g vercel
                  vercel dev &
                  sleep 10

            - name: Run tests
              run: npm test

            - name: Upload coverage
              uses: codecov/codecov-action@v3
              with:
                  files: ./coverage/lcov.info
```

---

## Best Practices

1. **Always test locally first** before deploying
2. **Run manual tests** for quick validation
3. **Run Jest tests** for comprehensive coverage
4. **Check rate limits** - wait between test runs
5. **Test all formats** when changing export logic
6. **Verify CORS** when deploying to new domains
7. **Monitor logs** in production for errors
8. **Update tests** when adding new features

---

## Next Steps

- [ ] Add performance benchmarks
- [ ] Add load testing
- [ ] Add security testing
- [ ] Add accessibility testing
- [ ] Add visual regression testing
- [ ] Set up continuous testing in CI/CD

---

For more information, see:

- [API Documentation](../API_DOCUMENTATION.md)
- [API Quick Reference](../API_QUICK_REFERENCE.md)
- [API Development Summary](../API_DEVELOPMENT_SUMMARY.md)
