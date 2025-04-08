import { DataTypes } from "sequelize";

const UserModel = (sequelize) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: { type: DataTypes.STRING(50), allowNull: true },
            password: { type: DataTypes.STRING(255), allowNull: true }
        },
        {
            tableName: "User",
            timestamps: false,
        },
    );

    // After creating the user, automatically create a cart for the user
    User.afterCreate(async (user, options) => {
        const { Cart } = sequelize.models;
        await Cart.create({ userId: user.id });
    });

    return User;
};

export default UserModel;
