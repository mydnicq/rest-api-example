import * as data from "./database.json";

const dbConfig = process.env.NODE_ENV
  ? data[process.env.NODE_ENV]
  : data.development;

export default {
  appName: process.env.APP_NAME || "REST API example",
  env: process.env.NODE_ENV || "development",
  httpPort: process.env.HTTP_PORT || 5566,
  httpHost: process.env.HTTP_HOST || "0.0.0.0",
  pgPort: process.env.DB_PORT || dbConfig.port,
  pgHost: process.env.DB_HOST || dbConfig.host,
  pgDBname: process.env.DB_NAME || dbConfig.database,
  pgUserName: process.env.DB_USER_NAME || dbConfig.user,
  pgPassword: process.env.DB_PASSWORD || dbConfig.password,
  jwtSecret: process.env.JWT_SECRET || "secret",
  jwtExpiration: process.env.JWT_EXPIRATION || 86400, // expires in 24 hours
  // Access-Control-Allow-Origin CORS header can be string to restrict allowed origin (i.e. http://localhost:4444)
  // or true/false to completely enable/disable CORS
  allowOrigin: true
};
