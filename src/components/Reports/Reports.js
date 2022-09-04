import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import database from "../firedb";
import { useHistory } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { Button } from '@material-ui/core';

const Reports = () => {
  const history = useHistory();
    const [report, setReport] = useState([]);

    useEffect(() => {
        const reports = database.ref("Reports");
        reports.on("value", (snapshot) => {
          const report = snapshot.val();
          const Reports= Object.values(report);
          setReport(Reports);
        });
      }, []);
      const handleShowReportDetails = (fileName) => {
        history.push(`/reportdetails/${fileName}`);
      };
    return (
       <div>
            {Object.values(report).map((report, index) => {
                  const {  fileName } = report;
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
                    
                    )})}
            
            </div>
    );
};

export default Reports;