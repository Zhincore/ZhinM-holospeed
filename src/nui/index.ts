import App from "./App.svelte";
import "./style.scss";

if (import.meta.env.DEV) {
  document.body.style.backgroundImage =
    'url("https://static.zhincore.eu/storage/github_ZhinM-holospeed/20220913204900_1.jpg")';
}

new App({
  target: document.body,
});
