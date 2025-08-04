import { z } from 'zod';
import { describe, expect, test } from 'vitest';
import { CollectionSchema, PaginationCollectionSchema } from './collection.js';

describe('Common Schema - Collection', () => {
  describe('CollectionSchema', () => {
    test('should accept valid collection with string items', () => {
      const StringCollectionSchema = CollectionSchema(z.string());
      const result = StringCollectionSchema.safeParse({
        items: ['item1', 'item2', 'item3'],
      });

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        items: ['item1', 'item2', 'item3'],
      });
    });

    test('should accept valid collection with number items', () => {
      const NumberCollectionSchema = CollectionSchema(z.number());
      const result = NumberCollectionSchema.safeParse({
        items: [1, 2, 3],
      });

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        items: [1, 2, 3],
      });
    });

    test('should accept empty collection', () => {
      const StringCollectionSchema = CollectionSchema(z.string());
      const result = StringCollectionSchema.safeParse({
        items: [],
      });

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        items: [],
      });
    });

    test('should reject invalid items type', () => {
      const StringCollectionSchema = CollectionSchema(z.string());
      const result = StringCollectionSchema.safeParse({
        items: 'not-an-array',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('PaginationCollectionSchema', () => {
    test('should accept valid paginated collection', () => {
      const StringPaginationCollectionSchema =
        PaginationCollectionSchema(z.string());
      const result = StringPaginationCollectionSchema.safeParse({
        items: ['item1', 'item2'],
        pagination: {
          pageSize: '10',
          nextToken: 'token123',
        },
      });

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        items: ['item1', 'item2'],
        pagination: {
          pageSize: '10',
          nextToken: 'token123',
        },
      });
    });

    test('should accept collection without pagination', () => {
      const StringPaginationCollectionSchema =
        PaginationCollectionSchema(z.string());
      const result = StringPaginationCollectionSchema.safeParse({
        items: ['item1', 'item2'],
      });

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        items: ['item1', 'item2'],
      });
    });

    test('should accept collection with empty pagination', () => {
      const StringPaginationCollectionSchema =
        PaginationCollectionSchema(z.string());
      const result = StringPaginationCollectionSchema.safeParse({
        items: ['item1'],
        pagination: {},
      });

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        items: ['item1'],
        pagination: {},
      });
    });

    test('should reject invalid pagination', () => {
      const StringPaginationCollectionSchema =
        PaginationCollectionSchema(z.string());
      const result = StringPaginationCollectionSchema.safeParse({
        items: ['item1'],
        pagination: {
          pageSize: true,
        },
      });

      expect(result.success).toBe(false);
    });
  });
});
