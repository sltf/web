import React from "react";
import { connect } from "react-redux";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from "reactstrap";
import GoogleAuth from "../auth/GoogleAuth";
import axios from "axios";
import Config from "../../Config";


function DeleteScheduleModal({
  isOpen,
  setOpen,
  trainStopId,
  stationName,
  trainName,
  authState,
}) {

    const deleteTrainStop = () => {
        let config = {
          headers: {
            X_ID_TOKEN: authState.idToken,
          },
        };
        axios.delete(`${Config.API_HOST}/api/schedule/${trainStopId}`,config)
        .then((res) => {
          setOpen(false, "Request Successful!", "success");
        })
        .catch((error) => setOpen(false,"Request Failed!", "error"));
      };

  return (
    <Modal isOpen={isOpen} toggle={() => setOpen(!isOpen, null, null)} zIndex={1300}>
    <ModalHeader toggle={() => setOpen(!isOpen, null, null)}>Edit Station</ModalHeader>
    <ModalBody>
      <GoogleAuth></GoogleAuth>
      {authState.isLoggedIn ? (
        <div>
            <hr/>
          <p>Are you sure you want to delete the {trainName} train stop at {stationName}?</p>
        </div>
      ) : (
        ""
      )}
    </ModalBody>
    <ModalFooter>
      {authState.isLoggedIn ? (
        <Button
          color="danger"
          onClick={() => {
            deleteTrainStop(trainStopId);
            setOpen(!isOpen, null, null);
          }}
        >
          Request Delete
        </Button>
      ) : (
        ""
      )}
      <Button color="secondary" onClick={() => setOpen(!isOpen, null, null)}>
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

export default connect(mapStateToProps)(DeleteScheduleModal);
