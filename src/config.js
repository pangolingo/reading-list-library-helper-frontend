let apiBaseUrl;
if(process.env.NODE_ENV === "production" || true){
  apiBaseUrl = "https://library-helper-api.herokuapp.com";
} else {
  apiBaseUrl = "http://localhost:4567";
}

const oauthUrl = `${apiBaseUrl}/oauth?callback_url=${encodeURIComponent(window.location.href)}`;

export {
  apiBaseUrl,
  oauthUrl,
}