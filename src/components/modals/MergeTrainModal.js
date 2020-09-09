import React, {useState} from "react";
import { connect } from "react-redux";
import GoogleAuth from "../auth/GoogleAuth";
import axios from "axios";
import Config from "../../Config";
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

function MergeTrainModal({ isOpen, setOpen, trainId, authState }) {

    const [train2id, setTrain2id] = useState(0);
    
  const mergeTrain = () => {
    let config = {
      headers: {
        X_ID_TOKEN: authState.idToken,
      },
    };
    let data = {
      train1: trainId,
      train2: train2id,
    };
    axios
      .post(`${Config.API_HOST}/api/train/merge`, data, config)
      .then((res) => {
        setOpen(false, "Request Successful!", "success");
      })
      .catch((error) => setOpen(false, "Request Failed!", "error"));
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => setOpen(!isOpen, null, null)}
      zIndex={1300}
    >
      <ModalHeader toggle={() => setOpen(!isOpen, null, null)}>
        Merge Connecting Train
      </ModalHeader>
      <ModalBody>
        <GoogleAuth></GoogleAuth>
        {authState.isLoggedIn ? (
          <div>
            <p>Open the other train you want to merge into this in a different tab/window and enter the ID of that train here. Train ID is the number that can be found at the end of the URL (of the other train)</p>
            <FormGroup>
              <Label for="name">Merging Train Id</Label>
              <Input
                type="number"
                name="mergingId"
                id="mergingId"
                value={train2id}
                onChange={(e) => {
                  setTrain2id(e.target.value);
                }}
              ></Input>
            </FormGroup>
          </div>
        ) : (
          ""
        )}
      </ModalBody>
      <ModalFooter>
        {authState.isLoggedIn && train2id>0 ? (
          <Button
            color="danger"
            onClick={() => {
              mergeTrain();
              setOpen(!isOpen, null, null);
            }}
          >
            Request Merge
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

export default connect(mapStateToProps)(MergeTrainModal);
