import { type } from "arktype";

const BaseConfigSchema = type({
	host: type("string.url.parse").default(
		"https://dxnh0yagb1.execute-api.us-east-1.amazonaws.com", // Todo - Replace me!
	),
});

const AccessTokenConfigSchema = BaseConfigSchema.and({
	accessToken: type("string").moreThanLength(0),
});

const ConfigSchema = AccessTokenConfigSchema;

export type ConfigProps = typeof ConfigSchema.inferIn;
export type Config = typeof ConfigSchema.inferOut;

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
	const out = ConfigSchema(config);

	if (out instanceof type.errors) {
		throw new Error(`Invalid configuration: ${out.summary}`);
	}

	return out;
}
