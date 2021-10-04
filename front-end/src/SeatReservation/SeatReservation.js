import React, { useEffect, useState } from "react";
import Header from '../Header-Footer/Header'
import { listTables } from "../utils/api";

export default function SeatReservation({reservation}) {
    const [tables, setTables] = useState([])
    const [errors, setErrors] = useState([])

    function RenderOption({table}) {
        return <option>{table.table_name}</option>
    }

    useEffect(() => {
        const abortController = new AbortController()
        console.log('listing tables')
        listTables(abortController.signal).then(setTables).catch(setErrors)

        return abortController.abort()
    }, [reservation])
    console.log(tables)
    return (
        <div>
            <Header page='Seat Reservation' />
            <div className='w-100 border-dark my-3 p-4 text-center'>
                <label className='text-white mx-2'>Select Table</label>
                <select>
                    <option>First</option>
                    {/*(tables.map((table) => <RenderOption table={table} />))*/}
                </select>
            </div>
        </div>
    )
}