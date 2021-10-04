import React, { useState } from 'react'
import { Row } from 'reactstrap'
import { setReservation, deleteReservation } from '../../utils/api'
import { Link } from 'react-router-dom'

import './Reservation.css'

export default function Reservation({reservation}) {
    function seatReservation(event) {
        const abortController = new AbortController()

        const data = {
            reservation_id: event.target.id,
            status: 'seated'
        }
        
        const status = document.querySelector('.status')
        status.innerText = 'Status: Seated'

        setReservation(data, event.target.id, abortController.signal)
            .then(res => console.log(res))
            //.then(window.location.reload())
        
    }

    function destroyReservation(event) {
        const abortController = new AbortController

        const data = {reservation_id: event.target.id}

        console.log(data)
        deleteReservation(data, abortController.signal)
            .then(res => console.log(res))
            .then(window.location.reload())
    }

    return ( 
          <div key={reservation.reservation_id} className='w-100 border border-dark container mb-2 pt-3'>
            <h4 className='text-center content-header'>Reservation {reservation.reservation_id}</h4>
            <Row className='w-auto d-flex justify-content-around'>
                <div className='content-container'>
                    <p className='content' key='first-name'>First Name: {reservation.first_name}</p>
                </div>
                <div className='content-container'> 
                    <p className='content' key='last-name'>Last Name: {reservation.last_name}</p>
                </div>
                <div className='content-container'>
                    <p className='content' key='phone-number'>Phone Number: {reservation.mobile_number}</p>
                </div>
            </Row>
            <Row className='w-auto d-flex justify-content-around'>
                <div className='content-container'>
                    <p className='content' key='date'>Date: {reservation.reservation_date}</p>
                </div>
                <div className='content-container'>
                    <p className='content' key='time'>Time: {reservation.reservation_time}</p>
                </div>
                <div className='content-container'>
                    <p className='content' key='people'>Party Size: {reservation.people}</p>
                </div>
            </Row>
            <Row className='d-flex justify-content-center'>
              <p className='col-4 text-center content status' key='status'>Status: {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1, reservation.status.length)}</p>
            </Row>
            <div className='d-flex justify-content-around text-center'>
                <Link className='m-3 p-2 border-dark bg-primary text-white seat-button' id={reservation.reservation_id} to={`/reservations/${reservation.reservation_id}/seat`} /*onClick={seatReservation}*/>Seat Reservation</Link>
                <button id={reservation.reservation_id} className='m-3 bg-danger border-none delete-button' onClick={destroyReservation}>Delete</button>
            </div>
          </div>
    )
}