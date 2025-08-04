import { type } from "arktype";

export const PaginationSchema = type({
	pageSize: type("string | number | null | undefined").optional(),
	nextToken: type("string | null | undefined").optional(),
});

export type Pagination = typeof PaginationSchema.inferOut;
