import React, {useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppHeader from "./components/nav/AppHeader";
import SearchPage from "./components/search/SearchPage";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import StationList from "./components/list/StationList";
import NewTrain from "./components/NewTrain";
import StationSchedule from "./components/schedule/StationSchedule";
import TrainSchedule from "./components/schedule/TrainSchedule";
import SearchResults from "./components/search/SearchResults";
import NotFound from "./components/NotFound";
import About from "./components/About";
import ReviewList from "./components/review/ReviewList";
import ReactGA from "react-ga";
import Config from "./Config";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function App() {
  const classes = useStyles();
  const history = createBrowserHistory();
  ReactGA.initialize(Config.GA_KEY);
  history.listen((location) => {
    ReactGA.pageview(location.pathname + location.search);
  });

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, [])

  return (
    <div className={classes.root}>
      <Router history={history}>
        <AppHeader />
        <main className={classes.content}>
          <div className={classes.toolbar} />

          <Switch>
            <Route exact path="/" component={SearchPage} />
            <Route exact path="/stations" component={StationList} />
            <Route exact path="/review" component={ReviewList} />
            <Route exact path="/about" component={About} />
            <Route exact path="/trains/new" component={NewTrain} />
            <Route
              exact
              path="/schedule/station/:name"
              component={StationSchedule}
            />
            <Route exact path="/schedule/train/:id" component={TrainSchedule} />
            <Route
              exact
              path="/schedule/from/:from/to/:to"
              component={SearchResults}
            />
            <Route
              exact
              path="/schedule/from/:from/to/:to/:time/onward"
              component={SearchResults}
            />
            <Route
              exact
              path="/schedule/from/:from/to/:to/:time/onward/on/:date"
              component={SearchResults}
            />
            <Route component={NotFound} />
          </Switch>
        </main>
      </Router>
    </div>
  );
}
