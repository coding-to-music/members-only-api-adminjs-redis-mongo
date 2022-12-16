import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
    return {
        verbose: true,
        moduleNameMapper: {
            "@/(.*)": "<rootDir>/src/$1",
            "@admin/(.*)": "<rootDir>/src/admin/$1",
            "@auth/(.*)": "<rootDir>/src/auth/$1",
            "@config/(.*)": "<rootDir>/src/config/$1",
            "@media/(.*)": "<rootDir>/src/media/$1",
            "@message/(.*)": "<rootDir>/src/message/$1",
            "@post/(.*)": "<rootDir>/src/post/$1",
            "@profile/(.*)": "<rootDir>/src/profile/$1",
            "@models/(.*)": "<rootDir>/src/models/$1",
            "@routes/(.*)": "<rootDir>/src/routes/$1",
            "@shared/(.*)": "<rootDir>/src/shared/$1",
            "@user/(.*)": "<rootDir>/src/user/$1",
            "@utils/(.*)": "<rootDir>/src/utils/$1",
        },
        transform: {
            ".(ts)": "ts-jest",
        },
        testTimeout: 90000,
    };
};