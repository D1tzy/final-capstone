import React, { useState } from 'react'
import Header from '../../Header-Footer/Header'
import { useHistory } from 'react-router'
import { createTable } from '../../utils/api'

export default function CreateTable() {
    const history = useHistory()

    const initialFormState = {
        table_name: "",
        capacity: 1,
    }

    const [formData, setFormData] = useState(initialFormState)
    const [tableErrors, setTableErrors] = useState(null)

    function submitHandler(event) {
        event.preventDefault();

        const abortController = new AbortController()

        createTable(formData, abortController.signal)
            .then(() => history.push('/'))
            .catch(setTableErrors)
    }

    function changeHandler({target}) {
        let value = target.value;

        if(target.name === "capacity"){
            if(value < 1)
                 value = 1;
         value = Number(value);
        }
        setFormData({
            ...formData,
            [target.name]: value,
        });
    };

    return (
        <>  
            <Header page='Create Table' />
            <h1 className='text-center py-4'>New Table Information</h1>
            <form onSubmit={submitHandler}className='d-flex flex-direction-row justify-content-around text-center'>
                <div className=''>
                    <label className='mx-3'>Table Name</label>
                    <input required type='text' name='table_name' onChange={changeHandler}/>
                </div>
                <div className=''>
                    <label className='mx-3'>Capacity</label>
                    <input required type='number' name='capacity' onChange={changeHandler}/>
                </div>
                <button type='cancel' onClick={history.goBack}>Cancel</button>
                <button type='submit'>Submit</button>
            </form>
        </>
    )
}