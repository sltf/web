import React from "react";
import { Container } from "reactstrap";
import styles from "../style/searchStyle.module.css";

export default function About() {
  return (
    <Container>
      <h1 className={`${styles.center} ${styles.pageHead}`}>
        Trains Sri Lanka
      </h1>
      <p>
        Train Sri Lanka helps you to smartly search trains in Sri Lanka and view
        the timetables of both trains and stations. It gives you the list of
        options that you can travel between any two stations.
      </p>
      <hr/>
      <h2>Features</h2>
      <ul>
        <li>
          Search for trains between any two stations in Sri Lanka at any
          date/time.
        </li>
        <li>View full time table of any train or station</li>
        <li>
          View telephone numbers of all major stations in case you need any
          additional information
        </li>
        <li>Suggest ammendments to any wrong data, and review suggestions by others</li>
      </ul>
      <hr/>
      <h2>Seeing Any Wrong Data?</h2>
      <p>We are trying to keep the data up to date as much as possible. However, there might be cases where any new changes in the schedules may get time to reflect here. We are extremely sorry, if you had to face any inconveniece in such instance. </p>
      
      <p>
        However, you can now suggest the new changes and get it reflected by yourself. At any of,</p>
        <ul>
          <li><a href="/stations">Station list page</a></li>
          <li>Station view page</li>
          <li>Train view page</li>
        </ul>
        <p> you can find the options to suggest the changes to any data errors. The suggestions are listed to be <a href="/pendingChanges">reviewed</a> by others and once a suggestion get a considerable amount of reviews, the change will automatically be applied.
      </p>
      <p>
        The suggesters and the approvers will also get a reputation score upon
        successful change. The reputation score is considered when approving the
        suggestions (only less number of reputed voters will require to accept a
        suggestion)
      </p>
      <hr/>
      <h2>Contact Developers</h2>
      <p>Please send a mail to <u>sltf-dev@googlegroups.com</u></p>
    </Container>
  );
}
