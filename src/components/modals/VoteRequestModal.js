import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { votePendingChange } from "../redux";
import { connect } from "react-redux";
import GoogleAuth from "../auth/GoogleAuth";

function VoteRequestModal({
  isOpen,
  setOpen,
  itemToVote,
  vote,
  authState,
  votePendingChange,
}) {
  return (
    itemToVote && (
      <Modal isOpen={isOpen} toggle={() => setOpen(!isOpen, null, null)} zIndex={1300}>
        <ModalHeader toggle={() => setOpen(!isOpen, null, null)}>Confirmation</ModalHeader>
        <ModalBody>
          <GoogleAuth></GoogleAuth>
          {authState.isLoggedIn ? (
            <p>
              You're email {authState.userId} will be recorded to ensure no
              multiple votes for same request from same user.
            </p>
          ) : (
            ""
          )}
        </ModalBody>
        <ModalFooter>
          {authState.isLoggedIn ? (
            <Button
              color="primary"
              onClick={() => {
                votePendingChange(itemToVote, vote, authState);
                setOpen(!isOpen, "Vote Submitted!","success");
              }}
            >
              {vote ? "Upvote" : "Downvote"}
            </Button>
          ) : (
            ""
          )}
          <Button color="secondary" onClick={() => setOpen(!isOpen, null, null)}>
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
    votePendingChange: (itemToVote, vote, authState) =>
      dispatch(votePendingChange(itemToVote, vote, authState)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VoteRequestModal);
