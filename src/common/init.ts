import { z } from "zod";

const BaseConfigSchema = z.object({
	host: z
		.string()
		.url()
		.default("https://dxnh0yagb1.execute-api.us-east-1.amazonaws.com") // Todo - Replace me!
		.transform((url) => new URL(url)),
});

const AccessTokenConfigSchema = BaseConfigSchema.extend({
	accessToken: z.string().min(1),
});

const ConfigSchema = AccessTokenConfigSchema;

export type ConfigProps = z.input<typeof ConfigSchema>;
export type Config = z.output<typeof ConfigSchema>;

export class MondoAppConnect {
	readonly config: Config;

	public constructor(config: ConfigProps) {
		this.config = initConfig(config);
	}

	/**
	 * Builds an authorizer function based on the type of access token
	 */
	public get authorizer(): (request: RequestInit) => RequestInit {
		if (this.config.accessToken) {
			return (request) => {
				request.headers = new Headers(request.headers);
				request.headers.append("authorization", this.config.accessToken);
				return request;
			};
		}

		return (request) => request;
	}
}

function initConfig(config: ConfigProps): Config {
	try {
		return ConfigSchema.parse(config);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error(`Invalid configuration: ${error.message}`);
		}
		throw error;
	}
}
