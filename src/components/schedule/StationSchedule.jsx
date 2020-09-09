import React, { Component } from "react";
import axios from "axios";
import { Container } from "reactstrap";
import moment from "moment";
import { Helmet } from "react-helmet";
import Config from "../../Config";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "../../style/searchStyle.module.css";
import EditScheduleModal from "../modals/EditScheduleModal";
import DeleteScheduleModal from "../modals/DeleteScheduleModal";
import {
  Menu,
  MenuItem,
  Button,
  Snackbar,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import { Link } from "react-router-dom";
import { getTrainDescription } from "../../utils/utils";
import EditStationModal from "../modals/EditStationModal";

const useStyles = (theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
});

class StationSchedule extends Component {
  state = {
    stationLoading: true,
    scheduleLoading: true,
    station: {},
    stops: [],
    editStopData: {
      id: "",
      ah: "",
      am: "",
      dh: "",
      dm: "",
      platform: "",
      station: "",
      train: "",
    },
    deleteStopData: {
      trainName: "",
      trainStopId: 0,
    },
    showEditModal: false,
    showDeleteStopModal: false,
    showEditStationModal: false,
    anchorEl: null,
    menuStop: null,
    alert: {
      open: false,
      text: "",
      level: "",
    },
  };

  componentDidMount() {
    const { name } = this.props.match.params;
    axios
      .get(`${Config.API_HOST}/api/station/name/${name}`)
      .then((response) => {
        this.setState({
          station: response.data,
          stationLoading: false,
        });
      });
    axios
      .get(`${Config.API_HOST}/api/schedule/station/name/${name}`)
      .then((response) => {
        this.setState({
          stops: response.data,
          scheduleLoading: false,
        });
      });
  }

  showEditTrainStopModal = (visible) => {
    this.setState({
      showEditModal: visible,
    });
  };

  showDeleteTrainStopModal = (visible) => {
    this.setState({
      showDeleteStopModal: visible,
    });
  };

  handleMenuBtnClick = (event, stop) => {
    this.setState({
      anchorEl: event.currentTarget,
      menuStop: stop,
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  render() {
    let { stationLoading, scheduleLoading } = this.state;
    const { classes } = this.props;
    let body;
    if (stationLoading || scheduleLoading) {
      body = <CircularProgress className={styles.centerScreen} />;
    } else {
      let stops = this.state.stops.map((stop) => {
        let arrival = "N/A";
        let departure = "N/A";
        if (stop.trainSource !== this.state.station.name) {
          arrival = moment(`${stop.ah}:${stop.am}`, "HH:mm").format("hh:mm a");
        }
        if (stop.trainDestination !== this.state.station.name) {
          departure = moment(`${stop.dh}:${stop.dm}`, "HH:mm").format(
            "hh:mm a"
          );
        }
        const trainName = getTrainDescription(
          stop.trainName,
          stop.trainSource,
          stop.trainDestination
        );

        return (
          <Grid item xs={12} sm={6} md={4} key={stop.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {trainName}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  Train Type : {stop.trainType}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  Runs on : {stop.trainAvailability}
                </Typography>
                <Typography variant="body1">Arrival : {arrival}</Typography>
                <Typography variant="body1">Departure : {departure}</Typography>
                <Typography variant="body1">
                  {stop.platform ? `Platform: ${stop.platform}` : ""}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={`/schedule/train/${stop.trainId}`}>
                  <Button variant="contained" color="primary" size="small">
                    Schedule
                  </Button>
                </Link>
                <Button
                  color="secondary"
                  variant="contained"
                  aria-haspopup="true"
                  aria-controls="simple-menu"
                  size="small"
                  className={classes.margin}
                  onClick={(event) => this.handleMenuBtnClick(event, stop)}
                >
                  More..
                </Button>
              </CardActions>
            </Card>
          </Grid>
        );
      });
      body = (
        <>
          <Grid container spacing={1} direction="column">
            <h3 className="p-2 text-center">
              Station Schedule - {this.state.station.name}
            </h3>

            <Grid container item>
              <Grid item >
              <Typography variant="body1" display="inline">
                Telephone : &nbsp;
              </Typography>
              <Typography variant="body2" display="inline">
                {this.state.station.tel?this.state.station.tel:"Not Available"}
              </Typography>
              </Grid>
            </Grid>

            <Grid container item justify="flex-end">
              <Button
                variant="contained"
                color="primary"
                href="/trains/new"
                className={classes.margin}
              >
                Add New Train
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.editStation}
                className={classes.margin}
              >
                Edit Station
              </Button>
            </Grid>
            <Grid container item spacing={1}>
              {stops}
            </Grid>
          </Grid>

          <Menu
            id="actions-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                this.editStop(
                  this.state.menuStop.id,
                  this.state.menuStop.ah,
                  this.state.menuStop.am,
                  this.state.menuStop.dh,
                  this.state.menuStop.dm,
                  this.state.menuStop.platform,
                  this.state.menuStop.trainName,
                  this.state.menuStop.trainSource,
                  this.state.menuStop.trainDestination
                );
                this.handleMenuClose();
              }}
            >
              Edit Time or Platform
            </MenuItem>
            <MenuItem
              onClick={() => {
                this.deleteStop(
                  this.state.menuStop.id,
                  this.state.menuStop.trainName
                );
                this.handleMenuClose();
              }}
            >
              Delete
            </MenuItem>
          </Menu>
          <Snackbar
            open={this.state.alert.open}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            autoHideDuration={5000}
            onClose={this.handleClose}
          >
            <MuiAlert
              elevation={6}
              varient="filled"
              onclose={this.handleClose}
              severity={this.state.alert.level}
            >
              {this.state.alert.text}
            </MuiAlert>
          </Snackbar>
          <EditScheduleModal
            isOpen={this.state.showEditModal}
            setOpen={this.toggleEditModal}
            trainStop={this.state.editStopData}
          />
          <DeleteScheduleModal
            isOpen={this.state.showDeleteStopModal}
            setOpen={this.toggleDeleteModal}
            stationName={this.state.station.name}
            trainName={this.state.deleteStopData.trainName}
            trainStopId={this.state.deleteStopData.trainStopId}
          />
          <EditStationModal
            isOpen={this.state.showEditStationModal}
            setOpen={this.toggleEditStationModal}
            station={this.state.station}
          />
        </>
      );
    }
    let title = `Schedule of ${this.state.station.name} Station | Trains - Sri Lanka`;
    let description = `The Schedule/Timetable of the ${this.state.station.name} railway station, with arrival/departure times and other details of trains`;
    return (
      <Container>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Helmet>
        {body}
      </Container>
    );
  }

  toggleEditModal = (isOpen, alert, level) => {
    let alertOb = {
      ...this.state.alert,
    };
    if (alert) {
      alertOb = {
        open: true,
        text: alert,
        level: level ? level : "info",
      };
    }
    this.setState({
      alert: alertOb,
      showEditModal: isOpen,
    });
  };

  toggleDeleteModal = (isOpen, alert, level) => {
    let alertOb = {
      ...this.state.alert,
    };
    if (alert) {
      alertOb = {
        open: true,
        text: alert,
        level: level ? level : "info",
      };
    }
    this.setState({
      alert: alertOb,
      showDeleteStopModal: isOpen,
    });
  };

  toggleEditStationModal = (isOpen, alert, level) => {
    let alertOb = {
      ...this.state.alert,
    };
    if (alert) {
      alertOb = {
        open: true,
        text: alert,
        level: level ? level : "info",
      };
    }
    this.setState({
      alert: alertOb,
      showEditStationModal: isOpen,
    });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({
      alert: {
        open: false,
      },
    });
  };

  deleteStop = (id, trainName) => {
    let deleteStopData = {
      trainName: trainName,
      trainStopId: id,
    };
    this.setState({
      deleteStopData: deleteStopData,
      showDeleteStopModal: true,
    });
  };

  editStop = (
    id,
    ah,
    am,
    dh,
    dm,
    platform,
    trainName,
    trainSource,
    trainDestination
  ) => {
    let trainDesc = {
      name: trainName,
      startStation: trainSource,
      endStation: trainDestination,
    };
    let station = this.state.station.name;
    this.setState({
      editStopData: {
        id,
        ah,
        am,
        dh,
        dm,
        platform,
        station,
        train: trainDesc,
      },
      showEditModal: true,
    });
  };

  editStation = () =>{
    this.setState({
      showEditStationModal: true,
    });
  }

  onTrainStopUpdated(id, ah, am, dh, dm, platform) {
    let stops = this.state.stops;
    stops.forEach(function (stop) {
      if (stop.id === id) {
        stop.ah = ah;
        stop.am = am;
        stop.dh = dh;
        stop.dm = dm;
        stop.platform = platform;
      }
    });
    this.setState({
      stops: stops,
    });
  }

  toggleEditStop() {
    this.setState({
      showEditModal: !this.state.showEditModal,
    });
  }

  onTrainUpdated(id, name, avb, classes, type) {
    let stops = this.state.stops;
    stops.forEach((stop) => {
      if (stop.trainId === id) {
        stop.trainName = name;
        stop.trainType = type;
        stop.trainAvailability = avb;
      }
    });
    this.setState({
      stops: stops,
    });
  }
}
export default withStyles(useStyles)(StationSchedule);
