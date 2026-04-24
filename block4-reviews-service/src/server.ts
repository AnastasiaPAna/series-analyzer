import { createApp } from "./app";
import { getConfig } from "./config/env";
import { connectToDatabase } from "./db/connect";

async function bootstrap() {
  const config = getConfig();

  await connectToDatabase(config.mongodbUri);

  const app = createApp(config);

  app.listen(config.port, () => {
    console.log(`Reviews service is running on http://localhost:${config.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start reviews service", error);
  process.exit(1);
});
