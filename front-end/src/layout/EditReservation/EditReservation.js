import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router';
import Header from '../Header-Footer/Header'
import { readReservation, editReservation } from '../../utils/api';

export default function EditReservation() {
    const history = useHistory()
    const {reservation_id} = useParams()

    const [reservation, setReservation] = useState([])
    const [formData, setFormData] = useState({})
    
    useEffect(() => {
        readReservation(reservation_id)
            .then(setReservation)
        readReservation(reservation_id)
            .then(res => setFormData({first_name: res.first_name, last_name: res.last_name, mobile_number: res.mobile_number, reservation_date: res.reservation_date, reservation_time: res.reservation_time, people: res.people, reservation_id: reservation_id}))
    }, [])
    
    function changeHandler({target}) {
        let value = target.value;
    
        if(target.name === "people"){
            if(value < 1)
                    value = 1;
            value = Number(value);
        }
        setFormData({
            ...formData,
            [target.name]: value,
        });
    };

    function submitHandler(event) {
        event.preventDefault()

        const abortController = new AbortController()

        editReservation(formData, abortController.signal)
            .then(res => history.push(`/dashboard?date=${res.reservation_date.substring(0, 10)}`))
    }
    
    return (
        <>
            <Header page='Edit Reservation' />
            <div>
            <form onSubmit={submitHandler} className='container'id='new'>
                    <div className='col-4 mb-2 input-container' >
                        <label htmlFor='first-name'>First name</label>
                        <input 
                            id='form-input' 
                            name='first_name' 
                            type='text'
                            onChange={changeHandler}
                            placeholder={reservation.first_name}
                        />
                    </div>
                    <div className='col-4 mb-2 input-container'>
                        <label htmlFor='last-name'>Last name</label>
                        <input 
                            id='form-input' 
                            name='last_name' 
                            type='text'
                            onChange={changeHandler}
                            placeholder={reservation.last_name}
                        />
                    </div>
                    <div className='col-4 mb-2 input-container'>
                        <label htmlFor='mobile-number'>Mobile Number</label>
                        <input 
                            id='form-input' 
                            name='mobile_number' 
                            type='tel'
                            pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
                            onChange={changeHandler}
                            placeholder={reservation.mobile_number}
                        />
                    </div>
                    <div className='col-4 input-container'>
                        <label htmlFor='date'>Reservation Date</label>
                        <input 
                            id='form-input' 
                            name='reservation_date' 
                            type='date'
                            onChange={changeHandler}
                            pattern='\d{2}-\d{2}-\d{4}'
                        />
                    </div>
                    <div className='col-4 input-container'>
                        <label htmlFor='time'>Time</label>
                        <input 
                            id='form-input' 
                            name='reservation_time' 
                            type='time'
                            onChange={changeHandler}
                            pattern='[0-9]{2}:[0-9]{2}'
                        />
                    </div>
                    <div className='col-4 input-container'>
                        <label htmlFor='people'>Amount of people</label>
                        <input  
                            id='form-input' 
                            name='people' 
                            type='number'
                            onChange={changeHandler}
                            placeholder={reservation.people}
                        />
                    </div>
                    <div className='mt-4 d-flex justify-content-around'>
                        <button className='w-25' type='submit' onClick={submitHandler}>Submit</button>
                        <button className='w-25' onClick={(event => history.goBack)}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    ) 
}