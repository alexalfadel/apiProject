import React from "react";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormModal";
import SignupFormPage from "./components/SignupFormModal";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/AllSpots";
import SpotDetails from "./components/SpotDetails";
import NewSpotForm from "./components/NewSpotForm";
import ManageSpots from "./components/ManageSpots";
import UpdateSpotForm from "./components/UpdateSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (

      <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && 
        <Switch>
          <Route exact path='/'>
            <AllSpots />
          </Route>
          <Route exact path='/spots/new'>
            <NewSpotForm />
          </Route>
          <Route exact path='/spots/current'>
            <ManageSpots />
          </Route>
          <Route path='/spots/:spotId/edit'>
            <UpdateSpotForm />
          </Route>
          <Route path='/spots/:spotId'>
              <SpotDetails />
          </Route>
          
          

        </Switch>}
    </>

  );
}

export default App;
