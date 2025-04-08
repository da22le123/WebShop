import { DataTypes } from "sequelize";

const CartModel = (sequelize) => {
    return sequelize.define(
        "Cart",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            // Foreign key to the User table
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "Cart",
            timestamps: true, // createdAt and updatedAt fields
        }
    );
};

export default CartModel;
