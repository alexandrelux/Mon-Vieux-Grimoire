import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize(`${process.env.POSTGREURL}`);

const User = sequelize.define("User", {
    _id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
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
