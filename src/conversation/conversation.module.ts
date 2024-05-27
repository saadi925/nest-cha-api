import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationFeatureModel } from 'mongo/schema/conversation.schema';

@Module({
  imports :[
    MongooseModule.forFeature([ConversationFeatureModel])
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports :[ConversationService]
})
export class ConversationModule {}
