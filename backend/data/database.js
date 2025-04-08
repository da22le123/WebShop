import bcrypt from "bcrypt";
import { Sequelize } from "sequelize";
import UserModel from "./model/User.js";
import ProductModel from "./model/Product.js";
const dbFilePath = process.env.DB_PATH ?? "database.sqlite";

// Database configuration
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbFilePath, // File path for the SQLite database
    logging: false, // Disable Sequelize logs
    dialectOptions: {
        busyTimeout: 3000, // Wait up to 3 seconds for the lock to be released
    },
});

// Import and initialize models
const User = UserModel(sequelize);
const Product = ProductModel(sequelize);

// method for creating the database file and syncing the schema
const createDatabaseFile = async () => {
    await sequelize.authenticate();
    await sequelize.sync();
};

// Function to connect to the database
const connectToDatabase = async () => {
    try {
        await createDatabaseFile();
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
        throw error;
    }
};

// Function to close the database connection
const closeConnection = async () => {
    try {
        await sequelize.close();
    } catch (error) {
        console.error("Error closing the database connection:", error.message);
        throw error;
    }
};

async function createDefaultAdminUser() {
    const hashedPassword = await bcrypt.hash("password", 10);

    return User.create({
        username: "admin",
        password: hashedPassword,
    })
}

export {
    sequelize,
    User,
    Product,
    connectToDatabase,
    closeConnection,
    createDefaultAdminUser,
};
