import React, { Component } from "react";
import axios from "axios";
import { Container } from "reactstrap";
import { getTrainDescription } from "../../utils/utils";
import { Helmet } from "react-helmet";
import Config from "../../Config";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "../../style/searchStyle.module.css";
import LocalTime from "../fragments/LocalTime";
import EditTrainModal from "../modals/EditTrainModal";
import EditScheduleModal from "../modals/EditScheduleModal";
import NewTrainStopModal from "../modals/NewTrainStopModal";
import {
  Button,
  Menu,
  MenuItem,
  Snackbar,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
} from "@material-ui/core";
import DeleteScheduleModal from "../modals/DeleteScheduleModal";
import MuiAlert from "@material-ui/lab/Alert";
import DeleteTrainModal from "../modals/DeleteTrainModal";
import { Link } from "react-router-dom";
import MergeTrainModal from "../modals/MergeTrainModal";

class TrainSchedule extends Component {
  state = {
    trainLoading: true,
    scheduleLoading: true,
    train: {},
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
      id: "",
      stationName: "",
      trainName: "",
    },
    confirmationMsg: null,
    confirmationCb: null,
    showEditModal: false,
    showEditTrainModal: false,
    showAddStopModal: false,
    showDeleteStopModal: false,
    showDeleteTrainModal: false,
    showMergeTrainModal:false,
    anchorEl: null,
    menuStop: null,
    alert: {
      open: false,
      text: "",
      level: "",
    },
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    axios.get(`${Config.API_HOST}/api/train/${id}`).then((response) => {
      this.setState({
        train: response.data,
        trainLoading: false,
      });
    });
    axios
      .get(`${Config.API_HOST}/api/schedule/train/${id}`)
      .then((response) => {
        this.setState({
          stops: response.data,
          scheduleLoading: false,
        });
      });
  }

  toggleEditTrainModal = (isOpen, alert, level) => {
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
      showEditTrainModal: isOpen,
    });
  };

  showEditTrainStopModal = (visible) => {
    this.setState({
      showEditModal: visible,
    });
  };
  showDeleteStopModal = (visible) => {
    this.setState({
      showDeleteStopModal: visible,
    });
  };

  render() {
    let { scheduleLoading, trainLoading } = this.state;
    let body;
    let trainDescription = getTrainDescription(
      this.state.train.name,
      this.state.train.startStation,
      this.state.train.endStation
    );
    let title =
      "Schedule of " + trainDescription + " Train | Trains - Sri Lanka";
    let description =
      "The list of stations the train stops, the days of week the train runs, the type of the train" +
      trainDescription + " and the classes available";
    if (scheduleLoading || trainLoading) {
      body = <CircularProgress className={styles.centerScreen} />;
    } else {
      let id = 0;
      let stops = this.state.stops.map((stop) => {
        let arrival = "N/A";
        let departure = "N/A";
        id++;
        if (stop.stationId !== this.state.train.startSt) {
          arrival = <LocalTime hour={stop.ah} min={stop.am} />;
        }
        if (stop.stationId !== this.state.train.endSt) {
          departure = <LocalTime hour={stop.dh} min={stop.dm} />;
        }
        return (
          <Grid item xs={12} sm={6} md={4} key={stop.id}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">#{id}</Typography>
                <Typography variant="h5" gutterBottom>
                  {stop.stationName}
                </Typography>
                <Typography variant="body1">Arrival : {arrival}</Typography>
                <Typography variant="body1">Departure : {departure}</Typography>
                <Typography variant="body1">
                  {stop.platform ? `Platform: ${stop.platform}` : ""}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={`/schedule/station/${stop.stationName}`}>
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
                  onClick={(event) => this.handleMenuBtnClick(event, stop)}
                >
                  More..
                </Button>
              </CardActions>
            </Card>
          </Grid>
        );
      });

      let editTrainData = {
        id: this.state.train.id,
        name: this.state.train.name,
        avbValue: this.state.train.avbValue,
        type: this.state.train.type,
        classes: this.state.train.classes,
        startSt: this.state.train.startSt,
        endSt: this.state.train.endSt,
      };
      body = (
        <>
          <Grid container spacing={1} direction="column">
            <h3 className="p-2 text-center">
              Train Schedule : {trainDescription}
            </h3>
            <div>
              <Typography variant="body1">
                Runs on : {this.state.train.avb}
              </Typography>
              <Typography variant="body1">
                Type : {this.state.train.type}
              </Typography>
              <Typography variant="body1">
                Classes : {this.state.train.classes}
              </Typography>
            </div>
            <Grid container item justify="flex-start">
              <Button
                variant="contained"
                color="primary"
                size="small"
                className="mb-1 mr-1"
                onClick={this.toggleAddNewStop}
              >
                Add a missing stop
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                className="mb-1 mr-1"
                onClick={this.toggleEditTrainModal}
              >
                Edit Train
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                className="mb-1 mr-1"
                onClick={this.toggleMergeModal}
              >
                Merge Connecting Train
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                className="mb-1 mr-1"
                onClick={this.toggleDeleteTrain}
              >
                Delete Train
              </Button>
            </Grid>
            <Grid container item spacing={1}>
              {stops}
            </Grid>
          </Grid>
          <EditScheduleModal
            isOpen={this.state.showEditModal}
            setOpen={this.toggleEditModal}
            trainStop={this.state.editStopData}
          />
          <EditTrainModal
            isOpen={this.state.showEditTrainModal}
            setOpen={this.toggleEditTrainModal}
            train={editTrainData}
            stops={this.state.stops}
          ></EditTrainModal>
          <NewTrainStopModal
            isOpen={this.state.showAddStopModal}
            setOpen={this.toggleAddStopModal}
            trainId={this.props.match.params.id}
          />
          <DeleteTrainModal
            isOpen={this.state.showDeleteTrainModal}
            setOpen={this.toggleDeleteTrainModal}
            trainId={this.props.match.params.id}
          />
          <DeleteScheduleModal
            isOpen={this.state.showDeleteStopModal}
            setOpen={this.toggleDeleteModal}
            trainStopId={this.state.deleteStopData.id}
            trainName={this.state.deleteStopData.trainName}
            stationName={this.state.deleteStopData.stationName}
          />
          <MergeTrainModal
          isOpen={this.state.showMergeTrainModal}
          setOpen={this.toggleMergeModal}
          trainId={this.props.match.params.id}
          />
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
                  this.state.menuStop.stationName,
                  this.state.train
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
                  this.state.menuStop.stationName,
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
        </>
      );
    }

    return (
      <Container className="App Container">
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
  toggleMergeModal = (isOpen, alert, level) => {
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
      showMergeTrainModal: isOpen,
    });
  };
  toggleAddStopModal = (isOpen, alert, level) => {
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
      showAddStopModal: isOpen,
    });
  };

  toggleDeleteTrainModal = (isOpen, alert, level) => {
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
      showDeleteTrainModal: isOpen,
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

  toggleAddNewStop = () => {
    this.setState({
      showAddStopModal: !this.state.showAddStopModal,
    });
  };

  toggleDeleteTrain = () => {
    this.setState({
      showDeleteTrainModal: !this.state.showDeleteTrainModal,
    });
  };

  toggleConfirmation = () => {
    this.setState({
      confirmationMsg: null,
    });
  };

  editStop = (id, ah, am, dh, dm, platform, station, train) => {
    this.setState({
      editStopData: {
        id,
        ah,
        am,
        dh,
        dm,
        platform,
        station,
        train,
      },
      showEditModal: true,
    });
  };

  deleteStop = (id, stationName, trainName) => {
    this.setState({
      deleteStopData: {
        id: id,
        stationName: stationName,
        trainName: trainName,
      },
      showDeleteStopModal: true,
    });
  };

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

  onTrainUpdated(id, name, avb, classes, type) {
    let { train } = this.state;
    train.name = name;
    train.avb = avb;
    train.classes = classes;
    train.type = type;
    this.setState({ train });
  }

  refresh = () => {
    window.location.reload();
  };

  toggleEditStop() {
    this.setState({
      showEditModal: !this.state.showEditModal,
    });
  }
}

export default TrainSchedule;
