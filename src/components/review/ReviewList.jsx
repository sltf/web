import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchPendingChanges } from "../redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Container,
  Grid,
  ButtonGroup,
  Snackbar,
} from "@material-ui/core";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import VoteRequestModal from "../modals/VoteRequestModal";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles({
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  pageHead: {
    textAlign: "center",
    padding: "10px",
  },
  newValue: {
    backgroundColor: "#bbffbb",
  },
  oldValue: {
    backgroundColor: "#ffbbbb",
    textDecoration: "line-through",
  },
});

function ReviewList({
  pendingChanges,
  authData,
  fetchPendingChanges,
  location,
}) {
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let page = params.get("page");
    page = page ? page : 0;
    fetchPendingChanges(authData, page);
  }, []);

  const [votingItem, setvotingItem] = useState(null);
  const [vote, setVote] = useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, level: "", text: "" });
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert({ ...alert, open: false });
  };
  const toggleVoteModal = (isOpen, alert, level) => {
    setIsVoteModalOpen(isOpen);
    if (alert) {
      setAlert({
        open: true,
        level: level,
        text: alert,
      });
    }
  };

  let body = "";
  if (pendingChanges.loading) {
    body = (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  } else if (pendingChanges.error) {
    body = <h2>{pendingChanges.error}</h2>;
  } else {
    const params = new URLSearchParams(location.search);
    let page = params.get("page");
    page = page ? page : 0;
    let prevPage = -1;
    let nextPage = -1;
    if (page > 0) {
      prevPage = page - 1;
    }
    if (pendingChanges.pendingChanges.length >= 15) {
      nextPage = page + 1;
    }
    let changeRequests = pendingChanges.pendingChanges.map((changeRequest) => {
      let itemsDisplay = "";
      switch (changeRequest.action) {
        case "ADD":
          itemsDisplay = changeRequest.changes.map((change) => {
            return (
              <div key={change.id}>
                {change.entityField} :{" "}
                <span className={classes.newValue}>{change.newValue}</span>{" "}
              </div>
            );
          });
          break;
        case "MODIFY":
          itemsDisplay = changeRequest.changes.map((change) => {
            return (
              <div key={change.id}>
                {change.entityField} updated to{" "}
                <span className={classes.newValue}>{change.newValue}</span> from{" "}
                <span className={classes.oldValue}>{change.oldValue}</span>
                <hr />
              </div>
            );
          });
          break;
        case "DELETE":
          itemsDisplay = changeRequest.changes.map((change) => {
            return (
              <div key={change.id}>
                {change.entityField} was{" "}
                <span className={classes.oldValue}>{change.oldValue}</span>
              </div>
            );
          });
          break;
        case "MERGE":
          itemsDisplay = changeRequest.changes.map((change) => {
            return (
              <div key={change.id}>Will be merged with {change.newValue}</div>
            );
          });
          break;
        default:
          break;
      }

      return (
        <Grid item xs={12} sm={6} md={4} key={changeRequest.id}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                #{changeRequest.id} : {changeRequest.changes.length} change(s)
              </Typography>

              <Typography variant="body1">
                {changeRequest.action} {changeRequest.entityType}
              </Typography>
              <Typography variant="h5">
                {changeRequest.entityId > 0 ? changeRequest.entityName : ""}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                by {changeRequest.initiator}
              </Typography>
              <hr />
              {itemsDisplay}
            </CardContent>
            <CardActions>
              <Button
                startIcon={<ThumbUpAltIcon />}
                color="primary"
                variant="contained"
                onClick={() => {
                  setvotingItem(changeRequest.id);
                  setVote(true);
                  setIsVoteModalOpen(true);
                }}
              >
                Upvote
              </Button>
              <Button
                startIcon={<ThumbDownAltIcon />}
                color="default"
                variant="contained"
                onClick={() => {
                  setvotingItem(changeRequest.id);
                  setVote(false);
                  setIsVoteModalOpen(true);
                }}
              >
                Downvote
              </Button>
            </CardActions>
          </Card>
        </Grid>
      );
    });
    body = (
      <Container>
        <h1 className={classes.pageHead}>Pending Changes List</h1>
        <Grid direction={"row"} container spacing={2}>
          <Grid container item xs={12} spacing={2} justify="center">
            <ButtonGroup>
              <Button href={`?page=${prevPage}`} disabled={prevPage < 0}>
                &lt;&lt; Previous
              </Button>
              <Button href={`?page=${nextPage}`} disabled={nextPage < 0}>
                Next &gt;&gt;
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid container item spacing={2}>
            {changeRequests}
          </Grid>
        </Grid>
        {isVoteModalOpen && (
          <VoteRequestModal
            setOpen={toggleVoteModal}
            isOpen={isVoteModalOpen}
            vote={vote}
            itemToVote={votingItem}
          ></VoteRequestModal>
        )}
        <Snackbar
          open={alert.open}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <MuiAlert
            elevation={6}
            varient="filled"
            onclose={handleClose}
            severity={alert.level}
          >
            {alert.text}
          </MuiAlert>
        </Snackbar>
      </Container>
    );
  }
  return <div>{body}</div>;
}

const mapStateToProps = (state) => {
  return {
    pendingChanges: state.pendingChanges,
    authData: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPendingChanges: (authState, page) =>
      dispatch(fetchPendingChanges(authState, page)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewList);
