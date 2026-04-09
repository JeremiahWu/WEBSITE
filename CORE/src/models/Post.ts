import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Post extends Model {
  declare id: number;
  declare user_id: number;
  declare content: string;
  declare visibility: "public" | "private" | "friends";
  declare created_at: Date;
  declare updated_at: Date;
}

Post.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    visibility: {
      type: DataTypes.ENUM("public", "private", "friends"),
      defaultValue: "public",
    },
  },
  {
    sequelize,
    tableName: "posts",
    timestamps: true,
    underscored: true,
  }
);
