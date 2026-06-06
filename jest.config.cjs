module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
};
