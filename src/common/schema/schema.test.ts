import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import { optionallyNullish, optionallyNullishToUndefined, optionallyUndefined } from './schema.js';

describe('Common Schema', () => {
  describe('optionallyNullishToUndefined', () => {
    test('should parse null string successfully', async () => {
      const Schema = type({
        foo: optionallyNullishToUndefined(type('string')),
      });

      const result = Schema.assert({
        foo: null,
      });

      if (result instanceof type.errors) {
        console.log(result.summary);
      }

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result.foo).toBeUndefined();
    });

    test('should parse undefined string successfully', async () => {
      const Schema = type({
        foo: optionallyNullishToUndefined(type('string')),
      });

      const result = Schema.assert({
        foo: undefined,
      });

      if (result instanceof type.errors) {
        console.log(result.summary);
      }

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result.foo).toBeUndefined();
    });

    test('should parse valid string successfully', async () => {
      const Schema = type({
        foo: optionallyNullishToUndefined(type('string')),
      });

      const result = Schema.assert({
        foo: 'valid-string',
      });

      if (result instanceof type.errors) {
        console.log(result.summary);
      }

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result.foo).toBe('valid-string');
    });
  });

  describe('optionallyNullish', () => {
    test('should handle null values', () => {
      const Schema = type({
        foo: optionallyNullish(type('string')),
      });

      const result = Schema.assert({
        foo: null,
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result.foo).toBeNull();
    });

    test('should handle undefined values', () => {
      const Schema = type({
        foo: optionallyNullish(type('string')),
      });

      const result = Schema.assert({
        foo: undefined,
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result.foo).toBeUndefined();
    });
  });

  describe('optionallyUndefined', () => {
    test('should handle undefined values', () => {
      const Schema = type({
        foo: optionallyUndefined(type('string')),
      });

      const result = Schema.assert({
        foo: undefined,
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result.foo).toBeUndefined();
    });

    test('should handle valid string values', () => {
      const Schema = type({
        foo: optionallyUndefined(type('string')),
      });

      const result = Schema.assert({
        foo: 'test',
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result.foo).toBe('test');
    });
  });
});
