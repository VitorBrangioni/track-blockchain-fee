import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    transform: {},
    testRegex: ".*\\.test\\.ts$",
    testEnvironment: "node",
    preset: 'ts-jest'
};

export default config;