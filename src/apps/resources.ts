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
import { type AppHandle, type AppPayload, AppPayloadSchema } from "./schema.js";

export const PATH = "/v1/apps";

export class AppResources {
	public constructor(private readonly instance: MondoAppConnect) {}

	static buildListingPath(): string {
		return PATH;
	}

	static buildItemPath(app: AppHandle): string {
		return [PATH, app].join("/");
	}

	public listItems(
		pagination?: Pagination,
	): Promise<PaginationCollection<AppPayload>> {
		return listApps(this.instance, pagination);
	}

	public getItem(app: AppHandle): Promise<AppPayload> {
		return getApp(this.instance, app);
	}
}

export async function listApps(
	instance: MondoAppConnect,
	pagination?: Pagination,
): Promise<PaginationCollection<AppPayload>> {
	const url = addPaginationToURL(
		new URL(AppResources.buildListingPath(), instance.config.host),
		pagination,
	);

	return parseEgressSchema(
		PaginationCollectionSchema(AppPayloadSchema).safeParse(
			await getItemWithAuthorization(url, instance.authorizer),
		),
	);
}

export async function getApp(
	instance: MondoAppConnect,
	app: AppHandle,
): Promise<AppPayload> {
	const url = new URL(AppResources.buildItemPath(app), instance.config.host);

	return parseEgressSchema(
		AppPayloadSchema.safeParse(
			await getItemWithAuthorization(url, instance.authorizer),
		),
	);
}
