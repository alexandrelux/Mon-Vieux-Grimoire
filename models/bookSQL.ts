import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize(`${process.env.POSTGREURL}`);

const Book = sequelize.define("book", {
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    averageRating: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
});

const Rating = sequelize.define("rating", {
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    grade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

Book.hasMany(Rating, { as: "ratings" });
Rating.belongsTo(Book);

export { Book, Rating };
