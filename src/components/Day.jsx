import React, { Component } from "react";
import { Link, useParams } from "react-router-dom";

function Day() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();

  return (
    <div>
      <h3>ID: {id}</h3>
      <Link to="/">
        <span>Go back to calendar!</span>
      </Link>
    </div>
  );
}

export default Day;
