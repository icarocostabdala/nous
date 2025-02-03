module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "json", "node"],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  // setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
