import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
    return {
        verbose: true,
        moduleNameMapper: {
            "@configs/(.*)": "<rootDir>/src/configs/$1",
            "@controllers/(.*)": "<rootDir>/src/controllers/$1",
            "@global/(.*)": "<rootDir>/src/$1",
            "interfaces/(.*)": "<rootDir>/src/interfaces/$1",
            "@middlewares/(.*)": "<rootDir>/src/middlewares/$1",
            "@models/(.*)": "<rootDir>/src/models/$1",
            "@routes/(.*)": "<rootDir>/src/routes/$1",
            "@services/(.*)": "<rootDir>/src/services/$1",
            "@utils/(.*)": "<rootDir>/src/utils/$1",
        },
        transform: {
            ".(ts)": "ts-jest",
        },
    };
};