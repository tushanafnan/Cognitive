import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import LinearProgress from '@mui/material/LinearProgress';
import "bootstrap/dist/css/bootstrap.min.css";
import getyourreport2 from "../Files/getyourreport2.png";
import "./getyourreport.css";
import Box from "@mui/material/Box";
import MaterialCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MaterialContainer from "@mui/material/Container";
import Avatar from "@material-ui/core/Avatar";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CircularProgress from '@mui/material/CircularProgress';
import Footer from "../Footer/Footer";
import database from "../firedb";

class GetYourReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: "",
      fileContent: "",
      list: [],
      dict: [],
      genoTypes: [],
      commonGenoTypes: [],
      genotypeSnps: [],
      genotypeDescription: [],
      genotypeCitations: [],
      Alleles: [],
      visible: true,
    };
  }
  handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      this.setState({ fileName: file.name, fileContent: reader.result });
      this.state.list = this.state.fileContent
        .toString()
        .replace(/\n/g, " ")
        .replace(/^.*#.*$/gm, "")
        .split(" ");
      this.state.list.map((rnaMap) =>
        this.state.dict.push({
          key: rnaMap.split(/\s+/).slice(0, 1),
          value:
            "(" +
            rnaMap.split(/\s+/).slice(3, 4) +
            ", " +
            rnaMap.split(/\s+/).slice(4, 5) +
            ")",
        })
      );
      this.findGenoTypeDescription();
      this.forceUpdate();
    };
    reader.onerror = () => {
      console.log("file error", reader.error);
    };
  };
  componentDidMount() {
    this.setState({ loading: true });

    if (localStorage.getItem("data")) {
      this.setState({
        genoTypes: JSON.parse(localStorage.getItem("data")),
        loading: false,
      });
    } else {
      this.props.firebase.snps().on("value", (snapshot) => {
        localStorage.setItem("data", JSON.stringify(snapshot.val()));
      });
    }
  }

  comparingData() {
    let status = false;
    const dataToSave = [];
    this.state.dict.map((dictMap) =>
      this.state.genoTypes.map((genoTypeMap, index) => {
        if (
          String(dictMap.key[0]).toLowerCase() ==
          String(genoTypeMap.SNP).toLowerCase() &&
          dictMap.value == genoTypeMap.Alleles
        ) {
          status = true;
          dataToSave[index] = {
            GenotypeDescription: genoTypeMap.GenotypeDescription,
            genotypeCitations: genoTypeMap.Citation1 + genoTypeMap.Citation2 + genoTypeMap.Citation3 + genoTypeMap.Citation4 + genoTypeMap.Citation5,
            genotypeSnps: dictMap.key[0],
            Alleles: genoTypeMap.Alleles
          }
          this.state.genotypeDescription.push(genoTypeMap.GenotypeDescription);
          this.state.genotypeCitations.push(
            genoTypeMap.Citation1 +
            genoTypeMap.Citation2 +
            genoTypeMap.Citation3 +
            genoTypeMap.Citation4 +
            genoTypeMap.Citation5
          );
          this.state.genotypeSnps.push(dictMap.key);
          this.state.Alleles.push(genoTypeMap.Alleles);
        }
      })
    );

    if (status) {
      this.state.visible = false;
      database.ref("Reports").push({
        user: localStorage.getItem("user"),
        data: dataToSave,
        fileName: this.state.fileName
      });
    } else {
      alert("nothing found to show");
    }
  }

  findGenoTypeDescription() {
    database.ref("Reports").get().then((snapshot) => {
      if (snapshot.exists()) {
        Object.values(snapshot.val()).filter(d => d.user === localStorage.getItem("user")).map( val =>   {
          if (val.fileName === this.state.fileName) {
            console.log(val);
            alert("change your file name!");
          } else {
            this.comparingData();
          }
        })
      } else {
        this.comparingData();
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <>
        <div className="get-your-report-main-container ">
          {this.state.visible && (
            <div className="" style={{ width: "100%", height: "100vh" }}>
              <div style={{ width: "100%" }}>
                <div
                  className="pic1getYourReport"
                  style={{ width: "100%", height: "100vh" }}
                >
                  <div
                    className="pic2getYourReport"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <div className="get-report-inner-container">
                      <div
                        style={{
                          width: "100%",
                          maxWidth: "1320px",
                          height: "100%",
                          margin: "auto",
                          position: "relative",
                          paddingTop: "40px",
                        }}
                      >
                        <h2 className="card-title getYourReportTextHeader">
                          Get your DNA report
                        </h2>
                        <h3 className="card-text getYourReportTextPara">
                          1. Drop or select your DNA data file from your device
                        </h3>
                        <h5 className="card-text getYourReportTextPara2">
                          Please make sure your file is compatible with our
                          conditions to read your data.
                        </h5>
                        <span
                          className="report-para"
                          style={{ color: "white" }}
                        >
                          Fusce ut placerat orci nulla pellentesque
                        </span>
                        <span
                          className="report-para"
                          style={{ color: "white" }}
                        >
                          Accumsan lacus vel facilisis volutpat
                        </span>
                        <span
                          className="report-para"
                          style={{ color: "white" }}
                        >
                          Fusce ut placerat orci nulla pellentesque
                        </span>
                        <div className="getYourreportUpload">
                          <input
                            className="file-field"
                            type="file"

                            onChange={this.handleFileChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {
            //Report
            <MaterialContainer maxWidth="md" component="main">
              <Box
                sx={{
                  width: "100%",
                  padding: "20px",
                }}
              >
                <Typography variant="h1" style={{ color: "#032E54" }}>
                  Cognitive Report
                </Typography>
              </Box>
              <Grid container spacing={5} alignItems="flex-end">
                {this.state.genotypeDescription.map((item, index) => (
                  // data paisi state.genotypeDescription array
                  // Enterprise card is full width at sm breakpoint
                  <Grid item xs={12} sm={6} md={4}>
                    <MaterialCard
                      sx={{
                        minHeight: "500px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardHeader
                        title={String(
                          this.state.genotypeSnps[index]
                        ).toUpperCase()}
                        titleTypographyProps={{ align: "left" }}
                        sx={{
                          backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                              ? theme.palette.grey[200]
                              : theme.palette.grey[700],
                        }}
                        action={
                          <Stack direction="row" spacing={2}>
                            <Avatar style={{ backgroundColor: "#08C5B6" }}>
                              {this.state.Alleles[index]
                                .replace(/[^a-z]/gi, "")
                                .slice(0, 1)}
                            </Avatar>
                            <Avatar style={{ backgroundColor: "#545454" }}>
                              {this.state.Alleles[index]
                                .replace(/[^a-z]/gi, "")
                                .slice(1, 2)}
                            </Avatar>
                          </Stack>
                        }
                      />
                      <CardContent>
                        <ul>{item}</ul>
                        <Tooltip title={this.state.genotypeCitations[index]}>
                          <IconButton>
                            <FormatQuoteIcon />
                          </IconButton>
                        </Tooltip>
                      </CardContent>
                    </MaterialCard>
                  </Grid>
                ))}
              </Grid>
            </MaterialContainer>
          }
        </div>

        <div className="mt-5">
          <Footer />
        </div>
      </>
    );
  }
}

export default withFirebase(GetYourReport);