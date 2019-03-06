import React, { Fragment } from "react";
import * as moment from "moment";

export default ({ experiences, type }) => {
  return (
    <>
      {experiences && experiences.length > 0 && (
        <div className="col-md-6">
          <h3 className="text-center text-info">{type}</h3>
          <ul className="list-group">
            {experiences.map((exp, i) => (
              <Fragment key={i}>
                <li className="list-group-item">
                  <h4>{type === "Experience" ? exp.company : exp.school}</h4>
                  <p>
                    {moment(exp.from).format("MMM YYYY")} -{" "}
                    {exp.current ? "Now" : moment(exp.to).format("MMM YYYY")}
                  </p>
                  <p>
                    <strong>
                      {type === "Experience" ? "Position" : "Degree"}:
                    </strong>{" "}
                    {type === "Experience" ? exp.title : exp.degree}
                  </p>
                  <p>
                    <strong>Description:</strong> {exp.description}
                  </p>
                </li>
              </Fragment>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
