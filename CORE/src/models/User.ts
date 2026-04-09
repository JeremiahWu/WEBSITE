import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class User extends Model {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password_hash: string;
  declare avatar: string | null;
  declare bio: string | null;
  declare created_at: Date;
  declare updated_at: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true, allowNull: false, validate: { isEmail: true } },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    avatar: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },
    bio: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);
