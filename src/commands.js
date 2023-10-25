const {Match, Sequelize, sequelize} = require("./db.js");

const {matchForm, rankList} = require("./blocks.js");

const logTTMatchCommand = async ( {ack, body, client}) => {
    try {
      await ack();
      const userId = body.user_id;
  
      // Send an ephemeral message
      await client.chat.postEphemeral({
        token: process.env.SLACK_BOT_TOKEN,
        channel: body.channel_id,
        user: userId,
        blocks: matchForm
      });
    } catch (error) {
        console.log("err");
      console.error(error);
    }
};

const getMatchesSortedByWinner = async () => {
    try {
      const result = await Match.findAll({
        attributes: [
          'winner',
          [Sequelize.fn('COUNT', Sequelize.col('winner')), 'count'] // count the occurrences of the winner
        ],
        group: ['winner'],
        order: [[sequelize.literal('count'), 'DESC']] // sort by count in descending order
      })
      return result.map((m) => {
        const {winner, count} = m.dataValues;
        return {winner, count};
      });
      // result contains the list of winners sorted by the number of occurrences
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
};
const parse2RankList = (player2Wins) => {
  let rankObject = {
    "type": "rich_text_section",
    "elements": []
  };
  player2Wins.forEach(({winner, count}) => {
    rankObject.elements.push({
      "type": "user",
      "user_id": winner
    });

    rankObject.elements.push({
        "type": "text",
        "text": ` hat ${count} Turniersiege`
    });

    rankList.elements[1].elements.push(rankObject);
  });
};
const getRankingsCommand = async ({ ack, body, client }) => {
  try {
    await ack();
    const player2Wins = await getMatchesSortedByWinner();
    parse2RankList(player2Wins);
  await client.chat.postEphemeral({
      token: process.env.SLACK_BOT_TOKEN,
      channel: body.channel_id,
      user: body.user_id,
      blocks: [rankList]
    });
    //TODO: store immutable structure in a file and load with JSON.parse
    rankList.elements[1].elements = [];
    
  } catch (error) {
      console.log("err");
    console.error(error);
  }
};


const saveMatchResultAction = async ({ body, ack, client, say }) => {
    try{
      await ack();
      const {values} = body.state;
      let match = {};
      for (const key of Object.keys(values)) {
        const innerObj = values[key];
        const innerKey = Object.keys(innerObj)[0];
        const type = innerObj[innerKey].type;
        switch (type) {
            case 'datepicker':
              const {selected_date} = innerObj[innerKey];
              if(!selected_date){
                  return await client.chat.postEphemeral({
                      token: process.env.SLACK_BOT_TOKEN,
                      channel: body.channel.id,
                      user: body.user.id,
                      text: 'Please select match date!'
                    });
              }
              match['date'] = selected_date;
              break;
            case 'timepicker':
              const {selected_time} = innerObj[innerKey];
              if(!selected_time){
                  return await client.chat.postEphemeral({
                      token: process.env.SLACK_BOT_TOKEN,
                      channel: body.channel.id,
                      user: body.user.id,
                      text: 'Please select match time!'
                    });
              }
              match['time'] = selected_time;
              break;
            case 'users_select':
              if (key == 'UCfpL') {
                const {selected_user} = innerObj[innerKey];
                if(!selected_user){
                  return await client.chat.postEphemeral({
                      token: process.env.SLACK_BOT_TOKEN,
                      channel: body.channel.id,
                      user: body.user.id,
                      text: 'Please select player 1!'
                    });
              }
                match['player1'] = selected_user;
              } else if (key == 'rSFXn'){
                const {selected_user} = innerObj[innerKey];
                if(!selected_user){
                  return await client.chat.postEphemeral({
                      token: process.env.SLACK_BOT_TOKEN,
                      channel: body.channel.id,
                      user: body.user.id,
                      text: 'Please select player 2!'
                    });
                }
                match['player2'] = selected_user;
                if(selected_user === match.player1)
                {
                  return await client.chat.postEphemeral({
                    token: process.env.SLACK_BOT_TOKEN,
                    channel: body.channel.id,
                    user: body.user.id,
                    text: 'Players must be different!'
                  });
                }
              }
              break;
            case 'plain_text_input':
              const {value} = innerObj[innerKey];
                if(!value){
                  return await client.chat.postEphemeral({
                      token: process.env.SLACK_BOT_TOKEN,
                      channel: body.channel.id,
                      user: body.user.id,
                      text: 'Players enter match result. Example 2:1 !'
                    });
              }
              const pattern = /^(\d+):(\d+)$/;
              if (!pattern.test(value)){
                return await client.chat.postEphemeral({
                  token: process.env.SLACK_BOT_TOKEN,
                  channel: body.channel.id,
                  user: body.user.id,
                  text: 'Points must be of pattern number:number'
                });
              }
              const points = value.match(pattern);
              const player1Points = points[1];
              const player2Points = points[2];
              match['p1_points'] = player1Points;
              match['p2_points'] = player2Points;
              if(player1Points === player2Points) {
                return await client.chat.postEphemeral({
                  token: process.env.SLACK_BOT_TOKEN,
                  channel: body.channel.id,
                  user: body.user.id,
                  text: 'Players cant have the same points. Please finish your game!'
                              });
                }
                await client.chat.postEphemeral({
                  token: process.env.SLACK_BOT_TOKEN,
                  channel: body.channel.id,
                  user: body.user.id,
                  text: 'Match saved!'
                });
                let winner = {};
                let loser = {};
                if(match.p1_points > match.p2_points){
                  winner['player'] = match.player1;
                  winner['points'] = match.p1_points;
                  loser['player'] = match.player2;
                  loser['points'] = match.p2_points;
                  } else {
                  winner['player'] = match.player2;
                  winner['points'] = match.p2_points;
                  loser['player'] = match.player1;
                  loser['points'] = match.p1_points;
                  }
                  say(`<@${winner.player}> hat ${winner.points}:${loser.points} gegen <@${loser.player}> gewonnen. :partying_face:!!`);
                  try{
                  await Match.create({date: match.date, time: match.time, winner: winner.player, loser: loser.player, winnerPoints: parseInt(winner.points), loserPoints: parseInt(loser.points)});
                  return;
                  } catch(e){
                  console.log("err");
                  console.error(e);
                  } 
              break;
            default:
              break;
          }
      }
    } catch (error) {
      console.log("err");
      console.error(error);
    }
};

module.exports = {logTTMatchCommand, getRankingsCommand, saveMatchResultAction, getMatchesSortedByWinner, parse2RankList};