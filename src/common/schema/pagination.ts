import { z } from "zod";

export const PaginationSchema = z.object({
	pageSize: z.union([z.string(), z.number()]).nullable().optional(),
	nextToken: z.string().nullable().optional(),
});

export type Pagination = z.output<typeof PaginationSchema>;
