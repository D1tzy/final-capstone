import React, { useState } from "react";
import {useHistory} from 'react-router-dom'
import Header from "../../Header-Footer/Header";
import { createReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import useQuery from "../../utils/useQuery";
import { today } from "../../utils/date-time";
import TimezoneSelect from "react-timezone-select";


import './CreateReservation.css'

export default function CreateReservation() {
    const history = useHistory()
    const query = useQuery();
    const date = query.get("date") ? query.get("date") : today();


    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: date,
        reservation_time: "",
        people: 1
    }

    const [reservationError, setReservationError] = useState(null)
    const [formData, setFormData] = useState(initialFormState)
    const [selectedTimezone, setSelectedTimezone] = useState({})

    function submitHandler(event) {
        event.preventDefault()

        const abortController = new AbortController()

        const inputFields = document.querySelectorAll('input')

        let data = getData(inputFields)
        console.log(data)
        
        createReservation(data, abortController.signal)
            .then(() =>  history.push(`/dashboard?date=${data['reservation_date']}`))
            .catch(setReservationError)
    }

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
           <ErrorAlert error={reservationError} />
           <div>
               {/*<TimezoneSelect value={selectedTimezone} onChange={setSelectedTimezone} />
               <div className='timezone-container'>
                <pre className='timezone-selected'>
                    {JSON.stringify(selectedTimezone, null, 2)}
                 </pre>
    </div>*/}
                <h1 className='text-center m-3'>Reservation Information</h1>
                <form onSubmit={submitHandler} className='container'id='new'>
                    <div className='col-4 mb-2 input-container' >
                        <label htmlFor='first-name'>First name</label>
                        <input 
                            required={true} 
                            id='form-input' 
                            name='first_name' 
                            type='text'
                            onChange={changeHandler}
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
                            onChange={changeHandler}
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
                            pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
                            onChange={changeHandler}
                            placeholder='888-888-8888'
                        />
                    </div>
                    <div className='col-4 input-container'>
                        <label htmlFor='date'>Reservation Date</label>
                        <input 
                            required={true} 
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
                            required={true} 
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
                            required={true} 
                            id='form-input' 
                            name='people' 
                            type='number'
                            onChange={changeHandler}
                            placeholder='Amount of people in the reservation'
                        />
                    </div>
                    <div className='mt-3 pb-3 w-auto d-flex pt-3 justify-content-around space-content-evenly button-container'>
                        <button onClick={history.goBack} type='cancel' className='w-25 cancel-button'>Cancel</button>
                        <button type='submit' className='w-25 submit-button'>Submit</button>
                    </div>
                </form>
            </div>
        </>
    )  
}