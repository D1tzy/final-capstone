import React from "react";
import { completeReservation, deleteTable } from "../../utils/api";


export default function Table({table, loadDashboard}) {
    async function finishReservation(event) {
        const abortController = new AbortController()

        if (window.confirm('Is this table ready to seat new guests? This cannot be undone.')) {
            await completeReservation(event.target.id, abortController.signal)
            
            loadDashboard()
        }
    }

    async function destroyTable(event) {
        const abortController = new AbortController()

        await deleteTable(event.target.id, abortController)

        loadDashboard()
    }

    return (
        <div className='my-5 border border-dark p-3'>
            <button id={table.table_id} className='float-right bg-danger text-white' onClick={destroyTable}>X</button>
            <h4 className='text-center content-header'>Table {table.table_id}</h4>
            <p className='mx-2'>Name: {table.table_name}</p>
            <p className='mx-2'>Capacity: {table.capacity}</p>
            {table.reservation_id && <p className='mx-2'>Reservation ID: {table.reservation_id}</p>}
            <p className='mx-2' data-table-id-status={table.table_id}>Status: {table.reservation_id ? 'Occupied' : 'Free'}</p>
            {table.reservation_id &&
                <div className='d-flex justify-content-center'>
                    <button id={table.table_id} className='w-fit-content m-3' onClick={finishReservation}>Finish Reservation</button>
                </div>
            }
        </div>
    )
}