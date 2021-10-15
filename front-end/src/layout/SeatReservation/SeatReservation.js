import React, { useEffect, useState } from "react";
import Header from '../Header-Footer/Header'
import { listTables, seatReservation, setReservationStatus } from "../../utils/api";
import { useParams, useHistory } from "react-router";
import ErrorAlert from "../main/ErrorAlert";

export default function SeatReservation() {
    const history = useHistory()
    const {reservation_id} = useParams()

    const [tables, setTables] = useState([])
    const [errors, setErrors] = useState(null)


    useEffect(loadTables, []);

    function loadTables() {
        const abortController = new AbortController()
        
        listTables(abortController.signal).then(setTables)

        return () => abortController.abort()
    }


    function RenderOption({table}) {
        return <option id={table.table_id}>{table.table_name} - {table.capacity}</option>
    }

    async function submitHandler(event) {
        const abortController = new AbortController()
        setErrors(null)

        const select = document.querySelector('select')
        const selectedId = select.options[select.selectedIndex].id

        try {
            await seatReservation(reservation_id, selectedId, abortController.signal)
            
            const data = {
                reservation_id: event.target.id,
                status: 'seated'
            }
    
            await setReservationStatus(data, reservation_id, abortController.status)
    
    
            history.push('/dashboard')
        } catch(error) {
            setErrors(error)
        }
    }

    return (
        <div>
            <Header page={`Seat Reservation ${reservation_id}`} />
            <ErrorAlert error={errors} />
            <div className='w-100 border-dark my-3 p-4 text-center d-flex flex-row justify-content-around'>
                <label className='text-white mx-2'>Select Table</label>
                <select name="table_id" className='w-25 mx-2 table_id'>
                    {(tables.map((table) => <RenderOption table={table} />))}
                </select>
                <button className='w-25 mx-2' onClick={submitHandler}>Submit</button>
                <button className='w-25 mx-2' onClick={history.goBack}>Cancel</button>
            </div>
        </div>
    )
}