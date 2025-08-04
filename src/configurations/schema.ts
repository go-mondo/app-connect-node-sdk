import { type } from "arktype";
import {
	AppObjectHandleSchema,
	AppObjectReferenceSchema,
} from "src/objects/schema.js";
import { AppHandleSchema, AppReferenceSchema } from "../apps/schema.js";
import {
	RequiredDatePayloadSchema,
	RequiredDateSchema,
} from "../common/index.js";

export const JoinType = {
	ONE: "one",
	MANY: "many",
} as const;
export type AnyJoinType = (typeof JoinType)[keyof typeof JoinType];

const JoinSchema = type.enumerated(JoinType.ONE, JoinType.MANY);
const JoinPropertySchema = type({
	join: JoinSchema.default(JoinType.ONE),
});

export const ConfigurationStatus = {
	ENABLED: "enabled",
	DISABLED: "disabled",
} as const;

export type AnyConfigurationStatus =
	(typeof ConfigurationStatus)[keyof typeof ConfigurationStatus];

const StatusSchema = type.enumerated(
	ConfigurationStatus.ENABLED,
	ConfigurationStatus.DISABLED,
);
const StatusPropertySchema = type({
	status: StatusSchema.default(ConfigurationStatus.ENABLED),
});

const EntitySchema = JoinPropertySchema.and({
	app: AppReferenceSchema,
	object: AppObjectReferenceSchema,
});
export const SourceSchema = EntitySchema;
export type Source = typeof SourceSchema.inferOut;

export const TargetSchema = EntitySchema;
export type Target = typeof TargetSchema.inferOut;

const BaseSchema = StatusPropertySchema.and({
	source: SourceSchema,
	target: TargetSchema,
});

export const ConfigurationSchema = BaseSchema.and({
	updatedAt: RequiredDateSchema,
});
export type ConfigurationProperties = typeof ConfigurationSchema.inferIn;
export type Configuration = typeof ConfigurationSchema.inferOut;

export const ConfigurationPayloadSchema = BaseSchema.and({
	updatedAt: RequiredDatePayloadSchema,
});
export type ConfigurationPayload = typeof ConfigurationPayloadSchema.inferOut;

const EntityHandleSchema = type({
	app: AppHandleSchema,
	object: AppObjectHandleSchema,
});
const EntityReferenceHandleSchema = type({
	app: AppReferenceSchema.pick("handle"),
	object: AppObjectReferenceSchema.pick("handle"),
});

const EntityIdentifierSchema = EntityHandleSchema.or(
	EntityReferenceHandleSchema,
).pipe((e, ctx) => ({
	...e,
	app: {
		handle: typeof e.app === "string" ? e.app : e.app.handle,
	},
	object: {
		handle: typeof e.object === "string" ? e.object : e.object.handle,
	},
}));

const UpsertEntitySchema = EntityHandleSchema.or(EntityReferenceHandleSchema)
	.and(JoinPropertySchema)
	.pipe((e) => ({
		...e,
		app: {
			handle: typeof e.app === "string" ? e.app : e.app.handle,
		},
		object: {
			handle: typeof e.object === "string" ? e.object : e.object.handle,
		},
		join: e.join,
	}));

export const UpsertConfigurationPayloadSchema = StatusPropertySchema.and({
	source: UpsertEntitySchema,
	target: UpsertEntitySchema,
});
export type UpsertConfigurationInput =
	typeof UpsertConfigurationPayloadSchema.inferIn;
export type UpsertConfigurationPayload =
	typeof UpsertConfigurationPayloadSchema.inferOut;

export const ConfigurationIdentifiersSchema = type({
	source: EntityIdentifierSchema,
	target: EntityIdentifierSchema,
});
export type ConfigurationIdentifiersInput =
	typeof ConfigurationIdentifiersSchema.inferIn;
export type ConfigurationIdentifiers =
	typeof ConfigurationIdentifiersSchema.inferOut;
export type ConfigurationIdentifiersPayload = ConfigurationIdentifiers;
