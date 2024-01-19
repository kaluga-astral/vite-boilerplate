export type Config = {
  apiUrl: string;
  monitoringDsn: string;
  monitoringStand: string;
  monitoringRelease: string;
};

export class ConfigService {
  #config: Config | undefined;

  constructor() {
    this.config = {} as Config;
  }

  init(config: Config) {
    this.config = config as Config;
  }

  get config(): Config {
    if (!this.#config) {
      throw Error('ConfigService is not initialized');
    }

    return this.#config;
  }

  set config(config: Config) {
    this.#config = config;
  }
}

export const configService = new ConfigService();
