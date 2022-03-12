import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
    return {
        verbose: true,
        moduleNameMapper: {
            "modules/(.*)": "<rootDir>/src/$1",
        },
        transform: {
            ".(ts|tsx)": "ts-jest"
        }
    };
};