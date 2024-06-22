const { StatusCodes } = require('http-status-codes');

const { booking } = require('../models/index');
const { AppError, ValidationError } = require('../utils/errors/index');
const { where } = require('sequelize');

class BookingRepository {
    async create(data) {
        try {
            const response = await booking.create(data);
            return response;
        } catch (error) {
            console.log(error)
            if(error.name == 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError', 
                'Cannot create Booking', 
                'There was some issue creating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async get(bookingId) {
        try {
            const bookingDetails = await booking.findByPk(bookingId);
            return bookingDetails;
        } catch (error) {
            console.log(error)
            if(error.name == 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError', 
                'data is not present', 
                'There was some issue in retrieving the information, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async update(bookingId, data) {
        try {
            const response = await booking.findByPk(bookingId);
            if(data.status) {
                response.status = data.status;
            }
            await response.save();
            return response;
        } catch (error) {
            if(error.name == 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError', 
                'Cannot update Booking', 
                'There was some issue updating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updateAll(bookingId, data) {
        try {
            const response = await booking.update(data,{
                where:{
                    id:bookingId
                }
            });
            return response;
        } catch (error) {
            if(error.name == 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError', 
                'Cannot update Booking', 
                'There was some issue updating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = BookingRepository;