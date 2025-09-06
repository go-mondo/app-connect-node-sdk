import * as z from "zod/v4";

export const PaginationSchema = z.object({
	pageSize: z.union([z.string(), z.number()]).nullable().optional(),
	nextToken: z.string().nullable().optional(),
});

export type Pagination = z.output<typeof PaginationSchema>;
