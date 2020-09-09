import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchStations } from "../redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import {
  Container,
  Card,
  Grid,
  CardContent,
  Typography,
  TextField,
  makeStyles,
  InputAdornment,
} from "@material-ui/core";
import { Helmet } from "react-helmet";
import SearchIcon from "@material-ui/icons/Search";

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
});

function StationList({ stationData, authData, fetchStations }) {
  useEffect(() => {
    fetchStations();
  }, []);

  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");

  const onSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  let body = "";
  if (stationData.loading) {
    body = <CircularProgress className={classes.centerScreen} />;
  } else if (stationData.error) {
    body = <h2 className={classes.loadingContainer}>{stationData.error}</h2>;
  } else {
    let stations = stationData.stations
      .filter(
        (station) =>
          station.name.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
      )
      .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
      .map((station) => {
        return (
          <Grid item xs={12} key={station.id}>
            <Card elevation={3}>
              <CardContent>
                <Link to={`/schedule/station/${station.name}`}>
                  <Grid container direction="row">
                    <Grid item xs={12} sm>
                      <Typography variant="h5">{station.name}</Typography>
                    </Grid>
                  </Grid>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        );
      });
    body = (
      <Container>
        <h1 className={classes.pageHead}>Railway Stations Index</h1>
        <TextField
          variant="outlined"
          onChange={onSearch}
          margin="normal"
          fullWidth={true}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        ></TextField>
        <Grid container spacing={1}>
          {stations}
        </Grid>
      </Container>
    );
  }
  return (
    <div>
      <Helmet>
        <title>Railway Stations of Sri Lanka | Trains - Sri Lanka</title>
        <meta
          name="description"
          content="List of railway stations in Sri Lanka, along with their telephone numbers and schedules"
        />
      </Helmet>
      {body}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    stationData: state.stations,
    authData: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchStations: () => dispatch(fetchStations()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StationList);
