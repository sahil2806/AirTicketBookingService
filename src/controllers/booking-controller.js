const {BookingService} = require('../services/index');
const {StatusCodes} = require('http-status-codes')

const { subscribeMessage,createChannel,publishMessage} = require('../utils/messageQueue')
const {REMINDER_BINDING_KEY} = require('../config/serverConfig');

const bookingService = new BookingService();


class BookingController {

    constructor(){

    }

    async sendMessageToQueue(req,res){
         const channel = await createChannel();
       
        const payload = {
            data:{ 
                subject:'This is notification from queue',
                content:'Some queue will subscribe this',
                recepientEmail:'sahilsahu2806@gmail.com',
                notificationTime :'2024-06-23T06:38:41'
            }, 
            service:'CREATE_TICKET'
        };
        await publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(payload));
        return res.status(200).json({
            message:'Successfully published the event'
        });
    }

    async create (req,res){
        try {
            const response = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                message:'Successfully Completed booking',
                success: true,
                err:{},
                data:response
            })
        } catch (error) {
            return res.status(error.statusCode).json({
                message:error.message,
                success: false,
                err:error.explanation ,
                data: {}
            })
        }
    }


    async update(req,res){
        try {
            const response = await bookingService.updateBooking(req.params.id , req.body);
            return res.status(StatusCodes.OK).json({
                message:'Successfully update booking',
                success: true,
                err:{},
                data:response
            })
        } catch (error) {
            return res.status(error.statusCode).json({
                message:error.message,
                success: false,
                err:error.explanation ,
                data: {}
            })
        }
    }
}

module.exports =  BookingController;