import React, { useState } from "react";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { connect } from "react-redux";
import MomentUtils from "@date-io/moment";
import axios from "axios";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import moment from "moment";
import { getTrainDescription } from "../../utils/utils";
import Config from "../../Config";
import GoogleAuth from "../auth/GoogleAuth";

function EditScheduleModal({ isOpen, setOpen, trainStop, authState }) {
  const [editTrainStop, setEditTrainStop] = useState({});

  if (trainStop == null) {
    return null;
  }

  if (editTrainStop == null || editTrainStop.id !== trainStop.id) {
    let newEditTrainStop = {
      id: trainStop.id,
      ah: trainStop.ah,
      am: trainStop.am,
      dh: trainStop.dh,
      dm: trainStop.dm,
      platform: trainStop.platform,
    };
    setEditTrainStop(newEditTrainStop);
  }

  const handleArrivalTimeChange = (date) => {
    let trainStop = { ...editTrainStop };
    trainStop.ah = date.hour();
    trainStop.am = date.minute();
    let departureTime = date.add(1, "m");
    trainStop.dh = departureTime.hour();
    trainStop.dm = departureTime.minute();
    setEditTrainStop(trainStop);
  };

  const handleDepartureTimeChange = (date) => {
    let trainStop = { ...editTrainStop };
    trainStop.dh = date.hour();
    trainStop.dm = date.minute();
    setEditTrainStop(trainStop);
  };

  const setPlatform = (e) => {
    let trainStop = { ...editTrainStop};
    trainStop.platform = e.target.value;
    setEditTrainStop(trainStop);
  };

  const updateTrainStop = () => {
    let config = {
      headers: {
        X_ID_TOKEN: authState.idToken,
      },
    };
    axios
      .put(
        `${Config.API_HOST}/api/schedule/${editTrainStop.id}`,
        editTrainStop,
        config
      )
      .then((res) => setOpen(false,"Request Successful!","success"))
      .catch((error) => setOpen(false,"Request Failed!","error"));
  };

  let trainDisplayName = getTrainDescription(
    trainStop.train.name,
    trainStop.train.startStation,
    trainStop.train.endStation
  );

  let arrivalTime = moment(`${editTrainStop.ah}:${editTrainStop.am}`, "HH:mm");
  let departureTime = moment(
    `${editTrainStop.dh}:${editTrainStop.dm}`,
    "HH:mm"
  );

  return (
    <Modal isOpen={isOpen} toggle={() => setOpen(!isOpen,null,null)} zIndex={1300}>
      <ModalHeader
        toggle={() => {
          setOpen(!isOpen, null, null);
        }}
      >
        Edit Train Stop
      </ModalHeader>
      <ModalBody>
        <GoogleAuth></GoogleAuth>

        {authState.isLoggedIn ? (
          <>
            <FormGroup>
              <Label for="name">Station Name</Label>
              <Input
                type="text"
                name="station"
                id="station"
                value={trainStop.station}
                readOnly
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="nameSi">Train</Label>
              <Input
                type="text"
                name="train"
                id="train"
                value={trainDisplayName}
                readOnly
              ></Input>
            </FormGroup>
            <FormGroup>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardTimePicker
                  className="mx-1"
                  label="Arrival Time"
                  value={arrivalTime}
                  onChange={(e) => handleArrivalTimeChange(e)}
                  KeyboardButtonProps={{
                    "aria-label": "change time",
                  }}
                />
                <KeyboardTimePicker
                  className="mx-1"
                  label="Departure Time"
                  value={departureTime}
                  onChange={(e) => handleDepartureTimeChange(e)}
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
                value={editTrainStop.platform}
                onChange={(e) => setPlatform(e)}
              ></Input>
            </FormGroup>
          </>
        ) : (
          ""
        )}
      </ModalBody>
      <ModalFooter>
        {authState.isLoggedIn ? (
          <Button color="primary" onClick={(e) => updateTrainStop()}>
            Request Update
          </Button>
        ) : (
          ""
        )}
        <Button
          color="secondary"
          onClick={() => {
            setOpen(!isOpen, null, null);
          }}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

const mapStateToProps = (state) => {
  return {
    authState: state.auth,
  };
};

export default connect(mapStateToProps)(EditScheduleModal);
