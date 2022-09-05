/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MaterialContainer from "@mui/material/Container";
import { useParams } from "react-router-dom";
import database from "../firedb";
import Footer from './../Footer/Footer';

const ReportDetails = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState([]);

  useEffect(() => {
    const reports = database.ref("Reports");
    reports.on("value", (snapshot) => {
      const report = snapshot.val();
      const reports = Object.values(report);
      setReport(reports);
    });
  }, []);
  const matchedReport = report.find((reports) => reports.fileName == reportId);

  return (
    <div>

      <div style={{color:"red"}}>
        <h4> Alleles:{matchedReport?.data.map(data => <div>{data.Alleles}</div>)}</h4>
        <h4> Description:{matchedReport?.data.map(data => <div>{data.GenotypeDescription}</div>)}</h4>
        <h4> Citations:{matchedReport?.data.map(data => <div>{data.genotypeCitations}</div>)}</h4>
        <h4> SNP:{matchedReport?.data.map(data => <div>{data.genotypeSnps}</div>)}</h4>
      </div>
      <Footer />
    </div>
  );
};

export default ReportDetails;