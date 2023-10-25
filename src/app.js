const { App } = require("@slack/bolt");

const {logTTMatchCommand, getRankingsCommand, saveMatchResultAction, getMatchesSortedByWinner, parse2RankList} = require("./commands.js")


require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true, 
  appToken: process.env.SLACK_APP_TOKEN
});

(async () => {
  const port = 3000
  // Starts app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();


app.command("/log-tt-match", logTTMatchCommand);
app.command("/get-ranking", getRankingsCommand);
app.action('match-result-action', saveMatchResultAction);
