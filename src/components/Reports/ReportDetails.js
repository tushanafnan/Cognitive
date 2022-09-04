import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MaterialContainer from "@mui/material/Container";
import { useParams } from "react-router-dom";
import database from "../firedb";

const ReportDetails = () => {
        const { reportId } = useParams();
        const [report, setReport] = useState([]);

        useEffect(() => {
            const reports = database.ref("Reports");
            reports.on("value", (snapshot) => {
              const report = snapshot.val();
              const reports= Object.values(report);
              setReport(reports);
            });
          }, []);
        const matchedReport= report.find((reports) => reports.fileName == reportId);
        
        console.log (matchedReport);
      
    return (
        <div>
   
             
         
               <h2> {matchedReport?.fileName} </h2>
               <h2> {matchedReport?.title} </h2>
               <h2> {matchedReport?.description} </h2>

         
        </div>
    );
};

export default ReportDetails;