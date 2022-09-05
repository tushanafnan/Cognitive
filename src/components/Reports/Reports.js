/* eslint-disable eqeqeq */
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import database from "../firedb";
import { useHistory } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { Button } from '@material-ui/core';
import Footer from './../Footer/Footer';
const Reports = () => {
  const history = useHistory();
  const [report, setReport] = useState([]);

  useEffect(() => {
    const reports = database.ref("Reports");
    reports.on("value", (snapshot) => {
      const report = snapshot.val();
      const users = Object.values(report).map((data) => data.user);
      const local = JSON.parse(localStorage.getItem("user"));
      if (local == users) {
        setReport(Object.values(report));
      }

    });
  }, []);

  const handleShowReportDetails = (fileName) => {
    history.push(`/reportdetails/${fileName}`);
  };
  return (
    <div>
      <div>
        {Object.values(report).map((report, index) => {
          const { fileName } = report;
          return (

            <Box className="blog-article-right-part blog-article-part" key={fileName}>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  handleShowReportDetails(fileName);
                }}
              >
                {fileName}
              </Button>
            </Box>
          )
        })}
      </div>
      <Footer />
    </div>
  );
};

export default Reports;