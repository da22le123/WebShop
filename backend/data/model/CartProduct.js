import { DataTypes } from "sequelize";

const CartProductModel = (sequelize) => {
    return sequelize.define(
        "CartProduct",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            cartId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
        },
        {
            tableName: "CartProduct",
            timestamps: false,
        }
    );
};

export default CartProductModel;
