import type { MondoAppConnect } from "../common/init.js";
import {
	deleteItemWithAuthorization,
	getItemWithAuthorization,
	putItemWithAuthorization,
} from "../common/resources/operations.js";
import {
	addPaginationToURL,
	parseEgressSchema,
} from "../common/resources/utils.js";
import {
	type PaginationCollection,
	PaginationCollectionSchema,
} from "../common/schema/collection.js";
import type { Pagination } from "../common/schema/pagination.js";
import {
	type ConnectionPayload,
	ConnectionPayloadSchema,
	type Source,
	type UpsertConnectionInput,
	UpsertConnectionPayloadSchema,
} from "./schema.js";

export const PATH = "/v1/connections";

export class ConnectionResources {
	public constructor(private readonly instance: MondoAppConnect) {}

	static buildPath(source: Source): string {
		return [PATH, source.app, source.object, source.id].join("/");
	}

	public listItemsBySource(
		source: Source,
		pagination?: Pagination,
	): Promise<PaginationCollection<ConnectionPayload>> {
		return listConnectionsBySource(this.instance, source, pagination);
	}

	public associateItem(
		source: Source,
		item: UpsertConnectionInput,
	): Promise<ConnectionPayload> {
		return associateConnection(this.instance, source, item);
	}

	public dissociateItem(
		source: Source,
		item: UpsertConnectionInput,
	): Promise<ConnectionPayload> {
		return dissociateConnection(this.instance, source, item);
	}
}

export async function listConnectionsBySource(
	instance: MondoAppConnect,
	source: Source,
	pagination?: Pagination,
): Promise<PaginationCollection<ConnectionPayload>> {
	const url = addPaginationToURL(
		new URL(ConnectionResources.buildPath(source), instance.config.host),
		pagination,
	);

	return parseEgressSchema(
		PaginationCollectionSchema(ConnectionPayloadSchema)(
			await getItemWithAuthorization(url, instance.authorizer),
		),
	);
}

export async function associateConnection(
	instance: MondoAppConnect,
	source: Source,
	item: UpsertConnectionInput,
): Promise<ConnectionPayload> {
	return parseEgressSchema(
		ConnectionPayloadSchema(
			await putItemWithAuthorization(
				new URL(ConnectionResources.buildPath(source), instance.config.host),
				instance.authorizer,
				parseEgressSchema(
					UpsertConnectionPayloadSchema.onUndeclaredKey("delete")(item),
				),
			),
		),
	);
}

export async function dissociateConnection(
	instance: MondoAppConnect,
	source: Source,
	item: UpsertConnectionInput,
): Promise<ConnectionPayload> {
	return parseEgressSchema(
		ConnectionPayloadSchema(
			await deleteItemWithAuthorization(
				new URL(ConnectionResources.buildPath(source), instance.config.host),
				instance.authorizer,
				parseEgressSchema(
					UpsertConnectionPayloadSchema.onUndeclaredKey("delete")(item),
				),
			),
		),
	);
}
