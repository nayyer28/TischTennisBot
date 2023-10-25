const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://tt-user:password@localhost:5330/tt-user');
const Match = sequelize.define('Match', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false

    },
    winner: {
        type: DataTypes.STRING,
        allowNull: false
    },
    loser: {
        type: DataTypes.STRING,
        allowNull: false
    },
    winnerPoints: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    loserPoints: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
});

(async () => {
  try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}})();

sequelize.sync({ force: false })
  .then(() => {
    console.log('Match table has been successfully created if it didn\'t exist already.');
  })
  .catch(err => console.error('Error creating Match table:', err));

  module.exports = {sequelize, Match, Sequelize};