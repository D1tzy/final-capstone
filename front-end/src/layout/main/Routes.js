import React from "react";

import { Redirect, Route, Switch, useParams } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "../NotFound";
import { today } from "../../utils/date-time";
import useQuery from "../../utils/useQuery";
import CreateReservation from "../CreateReservation/CreateReservation";
import CreateTable from "../CreateTable/CreateTable";
import SeatReservation from "../../SeatReservation/SeatReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */


function Routes() {
  const date = useQuery().get("date")
  const { reservationId } = useParams()

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path='/reservations/:reservation_id/seat'>
        <SeatReservation reservation={reservationId} />
      </Route>
      <Route path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date ? date : today()}/>
      </Route>
      <Route path='/tables/new'>
        <CreateTable />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
