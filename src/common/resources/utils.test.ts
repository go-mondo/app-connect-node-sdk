import { type } from 'arktype';
import { describe, expect, test, vi } from 'vitest';
import { HttpError } from '../errors/http.js';
import { ValidationError } from '../errors/validation.js';
import {
  addPaginationToURL,
  defaultMutationRequestHeaders,
  defaultRequestHeaders,
  jsonBody,
  parseEgressSchema,
  parseIngressSchema,
  responseToHttpError,
  toHttpError,
} from './utils.js';

describe('Common Resources - Utils', () => {
  describe('parseEgressSchema', () => {
    test('should return data when schema validation passes', () => {
      const validData = { name: 'test', value: 123 };
      const result = parseEgressSchema(validData);
      expect(result).toBe(validData);
    });

    test('should throw error when schema validation fails', () => {
      const testSchema = type('string');
      const mockError = testSchema(123);

      expect(() => parseEgressSchema(mockError)).toThrow();
    });
  });

  describe('parseIngressSchema', () => {
    test('should return data when schema validation passes', () => {
      const validData = { name: 'test', value: 123 };
      const result = parseIngressSchema(validData);
      expect(result).toBe(validData);
    });

    test('should return data as-is when schema validation fails (ingress is more lenient)', () => {
      const testSchema = type('string');
      const mockError = testSchema(123);

      const result = parseIngressSchema(mockError);
      expect(result).toBe(mockError);
    });
  });

  describe('defaultRequestHeaders', () => {
    test('should return headers with accept application/json', () => {
      const headers = defaultRequestHeaders();
      expect(headers.get('accept')).toBe('application/json');
    });
  });

  describe('defaultMutationRequestHeaders', () => {
    test('should return headers with accept and content-type', () => {
      const headers = defaultMutationRequestHeaders();
      expect(headers.get('accept')).toBe('application/json');
      expect(headers.get('content-type')).toBe('application/json');
    });
  });

  describe('jsonBody', () => {
    test('should return parsed JSON from request', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({ data: 'test' }),
      } as unknown as Request;

      const result = await jsonBody(mockRequest);
      expect(result).toEqual({ data: 'test' });
    });

    test('should return undefined when JSON parsing fails', async () => {
      const mockRequest = {
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as Request;

      const result = await jsonBody(mockRequest);
      expect(result).toBeUndefined();
    });
  });

  describe('addPaginationToURL', () => {
    test('should add pagination params to URL', () => {
      const url = new URL('https://example.com/api');
      const pagination = { nextToken: 'token123', pageSize: '10' };

      const result = addPaginationToURL(url, pagination);

      expect(result.searchParams.get('pagination[nextToken]')).toBe('token123');
      expect(result.searchParams.get('pagination[pageSize]')).toBe('10');
    });

    test('should handle pageSize as number', () => {
      const url = new URL('https://example.com/api');
      const pagination = { pageSize: 25 };

      const result = addPaginationToURL(url, pagination);

      expect(result.searchParams.get('pagination[pageSize]')).toBe('25');
    });

    test('should not add params when pagination is undefined', () => {
      const url = new URL('https://example.com/api');

      const result = addPaginationToURL(url, undefined);

      expect(result.searchParams.has('pagination[nextToken]')).toBe(false);
      expect(result.searchParams.has('pagination[pageSize]')).toBe(false);
    });

    test('should not add params when values are null', () => {
      const url = new URL('https://example.com/api');
      const pagination = { nextToken: null, pageSize: null };

      const result = addPaginationToURL(url, pagination);

      expect(result.searchParams.has('pagination[nextToken]')).toBe(false);
      expect(result.searchParams.has('pagination[pageSize]')).toBe(false);
    });
  });

  describe('responseToHttpError', () => {
    test('should handle authorization errors', async () => {
      const mockResponse = {
        status: 401,
        json: vi.fn().mockResolvedValue({
          error: 'unauthorized',
          error_description: 'Invalid token',
        }),
      } as unknown as Response;

      const error = await responseToHttpError(mockResponse);

      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('Invalid token');
      expect(error.statusCode).toBe(401);
      expect(error.type).toBe('unauthorized');
    });

    test('should handle 403 authorization errors', async () => {
      const mockResponse = {
        status: 403,
        json: vi.fn().mockResolvedValue({
          error: 'forbidden',
          error_description: 'Access denied',
        }),
      } as unknown as Response;

      const error = await responseToHttpError(mockResponse);

      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('Access denied');
      expect(error.statusCode).toBe(403);
      expect(error.type).toBe('forbidden');
    });

    test('should handle authorization errors with default message', async () => {
      const mockResponse = {
        status: 401,
        json: vi.fn().mockResolvedValue({}),
      } as unknown as Response;

      const error = await responseToHttpError(mockResponse);

      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('Unauthorized');
      expect(error.statusCode).toBe(401);
      expect(error.type).toBe('authorization');
    });

    test('should handle validation errors with fields', async () => {
      const mockResponse = {
        status: 400,
        json: vi.fn().mockResolvedValue({
          error: 'validation_error',
          error_description: 'Validation failed',
          fields: { email: 'Invalid email format' },
        }),
      } as unknown as Response;

      const error = await responseToHttpError(mockResponse);

      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Validation failed');
      expect((error as ValidationError).fields).toEqual({
        email: 'Invalid email format',
      });
    });

    test('should handle generic HTTP errors', async () => {
      const mockResponse = {
        status: 500,
        json: vi.fn().mockResolvedValue({
          error: 'internal_error',
          error_description: 'Something went wrong',
        }),
      } as unknown as Response;

      const error = await responseToHttpError(mockResponse);

      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('Something went wrong');
      expect(error.statusCode).toBe(500);
    });
  });

  describe('toHttpError', () => {
    test('should return HttpError as-is', () => {
      const httpError = new HttpError('Test error');
      const result = toHttpError(httpError);
      expect(result).toBe(httpError);
    });

    test('should convert Error to HttpError', () => {
      const error = new Error('Test message');
      const result = toHttpError(error);

      expect(result).toBeInstanceOf(HttpError);
      expect(result.message).toBe('Test message');
    });

    test('should handle objects with message property', () => {
      const error = { message: 'Custom error' };
      const result = toHttpError(error);

      expect(result).toBeInstanceOf(HttpError);
      expect(result.message).toBe('Custom error');
    });

    test('should handle unknown error types', () => {
      const result = toHttpError('string error');

      expect(result).toBeInstanceOf(HttpError);
      expect(result.message).toBe(
        'An unknown error occurred. Please try the operation again.'
      );
    });
  });
});
