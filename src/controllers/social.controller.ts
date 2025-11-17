// src/controllers/profile.controller.ts
import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { AppService } from 'src/app.service';

@Controller('social') 
export class SocialController {
    constructor(private readonly appService: AppService) {}

    @Get('/conversations/seller/:id')
    async getConversations(@Param('id') id: string ){
        try{
            const [seller] = await Promise.all([
                this.appService.send('social', 'conversations.seller', { seller_id: id})
            ])
    
    
            return seller

        }catch(error:any)
        {
            console.log(`Erro ao Exibir Conversation Seller. ${error}`)
            return error
        }
    }

    @Get('/conversations/:id/messages')
    async getMessages(@Param('id') id: string ){
        try{
            const [messages] = await Promise.all([
                this.appService.send('social', 'conversations.messages', {conversation_id: id})
            ])
    
    
            return messages

        }catch(error:any)
        {
            console.log(`Erro ao Exibir Conversation Messages. ${error}`)
            return error
        }
    }


    @Patch('/conversations/:id/read')
    async updateRead(@Param('id') id: string ){
        try{
            const [is_readed] = await Promise.all([
                this.appService.send('social', 'conversations.mark_as_read', {conversation_id: id})
            ])
    
    
            return is_readed

        }catch(error:any)
        {
            console.log(`Erro ao Exibir Conversation Read. ${error}`)
            return error
        }
    }
}
