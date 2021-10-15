import React, { useState } from 'react';
import Header from '../Header-Footer/Header';
import { searchByNumber } from '../../utils/api';
import Reservation from '../dashboard/Reservation.js'
import ErrorAlert from '../main/ErrorAlert';

export default function Search() {
    const [reservations, setReservations] = useState([])

    async function searchHandler() {
        const searchValue = document.querySelector("input").value
         
        setReservations(await searchByNumber(searchValue))
    }
    
    reservations.forEach((res) => res.reservation_date = res.reservation_date.substring(0, 10))

    return (
        <div>
            <Header page="Search" />
            <div className='d-flex justify-content-center my-5'>
                <label className='text-white mx-2' htmlFor='phone-number'>Phone Number</label>
                <input 
                    required 
                    className='w-25 text-center' 
                    type='text' 
                    id='phone-number' 
                    placeholder="Enter a customer's phone number"
                />
                <button className='mx-4' onClick={searchHandler}>Search</button>
            </div>
            <div className='text-center d-flex flex-column justify-content-center'>
                {reservations.length === 0 && <ErrorAlert error={{message: 'No reservations found'}} />}
                {(reservations.map((reservation) => <Reservation reservation={reservation} />))}
            </div>
        </div>
    )
}