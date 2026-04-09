import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class PostImage extends Model {
  declare id: number;
  declare post_id: number;
  declare image_url: string;
}

PostImage.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    post_id: { type: DataTypes.INTEGER, allowNull: false },
    image_url: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    sequelize,
    tableName: "post_images",
    timestamps: false,
  }
);
