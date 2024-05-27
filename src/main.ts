import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import fastifyCookie from "@fastify/cookie";
import compression from "@fastify/compress";
import { constants } from "zlib";
import { RedisIoAdapter } from "./redis/redis.adapter";
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors();
  app.setGlobalPrefix("v1/api");

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
    parseOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    },
  });

  await app.register(compression, {
    brotliOptions: { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } },
    encodings: ["gzip", "deflate"],
  });

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

 app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
