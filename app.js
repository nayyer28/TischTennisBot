const { App } = require("@slack/bolt");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true, // enable the following to use socket mode
  appToken: process.env.SLACK_APP_TOKEN
});


const data = [];
let match = {};

(async () => {
  const port = 3000
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();

const matchForm = {blocks: [ {
  "type": "section",
  "text": {
    "type": "plain_text",
    "text": "Enter match details!",
    "emoji": true
  }
},
{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": "When was the match?"
  },
  "accessory": {
    "type": "datepicker",
    "placeholder": {
      "type": "plain_text",
      "text": "Select a date",
      "emoji": true
    },
    "action_id": "datepicker-action"
  }
},
{
  "type": "divider"
},
{
  "type": "actions",
  "elements": [
    {
      "type": "timepicker",
      "placeholder": {
        "type": "plain_text",
        "text": "Select time",
        "emoji": true
      },
      "action_id": "timepicker-action"
    }
  ]
},
{
  "type": "divider"
},
{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": "Player 1"
  },
  "accessory": {
    "type": "users_select",
    "placeholder": {
      "type": "plain_text",
      "text": "Select a user",
      "emoji": true
    },
    "action_id": "player-1-action"
  }
},
{
  "type": "divider"
},
{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": "Player 2"
  },
  "accessory": {
    "type": "users_select",
    "placeholder": {
      "type": "plain_text",
      "text": "Select a user",
      "emoji": true
    },
    "action_id": "player-2-action"
  }
},
{
  "type": "divider"
},
{
  "dispatch_action": true,
  "type": "input",
  "element": {
    "type": "plain_text_input",
    "action_id": "match-result-action",
    "placeholder": {
      "type": "plain_text",
      "text": "Match Result",
      "emoji": true
    }
  },
  "label": {
    "type": "plain_text",
    "text": "Result",
    "emoji": true
  }
},
{
  "type": "actions",
  "elements": [
    {
      "type": "button",
      "text": {
        "type": "plain_text",
        "text": "Save",
        "emoji": true
      },
      "value": "click_me_123",
      "action_id": "save-action"
    }
  ]
}]}


app.command("/log-tt-match", async ({ command, ack, say }) => {
  try {
    await ack();
    say(matchForm);
    console.log("Yaaay! that command works!");
  } catch (error) {
      console.log("err");
    console.error(error);
  }
});

app.action('datepicker-action', async ({ body, ack, say }) => {
  try{
    await ack();
    const {selected_date} = body.actions[0];
    match['date'] = selected_date;
    console.log(match);
    // Update the message to reflect the action
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.action('timepicker-action', async ({ body, ack, say }) => {
  try{
    await ack();
    const {selected_time} = body.actions[0];
    match['time'] = selected_time;
    console.log(match);
    //Update the message to reflect the action
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});
app.action('player-1-action', async ({ body, ack, say }) => {
  try{
    await ack();
    const {selected_user} = body.actions[0];
    match['player1'] = selected_user;
    console.log(match);
    // Update the message to reflect the action
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});
app.action('player-2-action', async ({ body, ack, say }) => {
  try{
    await ack();
    const {selected_user} = body.actions[0];
    match['player2'] = selected_user;
    console.log(match);
    // Update the message to reflect the action
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});
app.action('match-result-action', async ({ body, ack, say }) => {
  try{
    await ack();
    const {value} = body.actions[0];
    match['result'] = value;
    console.log(match);
    // Update the message to reflect the action
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});
app.action('save-action', async ({ack, say }) => {
  try{
    await ack();

    const {date, time, player1, player2, result} = match;

    if(!date){
      return say("Please provide the match date!");
    }
    if(!time){
      return say("Please provide the match time!");
    }
    if(!player1){
      return say("Please provide player 1!");
    }
    if(!player2){
      return say("Please provide player 2!");
    }

    if( player1 === player2 ){
      return say ("Sadly we are not Dwights. Player 1 and Player 2 must be different!");
    }

    if(!result){
      return say("Please provide the match result!");
    }

    //save to db
    say(`<@${player1}> hat ${result} gegen <@${player2}> gewonnen. :partying_face:!!`)
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});