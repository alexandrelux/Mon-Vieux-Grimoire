import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize(`${process.env.POSTGREURL}`);

const User = sequelize.define("User", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export { User };
