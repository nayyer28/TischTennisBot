const matchForm = [    {
    "type": "section",
    "text": {
      "type": "plain_text",
      "text": "Enter match details!",
      "emoji": true
    }
  },
  {
    "type": "input",
    "element": {
      "type": "datepicker",
      "placeholder": {
        "type": "plain_text",
        "text": "Select match date",
        "emoji": true
      },
    },
    "label": {
      "type": "plain_text",
      "text": "Match date",
      "emoji": true
    }
  },
  {
    "type": "divider"
  },
  {
    "type": "input",
    "element": {
      "type": "timepicker",
      "placeholder": {
        "type": "plain_text",
        "text": "Select match time",
        "emoji": true
      },
    },
    "label": {
      "type": "plain_text",
      "text": "Match time",
      "emoji": true
    }
  },
  {
    "type": "divider"
  },
  {
    "type": "input",
    "element": {
      "type": "users_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Select Player 1",
        "emoji": true
      },
    },
    "label": {
      "type": "plain_text",
      "text": "Player 1",
      "emoji": true
    }
  },
  {
    "type": "divider"
  },
  {
    "type": "input",
    "dispatch_action": false,
    "element": {
      "type": "users_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Select Player 2",
        "emoji": true
      },
    },
    "label": {
      "type": "plain_text",
      "text": "Player 2",
      "emoji": true
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
  }];

const rankList = {
  type: "rich_text",
  elements: [
    {
    type: "rich_text_section",
    elements: [
      {
        "type": "text",
        "text": "Players rankings:"
      }
    ]
  },
{
  type: "rich_text_list",
  style: "ordered",
  elements: []
},
]
};

module.exports = {matchForm, rankList};