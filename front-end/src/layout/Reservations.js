import React, {useState, useEffect, Fragment} from "react";
import {listReservations} from "../utils/api"
//import Menu from "./Menu";


function RenderReservation({reservation}) {
    console.log(typeof reservation)
    console.log(Array.from(reservation))
    return Object.entries(reservation).map(([key, value], index = 0) => {
        console.log(key, value)
        return (
            <div key={index}>
                <p>{key}</p>
                <p>{value}</p>
            </div>
        )
    })
}

export default function Reservations() {
    const [reservations, setReservations] = useState([])

    useEffect(() => {
        listReservations({date: "2020-12-30"})
            .then(data => setReservations(data))
    }, [])

    const list = reservations.map((info) => {
        return <RenderReservation reservation={info} />
    })

    console.log(reservations)
    return (
        <div>
            <p>hello</p>
            <p>{list}</p>
        </div>
    )
}