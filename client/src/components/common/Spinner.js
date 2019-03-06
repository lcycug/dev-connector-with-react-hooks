import React from "react";
import spinner from "../../img/spinner.gif";

export default function Spinner() {
  return (
    <div>
      <img
        style={{ margin: "auto", width: "200px", display: "block" }}
        src={spinner}
        alt="Loading"
      />
    </div>
  );
}
