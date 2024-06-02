import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import fastifyCookie from "@fastify/cookie";
import compression from "@fastify/compress";
import { constants } from "zlib";
import { ValidationPipe } from "@nestjs/common";
import { RedisIoAdapter } from "./redis/redis.adapter";
import * as fastifyMultipart from '@fastify/multipart';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors({
    origin: "*",
  });
  const ws = new RedisIoAdapter(app);
  await ws.connectToRedis();
  app.useWebSocketAdapter(ws);
  // app.setGlobalPrefix("v1/api");
  app.useGlobalPipes(new ValidationPipe());
  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
    parseOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    },
  });
  await app.register(fastifyMultipart)
  await app.register(compression, {
    brotliOptions: { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } },
    encodings: ["gzip", "deflate"],
  });
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
