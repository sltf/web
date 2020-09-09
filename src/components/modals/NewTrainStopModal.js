import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchStations } from "../redux";
import styles from "../../style/searchStyle.module.css";
import { CircularProgress, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "../../Config";
import {
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Modal,
  Input,
  ModalFooter,
  Button,
  Alert,
} from "reactstrap";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import GoogleAuth from "../auth/GoogleAuth";

function NewTrainStopModal({
  isOpen,
  setOpen,
  trainId,
  stationData,
  authState,
  fetchStations,
}) {
  useEffect(() => {
    fetchStations();
  }, []);

  const [trainStop, setTrainStop] = useState({ah:0,dh:0});

  const handleArrivalTimeChange = (date) => {
    let stop = { ...trainStop };
    stop.ah = date.hour();
    stop.am = date.minute();
    if (stop.ah && stop.am && stop.dh === 0 && stop.dm === 0) {
      stop.dm = stop.am + 1;
      if (stop.dm >= 60) {
        stop.dm = stop.dm - 60;
        stop.dh = stop.ah + 1;
      } else {
        stop.dh = stop.ah;
      }
    }
    setTrainStop(stop);
  };

  const handleDepartureTimeChange = (date) => {
    let stop = { ...trainStop };
    stop.dh = date.hour();
    stop.dm = date.minute();
    setTrainStop(stop);
  };

  const setPlatform = (e) => {
    let stop = { ...trainStop };
    stop.platform = e.target.value;
    setTrainStop(stop);
  };

  const addTrainStop = () => {
    let stop = {
      ...trainStop,
      trainId: trainId,
    };
    let config = {
      headers: {
        X_ID_TOKEN: authState.idToken,
      },
    };
    axios.post(`${Config.API_HOST}/api/schedule/`, stop, config)
    .then((res) => {
      setOpen(false,"Request Successful!","success");
    })
    .catch((error) => setOpen(false,"Request Failed!","error"));
  };

  const setStation = (e, v) => {
    let id = v ? parseInt(v.id) : 0;
    let stop = { ...trainStop };
    stop.stationId = id;
    setTrainStop(stop);
  };

  let body = "";
  if (stationData.loading) {
    body = <CircularProgress className={styles.centerScreen} />;
  } else if (stationData.error) {
    body = <h2 className={styles.pageHead}>{stationData.error}</h2>;
  } else {
    let stations = stationData.stations.sort((s1, s2) => {
      return s1.name < s2.name ? -1 : 1;
    });
    let alert = "";
    let arrivalTime =  moment(`${trainStop.ah}:${trainStop.am}`, "HH:mm");
    let departureTime = moment(`${trainStop.dh}:${trainStop.dm}`, "HH:mm");
    alert = arrivalTime.isSameOrAfter(departureTime)
      ? "Arrival time should be before departure time"
      : alert;
    alert = !trainStop.stationId ? "Please select station":alert;
    console.log('trainStop.stationId', trainStop.stationId)
    body = (
      <Modal isOpen={isOpen} toggle={() => setOpen(!isOpen, null, null)} zIndex={1300}>
        <ModalHeader toggle={() => setOpen(!isOpen, null, null)}>
          Add Train Stop
        </ModalHeader>
        <ModalBody>
          <GoogleAuth></GoogleAuth>
          {authState.isLoggedIn ? (
            <div>
              {alert ? <Alert color="danger">{alert}</Alert> : ""}
              <FormGroup>
                <Label for="station">Station</Label>
                <Autocomplete
                  id="station"
                  onChange={setStation}
                  options={stations}
                  getOptionLabel={(station) => station.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Station name"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </FormGroup>

              <FormGroup>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardTimePicker
                    className="mx-1"
                    label="Arrival Time"
                    value={arrivalTime}
                    onChange={handleArrivalTimeChange}
                    KeyboardButtonProps={{
                      "aria-label": "change time",
                    }}
                  />
                  <KeyboardTimePicker
                    className="mx-1"
                    label="Departure Time"
                    value={departureTime}
                    onChange={handleDepartureTimeChange}
                    KeyboardButtonProps={{
                      "aria-label": "change time",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </FormGroup>
              <FormGroup>
                <Label for="platform">Platform</Label>
                <Input
                  type="text"
                  name="platform"
                  id="platform"
                  value={trainStop.platform}
                  onChange={setPlatform}
                />
              </FormGroup>
            </div>
          ) : (
            ""
          )}
        </ModalBody>
        <ModalFooter>
          <Button color={alert?"secondary":"primary"} onClick={addTrainStop} disabled={alert}> 
            Request to Add
          </Button>{" "}
          <Button color="secondary" onClick={() => setOpen(!isOpen, null, null)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  return <div>{body}</div>;
}

const mapStateToProps = (state) => {
  return {
    authState: state.auth,
    stationData: state.stations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchStations: () => dispatch(fetchStations()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewTrainStopModal);
