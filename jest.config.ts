import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
    return {
        verbose: true,
        moduleNameMapper: {
            "@/(.*)": "<rootDir>/src/$1",
            "@config/(.*)": "<rootDir>/src/config/$1",
            "@controllers/(.*)": "<rootDir>/src/controllers/$1",
            "@exceptions/(.*)": "<rootDir>/src/exceptions/$1",
            "@global/(.*)": "<rootDir>/src/$1",
            "@interfaces/(.*)": "<rootDir>/src/interfaces/$1",
            "@middlewares/(.*)": "<rootDir>/src/middlewares/$1",
            "@models/(.*)": "<rootDir>/src/models/$1",
            "@routes/(.*)": "<rootDir>/src/routes/$1",
            "@services/(.*)": "<rootDir>/src/services/$1",
            "@utils/(.*)": "<rootDir>/src/utils/$1",
        },
        transform: {
            ".(ts)": "ts-jest",
        },
        testTimeout: 90000,
    };
};