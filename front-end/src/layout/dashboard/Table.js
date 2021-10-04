import React from "react";

export default function Table({table}) {
    return (
        <div className='d-flex flex-column my-5 border border-dark'>
            <h4 className='text-center content-header'>Table {table.table_id}</h4>
            <p className='mx-2'>Name: {table.table_name}</p>
            <p className='mx-2'>Capacity: {table.capacity}</p>
            <p className='mx-2' data-table-id-status={table.table_id}>Status: {table.reservation_id ? 'Occupied' : 'Free'}</p>
        </div>
    )
}