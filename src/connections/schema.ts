import * as z from "zod/v4";
import { AppHandleSchema, AppSchema } from "../apps/schema.js";
import { RequiredDateSchema } from "../common/index.js";
import { AppObjectHandleSchema, AppObjectSchema } from "../objects/schema.js";

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

const ReferenceEntitySchema = z.object({
	id: z.string(),
	app: AppSchema.pick({ name: true, handle: true }),
	object: AppObjectSchema.pick({ name: true, handle: true }),
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

export const ReferenceSourceSchema = ReferenceEntitySchema;
export type ReferenceSource = z.output<typeof ReferenceSourceSchema>;

export const ReferenceTargetSchema = ReferenceEntitySchema;
export type ReferenceTarget = z.output<typeof ReferenceTargetSchema>;

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
