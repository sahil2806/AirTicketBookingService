const {BookingRepository} = require('../repository/index');
const axios = require('axios');
const {FLIGHT_SERVICE_PATH} = require('../config/serverConfig');
const { ServiceError } = require('../utils/errors');
const errors = require('../utils/errors');

class BookingService {
    constructor(){
        
        this.bookingRepository = new BookingRepository();
    }



    async createBooking(data){
        try {
            console.log(data);
            const flightId = data.flightId;
            let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            console.log(getFlightRequestURL)
            const response = await axios.get(getFlightRequestURL);
            
            const flightData = response.data.data;
            let priceOfTHeFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats){
                throw new ServiceError('Something went wrong in the booking process', 'Insufficient seats in the flight');
            }
            const totalCost = priceOfTHeFlight*data.noOfSeats;
            const bookingPayload = {...data , totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL,{totalSeats:flightData.totalSeats-booking.noOfSeats});
            const finalBooking = await this.bookingRepository.update(booking.id, {status: "Booked"});
           
            return finalBooking;
            
        } catch (error) {
            console.log(error)
            if(error.name == 'SequelizeValidationError' ||  error.name == 'RepositoryError'){
                throw error;
            }
            throw new ServiceError();
        }
    }

    
    async updateBooking(bookingId,data){
        try {
            // Fetched the previous booking details
            let bookingdetails = await this.bookingRepository.get(bookingId);
            let flightId = bookingdetails.flightId;
            let userId = bookingdetails.userId;
            let noOfSeatsBooked = bookingdetails.noOfSeats;
            if(!data.flightId){
                data.flightId = flightId;
            }
            if(!data.userId){
                data.userId = userId;
            }
            if(!data.noOfSeats){
                data.noOfSeats = noOfSeatsBooked;
            }
            // RevertBack the total seats
            let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            let flightDetails = await axios.get(getFlightRequestURL);
            let noOfSeats = flightDetails.data.data.totalSeats  + noOfSeatsBooked;
            await axios.patch(getFlightRequestURL,{totalSeats:noOfSeats});
            // Rebook the seats according to the new details
            flightId = data.flightId;
            getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            let response = await axios.get(getFlightRequestURL);
            let flightData = response.data.data;
            let priceOfTHeFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats){
                throw new ServiceError('Something went wrong in the booking process', 'Insufficient seats in the flight');
            }
            const totalCost = priceOfTHeFlight*data.noOfSeats;
            const bookingPayload = {...data , totalCost};
            const booking = await this.bookingRepository.updateAll( bookingId,bookingPayload);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${bookingPayload.flightId}`;
             
            await axios.patch(updateFlightRequestURL,{totalSeats:flightData.totalSeats-bookingPayload.noOfSeats});
            const finalBooking = await this.bookingRepository.update( bookingId , {status: "Booked"});
            return finalBooking;
        } catch (error) {
            console.log(error)
            if(error.name == 'SequelizeValidationError' ||  error.name == 'RepositoryError'){
                throw error;
            }
            throw new ServiceError();
        }
    }
}


module.exports = BookingService;