import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { User } from "mongo/schema/user.schema";
export interface SocketWithUser extends Socket {
  user: User;
}
@Injectable()
export class WsJwtAuthGuard extends AuthGuard("jwt") {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.auth?.token;

    if (!token) {
      throw new WsException("Unauthorized");
    }

    client.handshake.headers.authorization = `Bearer ${token}`;

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new WsException("Unauthorized");
    }
    return user;
  }
}
