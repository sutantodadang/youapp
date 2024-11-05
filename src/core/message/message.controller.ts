import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageGateway } from './message.gateway';
import { ViewMessageDto, ViewMessageResultDto } from './dto/view-message.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';


@ApiBearerAuth()
@ApiTags('Message')
@Controller('api')
export class MessageController {
    constructor(private readonly messageService: MessageService, private readonly messageGateway: MessageGateway) { }

    @ApiOperation({ summary: 'Send Message' })
    @ApiResponse({ status: 200, description: 'will emit to websockets' })
    @UseGuards(JwtAuthGuard)
    @Post("sendMessage")
    async create(@Body() createMessageDto: CreateMessageDto) {

        const result = await this.messageService.create(createMessageDto);

        this.messageGateway.sendMessage(result.content)

        return
    }

    @ApiOperation({ summary: 'View Message' })
    @ApiQuery({ type: ViewMessageDto })
    @ApiResponse({ status: 200, description: 'get all message by sender and receiver', type: ViewMessageResultDto })
    @UseGuards(JwtAuthGuard)
    @Get("viewMessage")
    async findAll(@Query() q: ViewMessageDto) {

        return await this.messageService.findAll(q)
    }



}
