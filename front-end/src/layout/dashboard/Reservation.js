import React, { useState } from 'react'
import { Row } from 'reactstrap'
import { setReservationStatus, deleteReservation } from '../../utils/api'

import './Reservation.css'

export default function Reservation({reservation, loadDashboard}) {
    function destroyReservation(event) {
        if (window.confirm(`Are you sure you want to delete reservation ${event.target.id}? This can not be undone.`)){
            const abortController = new AbortController

            const data = {reservation_id: event.target.id}

            deleteReservation(data, abortController.signal)
                .then(loadDashboard)
        }   
    }

    function cancelReservation(event) {
        event.preventDefault()

        const abortController = new AbortController()

        if (window.confirm('Do you want to cancel this reservation? This cannot be undone.')) {
            const data = {
                reservation_id: event.target.id,
                status: 'cancelled'
            }
            
            setReservationStatus(data, event.target.id, abortController.signal)
                .then(loadDashboard)
        }
    }

    return ( 
          <div key={reservation.reservation_id} className='w-100 border border-dark container mb-2 pt-3'>
            <button id={reservation.reservation_id} className='float-right bg-danger text-white' onClick={destroyReservation}>X</button>
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
              <p className='col-4 text-center content status' data-reservation-id-status={reservation.reservation_id} key='status'>Status: {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1, reservation.status.length)}</p>
            </Row>
            <div className='d-flex justify-content-around text-center buttons'>
                {reservation.status === 'booked' && <a className='m-3 p-2 border-dark bg-primary text-white seat-button' id={reservation.reservation_id} href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>}
                <a className='m-3 p-2 border-dark bg-dark text-center text-white edit-button' href={`/reservations/${reservation.reservation_id}/edit`} id={reservation.reservation_id}>Edit</a>
                <a id={reservation.reservation_id} className='m-3 p-2 bg-danger border-none text-white delete-button' onClick={cancelReservation} data-reservation-id-cancel={reservation.reservation_id}>Cancel</a>
            </div>
          </div>
    )
}