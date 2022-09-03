import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import database from "../firedb";

const Reports = () => {
    const [report, setReport] = useState([]);

    useEffect(() => {
        const reports = database.ref("Reports");
        reports.on("value", (snapshot) => {
          const report = snapshot.val();
          const Reports= Object.values(report);
          setReport(Reports);
        });
      }, []);
    return (
        <div>
            {Object.values(report).map((report, index) => {
                  const { fileName } = report;
                  return ( <h2>{fileName}</h2>);
            })};
        </div>
    );
};

export default Reports;