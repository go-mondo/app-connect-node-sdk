import { PATH as APP_PATH } from "../apps/resources.js";
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
	type AppObjectHandle,
	type AppObjectPayload,
	AppObjectPayloadSchema,
} from "./schema.js";

const ITEM_PATH = "objects";

export class AppObjectResources {
	public constructor(private readonly instance: MondoAppConnect) {}

	static buildListingPath(app: AppHandle): string {
		return [APP_PATH, app, ITEM_PATH].join("/");
	}

	static buildItemPath(app: AppHandle, object: AppObjectHandle): string {
		return [AppObjectResources.buildListingPath(app), object].join("/");
	}

	public listItems(
		app: AppHandle,
		pagination?: Pagination,
	): Promise<PaginationCollection<AppObjectPayload>> {
		return listAppObjects(this.instance, app, pagination);
	}

	public getItem(
		app: AppHandle,
		object: AppObjectHandle,
	): Promise<AppObjectPayload> {
		return getAppObject(this.instance, app, object);
	}
}

export async function listAppObjects(
	instance: MondoAppConnect,
	app: AppHandle,
	pagination?: Pagination,
): Promise<PaginationCollection<AppObjectPayload>> {
	const url = addPaginationToURL(
		new URL(AppObjectResources.buildListingPath(app), instance.config.host),
		pagination,
	);

	return parseEgressSchema(
		PaginationCollectionSchema(AppObjectPayloadSchema).safeParse(
			await getItemWithAuthorization(url, instance.authorizer),
		),
	);
}

export async function getAppObject(
	instance: MondoAppConnect,
	app: AppHandle,
	object: AppObjectHandle,
): Promise<AppObjectPayload> {
	const url = new URL(
		AppObjectResources.buildItemPath(app, object),
		instance.config.host,
	);

	return parseEgressSchema(
		AppObjectPayloadSchema.safeParse(
			await getItemWithAuthorization(url, instance.authorizer),
		),
	);
}
