import { User } from "./User";
import { Post } from "./Post";
import { PostImage } from "./PostImage";

// Associations
User.hasMany(Post, { foreignKey: "user_id", as: "posts" });
Post.belongsTo(User, { foreignKey: "user_id", as: "author" });

Post.hasMany(PostImage, { foreignKey: "post_id", as: "images", onDelete: "CASCADE" });
PostImage.belongsTo(Post, { foreignKey: "post_id" });

export { User, Post, PostImage };
