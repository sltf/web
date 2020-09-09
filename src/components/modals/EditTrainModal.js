import React, { useState, useEffect } from "react";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { updateTrain } from "../redux";
import { connect } from "react-redux";
import GoogleAuth from "../auth/GoogleAuth";
import axios from "axios";
import Config from "../../Config";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";

function EditTrainModal({
  isOpen,
  setOpen,
  train,
  stops,
  updateTrain,
  authState,
}) {
  const [editTrain, setEditTrain] = useState(train);
  const [availabilities, setAvailabilities] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [trainTypes, setTrainTypes] = useState([]);
  const [trainStops, setTrainStops] = useState(stops);
  const [allStations, setAllStations] = useState([]);

  if (editTrain.id !== train.id) {
    setEditTrain(train);
  }
  let classes = [];
  if (editTrain.classes) {
    classes = editTrain.classes.split(",").map((item) => item.trim());
  }

  useEffect(() => {

      setTrainStops(stops);

    axios.get(`${Config.API_HOST}/api/station/list`).then((response) => {
      setAllStations(response.data);
    });
    axios
      .get(`${Config.API_HOST}/api/metadata/availabilities`)
      .then((response) => {
        setAvailabilities(response.data);
      });
    axios.get(`${Config.API_HOST}/api/metadata/classes`).then((response) => {
      setAllClasses(response.data);
    });
    axios.get(`${Config.API_HOST}/api/metadata/trainTypes`).then((response) => {
      setTrainTypes(response.data);
    });
  }, []);

  let availabilityOptions = availabilities.map((availability) => {
    return (
      <option value={availability.code} key={availability.code}>
        {availability.displayName}
      </option>
    );
  });
  let trainStations = [];
  trainStops.forEach((stop) => {
    trainStations.push(stop.stationId);
  });
  let filteredStations = allStations.filter(
    (station) => trainStations.indexOf(station.id) >= 0
  );
  let startStation = allStations.find(station => station.id===editTrain.startSt);
  let endStation = allStations.find(station => station.id===editTrain.endSt);

  let trainTypeOptions = trainTypes.map((type) => {
    return (
      <option value={type} key={type}>
        {type}
      </option>
    );
  });
  let classCheckBoxes = allClasses.map((tClass) => {
    return (
      <FormGroup check inline key={tClass}>
        <Label check>
          {classes.includes(tClass) ? (
            <Input
              type="checkbox"
              onChange={(e) => {
                let newClasses = classes.map((item) => item);
                newClasses = newClasses.filter(
                  (item) => item !== e.target.value
                );

                let newTrain = {
                  ...editTrain,
                  classes: newClasses.join(", "),
                };
                setEditTrain(newTrain);
              }}
              checked={true}
              value={tClass}
            ></Input>
          ) : (
            <Input
              type="checkbox"
              onChange={(e) => {
                let newClasses = classes.map((item) => item);
                newClasses.push(e.target.value);

                let updateTrain = {
                  ...editTrain,
                  classes: newClasses.join(", "),
                };
                setEditTrain(updateTrain);
              }}
              checked={false}
              value={tClass}
            ></Input>
          )}
          {tClass}
        </Label>
      </FormGroup>
    );
  });

  const setStartStation = (e, v) => {
    let id = v ? parseInt(v.id) : 0;
    editTrain.startSt = id;
  };
  const setEndStation = (e, v) => {
    let id = v ? parseInt(v.id) : 0;
    editTrain.endSt = id;
  };

  return (
    train && (
      <Modal
        isOpen={isOpen}
        toggle={() => setOpen(!isOpen, null, null)}
        zIndex={1300}
      >
        <ModalHeader toggle={() => setOpen(!isOpen, null, null)}>
          Edit Train
        </ModalHeader>
        <ModalBody>
          <GoogleAuth></GoogleAuth>
          {authState.isLoggedIn ? (
            <>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={editTrain.name}
                  onChange={(e) => {
                    let updatedTrain = {
                      ...editTrain,
                      name: e.target.value,
                    };
                    setEditTrain(updatedTrain);
                  }}
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label for="avb">Availability</Label>
                <Input
                  type="select"
                  name="avb"
                  id="avb"
                  onChange={(e) => {
                    let updatedTrain = {
                      ...editTrain,
                      avbValue: e.target.value,
                      avb: e.target.options[e.target.selectedIndex].text,
                    };
                    setEditTrain(updatedTrain);
                  }}
                  key={editTrain.avbValue}
                  defaultValue={editTrain.avbValue}
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
                  onChange={(e) => {
                    let updatedTrain = {
                      ...editTrain,
                      type: e.target.value,
                    };
                    setEditTrain(updatedTrain);
                  }}
                  key={editTrain.avbValue}
                  defaultValue={editTrain.avbValue}
                >
                  <option value="" key="unchanged">
                    --Select--
                  </option>
                  {trainTypeOptions}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="station">Starting Station</Label>
                <Autocomplete
                  id="station"
                  onChange={setStartStation}
                  options={filteredStations.filter(station => station !== endStation)}
                  getOptionLabel={(station) => station.name}
                  defaultValue={startStation}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Starting Station"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label for="station">Destination Station</Label>
                <Autocomplete
                  id="station"
                  onChange={setEndStation}
                  options={filteredStations.filter(station => station !== startStation)}
                  getOptionLabel={(station) => station.name}
                  defaultValue={endStation}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Destination Station"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </FormGroup>
              <p>Classes Available</p>
              {classCheckBoxes}
            </>
          ) : (
            ""
          )}
        </ModalBody>
        <ModalFooter>
          {authState.isLoggedIn ? (
            <Button
              color="primary"
              onClick={(e) => {
                updateTrain(editTrain, authState);
                setOpen(false, "Request Successful!", "success");
              }}
            >
              Request Update
            </Button>
          ) : (
            ""
          )}
          <Button
            color="secondary"
            onClick={() => {
              setOpen(false, null, null);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    )
  );
}

const mapStateToProps = (state) => {
  return {
    authState: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTrain: (train, authState) => dispatch(updateTrain(train, authState)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTrainModal);
