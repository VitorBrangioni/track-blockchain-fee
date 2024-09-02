import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    transform: {},
    testRegex: ".*\\.test\\.ts$",
    testEnvironment: "node",
};

export default config;