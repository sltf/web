import React, { Component } from "react";
import ResultItem from "./ResultItem";
import axios from "axios";
import { Container } from "reactstrap";
import Config from "../../Config";
import { Helmet } from "react-helmet";
import styles from "../../style/searchStyle.module.css";
import moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from '@material-ui/lab/Alert'

class SearchResults extends Component {
  state = {
    loading: true,
    error: null,
    results: [],
  };

  componentDidMount() {
    const { from, to, date, time } = this.props.match.params;
    let url = `${Config.API_HOST}/api/search/from/${from}/to/${to}`;
    url = time ? `${url}/${time}/onward` : url;
    url = date ? `${url}/on/${date}` : url;
    axios
      .get(url)
      .then((response) => {
        this.setState({
          results: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          error: error,
          loading: false,
        });
      });
  }

  render() {
    let body;
    const { from, to, date, time } = this.props.match.params;
    let title = `Train schedule from ${from} to ${to} | Trains - Sri Lanka`;
    let description = `Train schedule from ${from} to ${to} with the train details, where to switch trains, and journey times`;
    if (this.state.loading) {
      body = <CircularProgress className={styles.centerScreen} />;
    } else {
      let resultItems = this.state.results.map((result) => (
        <ResultItem
          key={result.number}
          id={result.number}
          trainTravels={result.trainHops}
          transits={result.transits}
          duration={result.duration}
        />
      ));
      let dateTimeString = date
        ? `on ${moment(date, "YYYY-MM-DD").format("dddd, MMMM Do YYYY")}`
        : "today";
      dateTimeString = time ? `${dateTimeString}, ${time} onwards` : "from now";
      body = (
        <>
          <h2 className={`${styles.center} ${styles.pageHead}`}>
            {from} to {to}
          </h2>
          <h6 className={styles.center}>{dateTimeString}</h6>
          <Alert severity="info">You can view Train/Station schedules by clicking the train/station name. If any data is wrong, help us correct those by choosing edit options at those relevant pages.</Alert>
          {resultItems}
        </>
      );
    }
    return (
      <Container>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Helmet>
        {body}
      </Container>
    );
  }
}

export default SearchResults;
