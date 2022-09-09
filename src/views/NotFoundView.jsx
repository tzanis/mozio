import React from 'react';

import { Link } from "react-router-dom";

const NotFoundView = () => {
  return (
    <div className="text-center">
      <h1 className="mb-5">
        Page not found.
      </h1>
      <Link to="/">&laquo; Perform new search</Link>
    </div>
  );
};

export default NotFoundView;
