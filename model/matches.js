const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://tt-user:password@localhost:5330/tt-logs');
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
    player1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    player2: {
        type: DataTypes.STRING,
        allowNull: false
    },
    result: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
module.exports = [sequelize, Match];