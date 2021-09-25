import React, { useEffect, useState } from "react";
import { listReservations } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import Header from "../../Header/Header";

function ReservationsList({reservations}) {
  if (reservations.length === 0) return <p>None found</p>
  const data = () => {
    let newData
    Array.from(reservations).forEach((person) => {
      console.log(person)
      Object.entries(person).forEach(([key, value]) => {
        console.log(key, value)
        newData += `${key} ${value}`
      })
    })
    return newData
  }

  console.log(data())
  return data()
}

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }


  return (
    <>
      <Header page="Dashboard" />
      <main>
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">Reservations for date: {date}</h4>
        </div>
        <ErrorAlert error={reservationsError} />
        {JSON.stringify(reservations)}
        <ReservationsList reservations={reservations} />
      </main>
    </>
  );
}

export default Dashboard;
