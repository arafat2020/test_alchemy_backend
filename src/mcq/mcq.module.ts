import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { McqController } from './mcq.controller';
import { McqService } from './mcq.service';
import { AdminMiddleware, ExamineeMiddleware } from 'src/user-role/user-role.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { Mcq, McqSchema } from 'src/schemas/mcq.model';

@Module({
  imports:[
    MongooseModule.forFeature([
        {
          name: Mcq.name,
          schema: McqSchema,
        }
      ])
  ],
  controllers: [McqController],
  providers: [McqService]
})
export class McqModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(ExamineeMiddleware)        
    .forRoutes(McqController); // Specify the route(s) here
}
}
