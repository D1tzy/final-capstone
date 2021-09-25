import React from "react";
import {useHistory} from 'react-router-dom'
import Header from "../../Header/Header";
import { createReservation } from "../../utils/api";

import './CreateReservation.css'

export default function CreateReservation() {
    const history = useHistory()

    async function submitHandler(event) {
        event.preventDefault()

        const abortController = new AbortController()

        const inputFields = document.querySelectorAll('input')

        let data = getData(inputFields)
        
        createReservation(data, abortController.signal)

        history.push(`/dashboard?date=${data['reservation_date']}`)
    }

    function getData(fields) {
        let returnData = {}

        fields.forEach(({name, value}) => {
            if (name === 'people') return returnData[name] = Number(value)
            return returnData[name] = value
        })

        return returnData
    }

    return (
        <>
            <Header page="Create Reservation" />
            <main>
                <h1 className='text-center m-3'>Reservation Information</h1>
                <form onSubmit={submitHandler} className='container'id='new'>
                    <div className='col-4 mb-2 input-container' >
                        <label htmlFor='first-name'>First name</label>
                        <input 
                            required={true} 
                            id='form-input' 
                            name='first_name' 
                            type='text'
                            placeholder='First name'
                        />
                    </div>
                    <div className='col-4 mb-2 input-container'>
                        <label htmlFor='last-name'>Last name</label>
                        <input 
                            required={true} 
                            id='form-input' 
                            name='last_name' 
                            type='text'
                            placeholder='Last name'
                        />
                    </div>
                    <div className='col-4 mb-2 input-container'>
                        <label htmlFor='mobile-number'>Mobile Number</label>
                        <input 
                            required={true} 
                            id='form-input' 
                            name='mobile_number' 
                            type='tel'
                            /*pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'*/
                            placeholder='888-888-8888'
                        />
                    </div>
                    <div className='col-4 input-container'>
                        <label htmlFor='date'>Date</label>
                        <input 
                            required={true} 
                            id='form-input' 
                            name='reservation_date' 
                            type='date'
                            pattern='\d{2}-\d{2}-\d{4}'
                        />
                    </div>
                    <div className='col-4 input-container'>
                        <label htmlFor='time'>Time</label>
                        <input 
                            required={true} 
                            id='form-input' 
                            name='reservation_time' 
                            type='time'
                            pattern='[0-9]{2}:[0-9]{2}'
                        />
                    </div>
                    <div className='col-4 input-container'>
                        <label htmlFor='people'>Amount of people</label>
                        <input 
                            required={true} 
                            id='form-input' 
                            name='people' 
                            type='number'
                            placeholder='Amount of people in the reservation'
                        />
                    </div>
                    <div className='mt-3 w-auto d-flex justify-content-center'>
                        <button onClick={history.goBack()}type='cancel' className='col-6 cancel-button'>Cancel</button>
                        <button type='submit' className='col-6 submit-button'>Submit</button>
                    </div>
                </form>
            </main>
        </>
    )   
}