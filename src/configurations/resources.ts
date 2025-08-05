import type { AppHandle } from "../apps/schema.js";
import type { MondoAppConnect } from "../common/init.js";
import { getItemWithAuthorization } from "../common/resources/operations.js";
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
	type ConfigurationPayload,
	ConfigurationPayloadSchema,
} from "./schema.js";

const PATH = "/v1/configurations";

export type ConfigurationListingFilter = {
	app?: AppHandle;
};

export class ConfigurationResources {
	public constructor(private readonly instance: MondoAppConnect) {}

	static buildListingPath(): string {
		return PATH;
	}

	public listItems(
		filter?: ConfigurationListingFilter,
		pagination?: Pagination,
	): Promise<PaginationCollection<ConfigurationPayload>> {
		return listConfigurations(this.instance, filter, pagination);
	}
}

export async function listConfigurations(
	instance: MondoAppConnect,
	filter?: ConfigurationListingFilter,
	pagination?: Pagination,
): Promise<PaginationCollection<ConfigurationPayload>> {
	const url = addPaginationToURL(
		new URL(ConfigurationResources.buildListingPath(), instance.config.host),
		pagination,
	);

	// Add filter(s)
	if (filter) {
		Object.entries(filter).forEach(([key, value]) =>
			url.searchParams.append(`filter[${key}]`, value),
		);
	}

	return parseEgressSchema(
		PaginationCollectionSchema(ConfigurationPayloadSchema).safeParse(
			await getItemWithAuthorization(url, instance.authorizer),
		),
	);
}
