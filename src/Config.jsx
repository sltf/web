const dev = {
  API_HOST: "http://localhost:8080",
  GA_KEY: "UA-41010626-7",
  CLIENT_ID: "606680519255-o3l0nbsu5chko9l09icctr2oavugo729.apps.googleusercontent.com"
};

const prod = {
  API_HOST: "http://www.lktrains.com",
  GA_KEY: "UA-41010626-6",
  CLIENT_ID : "606680519255-9rv3jhki5qushmjlfhftuooussbf26j4.apps.googleusercontent.com"
};

const config = process.env.REACT_APP_STAGE === "production" ? prod : dev;

export default {
  ...config,
};
