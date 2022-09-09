import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { mockCalculateDistancesApiCall } from '../utils/utils';

const ResultsView = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calculations, setCalculations] = useState(null);
  const searchParamsObj = {
    cityOfOrigin: searchParams.get('cityOfOrigin'),
    intermediateCities: searchParams.getAll('intermediateCities'),
    cityOfDestination: searchParams.get('cityOfDestination'),
    passengersCount: searchParams.get('passengersCount'),
    date: searchParams.get('date'),
  };

  const sendCalculateRequest = async () => {
    try {
      const response = await mockCalculateDistancesApiCall(searchParamsObj);
      if (response.data) {
        setCalculations(response.data)
      }
      setIsLoading(false);

    } catch (e) {
      setIsLoading(false);
      setError(e.message);
      // TODO: setErrors({ [fieldName]: 'Something went wrong. Please try again in a few seconds.' })
    }

    return [];
  };

  useEffect(() => {
    sendCalculateRequest();
  }, []);

  return (
    <div className="container">
      <h1 className="mt-5 mb-3 text-center">Results</h1>

      <div className="text-center">
        City Of Origin: <strong>{searchParamsObj?.cityOfOrigin}</strong>,
        City Of Destination: <strong>{searchParamsObj?.cityOfDestination}</strong> <br />
        Intermediate Cities: <strong>{searchParamsObj.intermediateCities}</strong><br />
        Nr. of passengers: <strong>{searchParamsObj?.passengersCount}</strong>,
        Date: <strong>{searchParamsObj?.date}</strong>
      </div>

      {isLoading && (
        <div className="text-center mt-5">
          Calculating. Please wait...
        </div>
      )}

      {error && (
        <div className="text-center text-danger mt-5">
          {error}
        </div>
      )}

      {calculations && (
        <div className="text-center mt-5">
          <h4>Total Distance:</h4>
          Total distance: <strong>{`${calculations.totalDistance} km`}</strong>
          <br />

          <h4 className="mt-5">Breakdown:</h4>
          <ul className="list-group col-12 col-md-8 offset-md-2  col-lg-6 offset-lg-3 mt-3">
            {calculations.subsequentDistances.map(route => (
              <li
                key={route.from}
                className="list-group-item"
              >
                {`${route.from} → ${route.to}:`} <strong>{route.distance} km</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center my-5">
        <Link
          className="btn btn-outline-secondary me-2"
          to={{
            pathname: '/',
            search: searchParams.toString(),
          }}
        >
          &laquo; Refine search
        </Link>

        {` or `}

        <Link
          to="/"
          className="btn btn-outline-secondary ms-2"
        >
          Start new search
        </Link>
      </div>

    </div>
  );
};

export default ResultsView;
