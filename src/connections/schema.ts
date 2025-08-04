import { z } from "zod";
import { AppObjectHandleSchema, AppObjectSchema } from "src/objects/schema.js";
import { AppHandleSchema, AppSchema } from "../apps/schema.js";
import { RequiredDateSchema } from "../common/index.js";

const BaseEntitySchema = z.object({
	app: AppHandleSchema,
	object: AppObjectHandleSchema,
	id: z.string(),
});

export const EntitySchema = z.object({
	id: z.string(),
	app: AppSchema.pick({ handle: true }),
	object: AppObjectSchema.pick({ handle: true }),
});

export const ExpandedEntitySchema = z.object({
	id: z.string(),
	app: AppSchema.pick({ name: true, handle: true, avatar: true }),
	object: AppObjectSchema.pick({ name: true, handle: true, url: true }),
});

export const SourceSchema = BaseEntitySchema;
export type Source = z.output<typeof SourceSchema>;

export const TargetSchema = BaseEntitySchema;
export type Target = z.output<typeof TargetSchema>;

export const ConnectionPayloadSchema = ExpandedEntitySchema.extend({
	updatedAt: RequiredDateSchema,
	inferred: z.boolean().optional(),
});
export type ConnectionInput = z.input<typeof ConnectionPayloadSchema>;
export type ConnectionPayload = z.output<typeof ConnectionPayloadSchema>;

export const UpsertConnectionPayloadSchema = z
	.union([TargetSchema, EntitySchema])
	.transform((v) => ({
		...v,
		object: {
			handle: typeof v.object === "string" ? v.object : v.object.handle,
		},
		app: {
			handle: typeof v.app === "string" ? v.app : v.app.handle,
		},
	}));
export type UpsertConnectionInput = z.input<
	typeof UpsertConnectionPayloadSchema
>;
export type UpsertConnectionPayload = z.output<
	typeof UpsertConnectionPayloadSchema
>;
