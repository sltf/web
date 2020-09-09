import React, { Component } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import styles from "../../style/searchStyle.module.css";
import Config from "../../Config";
import { Helmet } from "react-helmet";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import { Container, Grid, Button } from "@material-ui/core";
import playstoreImg from '../../images/playstore.png'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class SearchPage extends Component {
  state = {
    loading: true,
    allStations: [],
    sourceStation: null,
    destinationStation: null,
    time: null,
    date: null,
    error: null,
  };

  componentDidMount() {
    axios.get(`${Config.API_HOST}/api/station/list`).then((response) => {
      this.setState({
        allStations: response.data,
        loading: false,
      });
    });
  }

  setSourceStation = (e, v) => {
    this.setState({
      sourceStation: v,
    });
  };
  setDestinationStation = (e, v) => {
    this.setState({
      destinationStation: v,
    });
  };

  handleDepartureTimeChange = (date) => {
    let { time } = this.state;
    time = date.format("hh:mmA");
    this.setState({ time });
  };
  handleDepartureDateChange = (v) => {
    let { date } = this.state;
    date = v.format("YYYY-MM-DD");
    this.setState({ date });
  };

  handleSnackBarOnClose = () => {
    this.setState({ error: null });
  };

  search = () => {
    let { sourceStation, destinationStation, time, date } = this.state;
    let url;
    if (!sourceStation || sourceStation.name === null) {
      this.setState({
        error: "Please provide the station you want to search from",
      });
      return;
    }
    if (!destinationStation || destinationStation.name === null) {
      this.setState({ error: "Please provide the station you want to go to" });
      return;
    }
    url = `/schedule/from/${sourceStation.name}/to/${destinationStation.name}`;

    if (date !== null) {
      if (time !== null) {
        url = `${url}/${time}/onward/on/${date}`;
      } else {
        url = `${url}/12:00AM/onward/on/${date}`;
      }
    } else if (time !== null) {
      url = `${url}/${time}/onward`;
    }

    if (url) {
      window.location = url;
    }
  };

  swap = () => {
    let { sourceStation, destinationStation } = this.state;
    let originalSource = sourceStation;
    sourceStation = destinationStation;
    destinationStation = originalSource;
    this.setState({ sourceStation, destinationStation });
  };

  render() {
    let body;
    if (this.state.loading) {
      body = <CircularProgress className={styles.centerScreen} />;
    } else {
      let destinationName = this.state.destinationStation
        ? this.state.destinationStation.name
        : "";
      let sourceName = this.state.sourceStation
        ? this.state.sourceStation.name
        : "";
      let startStations = this.state.allStations
        .filter((station) => station.name !== destinationName)
        .sort((s1, s2) => {
          return s1.name < s2.name ? -1 : 1;
        });
      let endStations = this.state.allStations
        .filter((station) => station.name !== sourceName)
        .sort((s1, s2) => {
          return s1.name < s2.name ? -1 : 1;
        });
      let time = this.state.time ? moment(this.state.time, "hh:mmA") : moment();
      let date = this.state.date
        ? moment(this.state.date, "YYYY-MM-DD")
        : moment();
      body = (
        <>
          <h2 className={`${styles.center} ${styles.pageHead}`}>
            Search Trains
          </h2>
          <br />

          <p className={styles.center}>
            To start, let us know where you are and where you need to go to
          </p>
          <Grid container direction="column" spacing={2}>
            <Grid item container justify="center">
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  id="source"
                  onChange={this.setSourceStation}
                  options={startStations}
                  getOptionLabel={(station) => station.name}
                  value={this.state.sourceStation}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="I'm at"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item container justify="center">
              <Grid item>
                <Button size="sm" outline onClick={this.swap}>
                  <SwapVertIcon />
                </Button>
              </Grid>
            </Grid>
            <Grid item container justify="center">
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  id="destination"
                  onChange={this.setDestinationStation}
                  options={endStations}
                  getOptionLabel={(station) => station.name}
                  value={this.state.destinationStation}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="I want to go to"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item container justify="center">
              <Grid item container sm={6} xs={12} spacing={2}>
                <Grid item xs={12} sm={6}>
                  <MuiPickersUtilsProvider utils={MomentUtils} id="time">
                    <KeyboardDatePicker
                      label="Date"
                      onChange={this.handleDepartureDateChange}
                      value={date}
                      fullWidth={true}
                      KeyboardButtonProps={{
                        "aria-label": "Change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <MuiPickersUtilsProvider utils={MomentUtils} id="time">
                    <KeyboardTimePicker
                      label="Departure time"
                      onChange={this.handleDepartureTimeChange}
                      value={time}
                      fullWidth={true}
                      KeyboardButtonProps={{
                        "aria-label": "Change time",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
            </Grid>
            <Grid item container justify="center">
              <Grid item sm={6} xs={12} justify="flex-end">
                <span className={styles.compRightAlign}>
                  <Button
                    color="primary"
                    onClick={this.search}
                    variant="contained"
                    size="large"
                  >
                    Search
                  </Button>
                </span>
              </Grid>
            </Grid>
            <hr/>
            <Grid item container justify="center">
              <Grid item sm={3} xs={8} justify="center">
              <a href={"https://play.google.com/store/apps/details?id=org.pulasthi.tfsl.android"}>
                <img src={playstoreImg} height={"auto"} width={"100%"} alt="Download at PlayStore"/></a>
            
              </Grid>
            {/* <p/>
            <p>Or scan the QR code</p>
            </Col>
            <Col className="col-md-2">
            <img src={qrCode} height={"auto"} width={"100%"}/>
            </Col> */}
            </Grid>
          </Grid>
          <Snackbar
            open={this.state.error !== null}
            autoHideDuration={5000}
            onClose={this.handleSnackBarOnClose}
          >
            <Alert severity="error">{this.state.error}</Alert>
          </Snackbar>
        </>
      );
    }
    return (
      <Container>
        <Helmet>
          <title>Search Trains | Trains Sri Lanka</title>
          <meta
            name="description"
            content="Search train schedules in Sri Lanka smartly, View timetables of trains and railway stations, and many more"
          />
        </Helmet>
        {body}
      </Container>
    );
  }
}
