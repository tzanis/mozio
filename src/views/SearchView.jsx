import React from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchForm  from "../components/SearchForm";


const SearchView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchParamsObj = {
    cityOfOrigin: searchParams.get('cityOfOrigin'),
    cityOfDestination: searchParams.get('cityOfDestination'),
    intermediateCities: searchParams.getAll('intermediateCities'),
    passengersCount: searchParams.get('passengersCount'),
    date: searchParams.get('date'),
  };

  const onSubmit = async (values) => {
    const searchParams = new URLSearchParams();
    searchParams.append('cityOfOrigin', values?.cityOfOrigin);
    searchParams.append('cityOfDestination', values?.cityOfDestination);
    searchParams.append('passengersCount', values?.passengersCount);
    searchParams.append('date', values?.date);

    if (Array.isArray(values.intermediateCities)) {
      values.intermediateCities.forEach(city => {
        searchParams.append('intermediateCities', city);
      });
    }

    navigate({
      pathname: '/results',
      search: searchParams.toString()
    })
  }

  return (
    <div className="container">
      <h1 className="mt-5 mb-3 text-center">Choose destinations</h1>
      <SearchForm
        initialValues={searchParamsObj}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default SearchView;
