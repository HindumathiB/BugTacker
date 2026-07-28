import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  await connectDB();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`[server] Mini Bug Tracker API running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('[server] Failed to start server:', error);
  process.exit(1);
});
