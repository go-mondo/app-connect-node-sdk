import { describe, expect, test } from 'vitest';
import { MockHelpers, TestDataFactory, TestUrls } from './test-utils.js';

describe('Test Utilities Integration', () => {
  test('should be able to import and use test utilities from common module', () => {
    // Test TestDataFactory
    const app = TestDataFactory.validApp();
    expect(app.handle).toBe('test-app');
    expect(app.name).toBe('Test App');

    // Test MockHelpers
    const mockResponse = MockHelpers.createMockResponse({ test: 'data' });
    expect(mockResponse.ok).toBe(true);
    expect(mockResponse.status).toBe(200);

    // Test TestUrls
    expect(TestUrls.base.toString()).toBe('https://api.test.example.com/');
    expect(TestUrls.apps.toString()).toBe('https://api.test.example.com/apps');
  });

  test('should be able to use test data factories for different schemas', () => {
    const app = TestDataFactory.validApp();
    const appObject = TestDataFactory.validAppObject();
    const connection = TestDataFactory.validConnection();
    const configuration = TestDataFactory.validConfiguration();

    expect(app).toHaveProperty('handle');
    expect(app).toHaveProperty('name');
    expect(app).toHaveProperty('avatar');
    expect(app).toHaveProperty('createdAt');
    expect(app).toHaveProperty('updatedAt');

    expect(appObject).toHaveProperty('handle');
    expect(appObject).toHaveProperty('name');
    expect(appObject).toHaveProperty('app');
    expect(appObject).toHaveProperty('url');

    expect(connection).toHaveProperty('app');
    expect(connection).toHaveProperty('object');
    expect(connection).toHaveProperty('id');

    expect(configuration).toHaveProperty('source');
    expect(configuration).toHaveProperty('target');
    expect(configuration).toHaveProperty('status');
  });
});