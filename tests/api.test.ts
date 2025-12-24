/**
 * Comprehensive API Test Suite
 * Tests all API endpoints with various scenarios
 * 
 * Run with: npm test
 * Or for manual testing: npm run test:manual
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Test configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';
const DELAY_BETWEEN_TESTS = 1000; // Delay to avoid rate limiting during tests

// Helper function to delay between tests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to make API requests
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response;
}

describe('API Test Suite', () => {
  
  describe('1. Generate Theme API (/api/generate-theme)', () => {
    
    it('should generate a random theme', async () => {
      const response = await apiRequest('/generate-theme', {
        method: 'POST',
        body: JSON.stringify({ style: 'random' }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.theme).toBeDefined();
      expect(data.metadata).toBeDefined();
      expect(data.metadata.style).toBe('random');
      
      // Verify all color tokens exist
      const expectedTokens = [
        'primary', 'secondary', 'accent',
        'background', 'surface', 'text',
        'textSecondary', 'border'
      ];
      expectedTokens.forEach(token => {
        expect(data.theme[token]).toBeDefined();
        expect(typeof data.theme[token]).toBe('string');
      });
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should generate a yin-yang theme', async () => {
      const response = await apiRequest('/generate-theme', {
        method: 'POST',
        body: JSON.stringify({ style: 'yin-yang' }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.metadata.style).toBe('yin-yang');
      expect(data.metadata.philosophy).toContain('Balance of opposites');
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should generate a five-elements theme', async () => {
      const response = await apiRequest('/generate-theme', {
        method: 'POST',
        body: JSON.stringify({ style: 'five-elements' }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.metadata.style).toBe('five-elements');
      expect(data.metadata.philosophy).toContain('five fundamental elements');
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should generate a bagua theme', async () => {
      const response = await apiRequest('/generate-theme', {
        method: 'POST',
        body: JSON.stringify({ style: 'bagua' }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.metadata.style).toBe('bagua');
      expect(data.metadata.philosophy).toContain('Eight trigrams');
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should generate theme with base color', async () => {
      const baseColor = '#3B82F6';
      const response = await apiRequest('/generate-theme', {
        method: 'POST',
        body: JSON.stringify({ 
          style: 'random',
          baseColor 
        }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.theme).toBeDefined();
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should reject invalid style', async () => {
      const response = await apiRequest('/generate-theme', {
        method: 'POST',
        body: JSON.stringify({ style: 'invalid-style' }),
      });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      
      expect(data.success).toBe(false);
      expect(data.code).toBe('INVALID_STYLE');
      expect(data.error).toContain('Invalid style');
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should reject invalid base color', async () => {
      const response = await apiRequest('/generate-theme', {
        method: 'POST',
        body: JSON.stringify({ 
          style: 'random',
          baseColor: 'not-a-color' 
        }),
      });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      
      expect(data.success).toBe(false);
      expect(data.code).toBe('INVALID_BASE_COLOR');
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should reject GET method', async () => {
      const response = await apiRequest('/generate-theme', {
        method: 'GET',
      });
      
      expect(response.status).toBe(405);
      const data = await response.json();
      
      expect(data.success).toBe(false);
      expect(data.code).toBe('METHOD_NOT_ALLOWED');
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should handle OPTIONS request (CORS)', async () => {
      const response = await apiRequest('/generate-theme', {
        method: 'OPTIONS',
      });
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      await delay(DELAY_BETWEEN_TESTS);
    });
  });

  describe('2. Export Theme API (/api/export-theme)', () => {
    
    const sampleTheme = {
      primary: 'hsl(210, 75%, 55%)',
      secondary: 'hsl(45, 80%, 60%)',
      accent: 'hsl(330, 70%, 50%)',
      background: 'hsl(0, 0%, 95%)',
      surface: 'hsl(0, 0%, 98%)',
      text: 'hsl(0, 0%, 15%)',
      textSecondary: 'hsl(0, 0%, 45%)',
      border: 'hsl(0, 0%, 85%)'
    };

    it('should export theme as CSS', async () => {
      const response = await apiRequest('/export-theme', {
        method: 'POST',
        body: JSON.stringify({ 
          theme: sampleTheme,
          format: 'css'
        }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.format).toBe('css');
      expect(data.content).toContain(':root');
      expect(data.content).toContain('--taichi-primary');
      expect(data.filename).toBe('taichi-theme.css');
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should export theme as SCSS', async () => {
      const response = await apiRequest('/export-theme', {
        method: 'POST',
        body: JSON.stringify({ 
          theme: sampleTheme,
          format: 'scss'
        }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.format).toBe('scss');
      expect(data.content).toContain('$taichi-primary');
      expect(data.filename).toBe('taichi-theme.scss');
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should export theme as LESS', async () => {
      const response = await apiRequest('/export-theme', {
        method: 'POST',
        body: JSON.stringify({ 
          theme: sampleTheme,
          format: 'less'
        }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.format).toBe('less');
      expect(data.content).toContain('@taichi-primary');
      expect(data.filename).toBe('taichi-theme.less');
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should export theme as Tailwind config', async () => {
      const response = await apiRequest('/export-theme', {
        method: 'POST',
        body: JSON.stringify({ 
          theme: sampleTheme,
          format: 'tailwind'
        }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.format).toBe('tailwind');
      expect(data.content).toContain('module.exports');
      expect(data.content).toContain('theme:');
      expect(data.content).toContain('extend:');
      expect(data.filename).toBe('tailwind.config.js');
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should export theme as JSON', async () => {
      const response = await apiRequest('/export-theme', {
        method: 'POST',
        body: JSON.stringify({ 
          theme: sampleTheme,
          format: 'json'
        }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.format).toBe('json');
      
      // Verify content is valid JSON
      const parsedContent = JSON.parse(data.content);
      expect(parsedContent.primary).toBe(sampleTheme.primary);
      expect(data.filename).toBe('taichi-theme.json');
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should use custom prefix', async () => {
      const response = await apiRequest('/export-theme', {
        method: 'POST',
        body: JSON.stringify({ 
          theme: sampleTheme,
          format: 'css',
          options: {
            prefix: 'custom'
          }
        }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.content).toContain('--custom-primary');
      expect(data.filename).toBe('custom-theme.css');
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should exclude comments when requested', async () => {
      const response = await apiRequest('/export-theme', {
        method: 'POST',
        body: JSON.stringify({ 
          theme: sampleTheme,
          format: 'css',
          options: {
            includeComments: false
          }
        }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.content).not.toContain('/**');
      expect(data.content).not.toContain('Usage example');
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should reject invalid format', async () => {
      const response = await apiRequest('/export-theme', {
        method: 'POST',
        body: JSON.stringify({ 
          theme: sampleTheme,
          format: 'invalid-format'
        }),
      });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      
      expect(data.success).toBe(false);
      expect(data.code).toBe('INVALID_FORMAT');
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should reject missing theme', async () => {
      const response = await apiRequest('/export-theme', {
        method: 'POST',
        body: JSON.stringify({ 
          format: 'css'
        }),
      });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      
      expect(data.success).toBe(false);
      expect(data.code).toBe('INVALID_THEME');
      
      await delay(DELAY_BETWEEN_TESTS);
    });
  });

  describe('3. Theme History API (/api/theme-history)', () => {
    
    it('should return empty history with default pagination', async () => {
      const response = await apiRequest('/theme-history', {
        method: 'GET',
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.themes).toEqual([]);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.limit).toBe(10);
      expect(data.pagination.offset).toBe(0);
      expect(data.message).toContain('coming soon');
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should respect custom limit', async () => {
      const response = await apiRequest('/theme-history?limit=20', {
        method: 'GET',
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.pagination.limit).toBe(20);
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should respect custom offset', async () => {
      const response = await apiRequest('/theme-history?offset=5', {
        method: 'GET',
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.pagination.offset).toBe(5);
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should cap limit at 50', async () => {
      const response = await apiRequest('/theme-history?limit=100', {
        method: 'GET',
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.pagination.limit).toBe(50);
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should include rate limit headers', async () => {
      const response = await apiRequest('/theme-history', {
        method: 'GET',
      });
      
      expect(response.status).toBe(200);
      expect(response.headers.get('X-RateLimit-Limit')).toBe('20');
      expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined();
      expect(response.headers.get('X-RateLimit-Reset')).toBeDefined();
      
      await delay(DELAY_BETWEEN_TESTS);
    });

    it('should reject POST method', async () => {
      const response = await apiRequest('/theme-history', {
        method: 'POST',
      });
      
      expect(response.status).toBe(405);
      const data = await response.json();
      
      expect(data.success).toBe(false);
      expect(data.code).toBe('METHOD_NOT_ALLOWED');
      
      await delay(DELAY_BETWEEN_TESTS);
    });
  });

  describe('4. Rate Limiting', () => {
    
    it('should enforce rate limit on generate-theme', async () => {
      // Make 11 requests quickly (limit is 10/min)
      const requests = [];
      for (let i = 0; i < 11; i++) {
        requests.push(
          apiRequest('/generate-theme', {
            method: 'POST',
            body: JSON.stringify({ style: 'random' }),
          })
        );
      }
      
      const responses = await Promise.all(requests);
      const rateLimited = responses.filter(r => r.status === 429);
      
      // At least one should be rate limited
      expect(rateLimited.length).toBeGreaterThan(0);
      
      if (rateLimited.length > 0) {
        const data = await rateLimited[0].json();
        expect(data.success).toBe(false);
        expect(data.code).toBe('RATE_LIMIT_EXCEEDED');
        expect(data.retryAfter).toBeDefined();
      }
      
      // Wait for rate limit to reset
      await delay(60000);
    }, 70000); // Increase timeout for this test
  });

  describe('5. CORS Support', () => {
    
    it('should include CORS headers on all endpoints', async () => {
      const endpoints = [
        { path: '/generate-theme', method: 'POST', body: JSON.stringify({ style: 'random' }) },
        { path: '/export-theme', method: 'POST', body: JSON.stringify({ theme: {}, format: 'json' }) },
        { path: '/theme-history', method: 'GET' },
      ];
      
      for (const endpoint of endpoints) {
        const response = await apiRequest(endpoint.path, {
          method: endpoint.method,
          body: endpoint.body,
        });
        
        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
        expect(response.headers.get('Access-Control-Allow-Methods')).toBeDefined();
        
        await delay(DELAY_BETWEEN_TESTS);
      }
    });
  });

  describe('6. Integration Test - Complete Workflow', () => {
    
    it('should complete full workflow: generate -> export -> download', async () => {
      // Step 1: Generate a theme
      const generateResponse = await apiRequest('/generate-theme', {
        method: 'POST',
        body: JSON.stringify({ 
          style: 'yin-yang',
          baseColor: '#3B82F6'
        }),
      });
      
      expect(generateResponse.status).toBe(200);
      const { theme, metadata } = await generateResponse.json();
      
      expect(theme).toBeDefined();
      expect(metadata.style).toBe('yin-yang');
      
      await delay(DELAY_BETWEEN_TESTS);
      
      // Step 2: Export the theme as CSS
      const exportResponse = await apiRequest('/export-theme', {
        method: 'POST',
        body: JSON.stringify({ 
          theme,
          format: 'css',
          options: {
            prefix: 'my-app',
            includeComments: true
          }
        }),
      });
      
      expect(exportResponse.status).toBe(200);
      const { content, filename } = await exportResponse.json();
      
      expect(content).toContain('--my-app-primary');
      expect(filename).toBe('my-app-theme.css');
      
      // Step 3: Verify content is valid CSS
      expect(content).toContain(':root {');
      expect(content).toContain('}');
      
      console.log('✅ Complete workflow test passed!');
    });
  });
});

// Export for use in other test files
export { apiRequest, delay };
