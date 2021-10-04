import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { listReservations, listTables } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import Header from "../../Header-Footer/Header";
import Reservation from "./Reservation";
import Table from "./Table"
import { previous, today, next } from '../../utils/date-time'

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory()
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([])
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    setReservations([])
    setTables([])
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
    return () => abortController.abort();
  }
  console.log(tables)
  return (
    <>
      <Header page="Dashboard" />
      <main className='container d-flex'>
        <div className="col-6 my-4">
          <h3 className="mb-3 text-center text-white">Reservations for date: {date}</h3>
          <div className='d-flex my-3 justify-content-around'>
            <button className='' onClick={event => history.push(`/dashboard?date=${previous(date)}`)}>Previous</button>
            <button className='' onClick={event => history.push(`/dashboard?date=${today()}`)}>Today</button>
            <button className='' onClick={event => history.push(`/dashboard?date=${next(date)}`)}>Forward</button>
          </div>
          <ErrorAlert error={reservationsError} />
          {(reservations.map((reservation) => <Reservation reservation={reservation} />))}
        </div>
        <div className='col-6 mt-4 mb-5'>
          <h3 className="mb-3 text-center text-white">Tables:</h3>
          {(tables.map((table) => <Table table={table} />))}
        </div>
      </main>
    </>
  );
}

export default Dashboard;
