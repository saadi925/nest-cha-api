import {FastifyRequest, FastifyReply} from 'fastify'


export interface FastifyRequestExpress extends FastifyRequest {
    res? : any
    user : any

}
export interface FastifyReplyExpress extends FastifyReply {
    end? : any
    setHeader? :(key: any, value: any) => any, 
}


export type CredentialSignInResponse = { tokens: {
    access_token : string;
    refresh_token : string;
  }; message: string; user?: {
    displayname: string,
    avatar: string,
  }
}