import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  Container,
} from "reactstrap";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment";
import Config from "../Config";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import GoogleAuth from "./auth/GoogleAuth";

function NewTrain({ authState }) {
  const [newTrain, setNewTrain] = useState({
    name: "",
    nameSi: "",
    classes: [],
    startStation: 0,
    dh: 0,
    dm: 0,
    endStation: 0,
    ah: 0,
    am: 0,
    availability: 0,
    type: "",
  });

  const [allClasses, setAllClasses] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const [allAvailabilities, setAllAvailabilities] = useState([]);
  const [allStations, setAllStations] = useState([]);
  const [modal, setModal] = useState({ show: false, msg: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get(`${Config.API_HOST}/api/metadata/availabilities`)
      .then((response) => {
        setAllAvailabilities(response.data);
      });
    axios.get(`${Config.API_HOST}/api/metadata/classes`).then((response) => {
      setAllClasses(response.data);
    });
    axios.get(`${Config.API_HOST}/api/metadata/trainTypes`).then((response) => {
      setAllTypes(response.data);
    });
    axios.get(`${Config.API_HOST}/api/station/list`).then((response) => {
      setAllStations(response.data);
    });
  }, []);

  const createTrain = () => {
    setSubmitting(true);
    let classesJoined = newTrain.classes.join(", ");
    if (newTrain.startStation === 0 || newTrain.endStation === 0) {
      setModal({
        show: true,
        msg: "Starting station or Destination station cannot be empty",
      });
      setSubmitting(false);
      return;
    }
    const train = {
      name: newTrain.name,
      nameSi: newTrain.nameSi,
      classes: classesJoined,
      startSt: newTrain.startStation,
      endSt: newTrain.endStation,
      avbValue: newTrain.availability,
      type: newTrain.type,
    };

    const data = {
      train: train,
      srcDh: newTrain.dh,
      srcDm: newTrain.dm,
      dstAh: newTrain.ah,
      dstAm: newTrain.am,
    };
    console.log("authState", authState);
    let config = {
      headers: {
        X_ID_TOKEN: authState.idToken,
      },
    };
    axios
      .post(`${Config.API_HOST}/api/train/`, data, config)
      .then((res) => {
        setModal({
          show: true,
          msg: "Request Successful!",
        });
        setNewTrain({
          name: "",
          nameSi: "",
          classes: [],
          startStation: 0,
          dh: 0,
          dm: 0,
          endStation: 0,
          ah: 0,
          am: 0,
          availability: 0,
          type: "",
        });
      })
      .catch((res) => {
        setModal({
          show: true,
          msg: "Request Failed!",
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const setName = (e) => {
    setNewTrain({ ...newTrain, name: e.target.value });
  };
  const setNameSi = (e) => {
    setNewTrain({ ...newTrain, nameSi: e.target.value });
  };
  const setAvb = (e) => {
    setNewTrain({ ...newTrain, availability: e.target.value });
  };
  const setClasses = (e) => {
    let newClasses = newTrain.classes.map((item) => item);
    newClasses.push(e.target.value);
    setNewTrain({ ...newTrain, classes: newClasses });
  };
  const unsetClasses = (e) => {
    let newClasses = newTrain.classes.map((item) => item);
    newClasses = newClasses.filter((item) => item !== e.target.value);
    setNewTrain({ ...newTrain, classes: newClasses });
  };
  const setType = (e) => {
    setNewTrain({ ...newTrain, type: e.target.value });
  };
  const setStartStation = (e, v) => {
    let id = v ? parseInt(v.id) : 0;
    setNewTrain({ ...newTrain, startStation: id });
  };
  const setEndStation = (e, v) => {
    let id = v ? parseInt(v.id) : 0;
    setNewTrain({ ...newTrain, endStation: id });
  };

  const handleArrivalTimeChange = (date) => {
    setNewTrain({ ...newTrain, ah: date.hour(), am: date.minute() });
  };

  const handleDepartureTimeChange = (date) => {
    setNewTrain({ ...newTrain, dh: date.hour(), dm: date.minute() });
  };

  const toggleModal = () => {
    setModal({ show: !modal.show });
  };

  let arrivalTime = moment(`${newTrain.ah}:${newTrain.am}`, "HH:mm");
  let departureTime = moment(`${newTrain.dh}:${newTrain.dm}`, "HH:mm");

  let availabilityOptions = allAvailabilities.map((availability) => {
    return (
      <option value={availability.code} key={availability.code}>
        {availability.displayName}
      </option>
    );
  });
  let trainTypeOptions = allTypes.map((type) => {
    return (
      <option value={type} key={type}>
        {type}
      </option>
    );
  });
  let classCheckBoxes = allClasses.map((tClass) => {
    return (
      <FormGroup inline check key={tClass}>
        <Label check>
          {newTrain.classes.includes(tClass) ? (
            <Input
              type="checkbox"
              onChange={unsetClasses}
              checked
              value={tClass}
            />
          ) : (
            <Input type="checkbox" onChange={setClasses} value={tClass} />
          )}
          {tClass}
        </Label>
      </FormGroup>
    );
  });
  let startStations = allStations
    .filter((station) => station.id !== newTrain.endStation)
    .sort((s1, s2) => {
      return s1.name < s2.name ? -1 : 1;
    });
  let endStations = allStations
    .filter((station) => station.id !== newTrain.startStation)
    .sort((s1, s2) => {
      return s1.name < s2.name ? -1 : 1;
    });

  return (
    <Container>
      <Helmet>
        <title>Trains - Sri Lanka | Create New Train</title>
        <meta name="description" content="Add New Train" />
      </Helmet>
      <h2>Add New Train</h2>
      <GoogleAuth></GoogleAuth>
      {authState.isLoggedIn ? (
        <Form>
          <FormGroup>
            <Label for="name">Train Name</Label>
            <Input
              type="text"
              name="station"
              id="station"
              value={newTrain.name}
              onChange={setName}
            />
          </FormGroup>
          <FormGroup>
            <Label for="nameSi">Train Name(Sinhala)</Label>
            <Input
              type="text"
              name="nameSi"
              id="nameSi"
              value={newTrain.nameSi}
              onChange={setNameSi}
            />
          </FormGroup>
          <Row form>
            <Col>
              <FormGroup>
                <Label for="source">Starting Station</Label>
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Autocomplete
                  id="startStation"
                  onChange={setStartStation}
                  options={startStations}
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
            </Col>
            <Col md={6}>
              <FormGroup>
                <MuiPickersUtilsProvider utils={MomentUtils} id="departureTime">
                  <KeyboardTimePicker
                    label="Departure time"
                    value={departureTime}
                    onChange={handleDepartureTimeChange}
                    KeyboardButtonProps={{
                      "aria-label": "change time",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col>
              <FormGroup>
                <Label for="source">Destination Station</Label>
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Autocomplete
                  id="endStation"
                  onChange={setEndStation}
                  options={endStations}
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
            </Col>
            <Col md={6}>
              <FormGroup>
                <MuiPickersUtilsProvider utils={MomentUtils} id="arrivalTime">
                  <KeyboardTimePicker
                    label="Arrival time"
                    value={arrivalTime}
                    onChange={handleArrivalTimeChange}
                    KeyboardButtonProps={{
                      "aria-label": "change time",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label for="avb">Availability</Label>
            <Input
              type="select"
              name="avb"
              id="avb"
              onChange={setAvb}
              key={newTrain.availability}
              defaultValue={newTrain.availability}
            >
              <option value="" key="unchanged">
                --Select--
              </option>
              {availabilityOptions}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="type">Type</Label>
            <Input
              type="select"
              name="type"
              id="type"
              onChange={setType}
              key={newTrain.type}
              defaultValue={newTrain.type}
            >
              <option value="" key="unchanged">
                --Select--
              </option>
              {trainTypeOptions}
            </Input>
          </FormGroup>
          <FormGroup>
            <p>Classes Available</p>
            {classCheckBoxes}
          </FormGroup>
          <Button color="primary" onClick={createTrain} disabled={submitting}>
            Create
          </Button>
        </Form>
      ) : (
        ""
      )}
      <Modal isOpen={modal.show} toggle={toggleModal}>
        <ModalBody>
          <p>{modal.msg}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleModal}>
            OK
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    authState: state.auth,
  };
};

export default connect(mapStateToProps)(NewTrain);
