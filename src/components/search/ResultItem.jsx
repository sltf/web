import React from "react";
import { Col, Container, Row } from "reactstrap";
import styles from "../../style/searchStyle.module.css";
import { timeDuration } from "../fragments/TimeDuration";
import TimerIcon from "@material-ui/icons/Timer";
import TrainTransit from "./TrainTransit";
import TrainTravel from "./TrainTravel";

export default function ResultItem({ id, trainTravels, transits, duration }) {
  let components = [];
  for (const [index, hop] of trainTravels.entries()) {
    if (index > 0) {
      let transit = (
        <TrainTransit
          station={transits[index - 1].station}
          waitTime={transits[index - 1].waitTime}
        />
      );
      components.push(transit);
    }
    let hopItem = <TrainTravel train={hop.train} from={hop.from} to={hop.to} />;
    components.push(hopItem);
  }
  components = components.map((component, index) => (
    <div key={index} className={styles.resultItemBody}>
      {component}
    </div>
  ));
  return (
    <Container className={styles.resultItem}>
      <Row>
        <Col md="1" xs="12">
          <div className={styles.centerVertical}>
            <Row>
              <Col md="12" xs="4">
                <h2>#{id}</h2>
              </Col>
              <Col md="12" xs="4">
                <TimerIcon />
                <p>
                  {timeDuration(duration)}
                </p>
              </Col>
              <Col md="12" xs="4">
                <p>{trainTravels.length} Trains</p>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md="11">
          <Container>{components}</Container>
        </Col>
      </Row>
    </Container>
  );
}
