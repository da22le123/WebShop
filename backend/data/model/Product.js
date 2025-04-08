import { DataTypes } from "sequelize";

const ProductModel = (sequelize) => {
    return sequelize.define(
        "Product",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: { type: DataTypes.STRING(50), allowNull: false },
            price: { type: DataTypes.INTEGER, allowNull: false }
        },
        {
            tableName: "Product",
            timestamps: false,
        },
    );
};

export default ProductModel;
