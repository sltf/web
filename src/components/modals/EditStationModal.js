import React, { useState } from "react";
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
import { updateStation } from "../redux";
import { connect } from "react-redux";
import GoogleAuth from "../auth/GoogleAuth";

function EditStationModal({
  isOpen,
  setOpen,
  station,
  updateStation,
  authState,
}) {
  const [editStation, setEditStation] = useState(station);

  return (
    station && (
      <Modal
        isOpen={isOpen}
        toggle={() => setOpen(!isOpen, null, null)}
        zIndex={1300}
      >
        <ModalHeader toggle={() => setOpen(!isOpen, null, null)}>
          Edit Station
        </ModalHeader>
        <ModalBody>
          <GoogleAuth></GoogleAuth>
          {authState.isLoggedIn ? (
            <div>
              <FormGroup>
                <Label for="name">Station Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={editStation.name}
                  onChange={(e) => {
                    let updatedStation = {
                      ...editStation,
                      name: e.target.value,
                    };
                    setEditStation(updatedStation);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="telId">Telephone</Label>
                <Input
                  type="text"
                  name="tel"
                  id="tel"
                  value={editStation.tel}
                  onChange={(e) => {
                    let updatedStation = {
                      ...editStation,
                      tel: e.target.value,
                    };
                    setEditStation(updatedStation);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="lat">Latitude</Label>
                <Input
                  type="text"
                  name="lat"
                  id="lat"
                  value={editStation.lat}
                  onChange={(e) => {
                    let updatedStation = {
                      ...editStation,
                      lat: e.target.value,
                    };
                    setEditStation(updatedStation);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="Longitude">Longitude</Label>
                <Input
                  type="text"
                  name="lng"
                  id="lng"
                  value={editStation.lng}
                  onChange={(e) => {
                    let updatedStation = {
                      ...editStation,
                      lng: e.target.value,
                    };
                    setEditStation(updatedStation);
                  }}
                />
              </FormGroup>
            </div>
          ) : (
            ""
          )}
        </ModalBody>
        <ModalFooter>
          {authState.isLoggedIn ? (
            <Button
              color="primary"
              onClick={() => {
                updateStation(editStation, authState);
                setOpen(!isOpen, "Request Sent! ", "success");
              }}
            >
              Request Update
            </Button>
          ) : (
            ""
          )}
          <Button
            color="secondary"
            onClick={() => setOpen(!isOpen, null, null)}
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
    updateStation: (station, authState) =>
      dispatch(updateStation(station, authState)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditStationModal);
