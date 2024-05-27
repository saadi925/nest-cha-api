import { FastifyRequest } from "fastify";
import { User } from "mongo/schema/user.schema";
export interface RequestWithUser extends FastifyRequest {
user : User    
}
