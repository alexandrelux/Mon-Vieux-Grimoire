import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize(`${process.env.POSTGREURL}`);

const Book = sequelize.define(
    "Book",
    {
        _id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
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
    },
    {
        tableName: "Books",
    }
);

const Rating = sequelize.define(
    "Rating",
    {
        _id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        grade: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bookId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Book,
                key: "_id",
            },
        },
    },
    {
        tableName: "Ratings",
    }
);

Book.hasMany(Rating, { foreignKey: "bookId", as: "ratings" });
Rating.belongsTo(Book, { foreignKey: "bookId" });

export { Book, Rating };
