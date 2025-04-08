import { DataTypes } from "sequelize";

const UserModel = (sequelize) => {
    return sequelize.define(
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
};

export default UserModel;
