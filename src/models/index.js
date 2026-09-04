import { UserModel } from "./user.model.js";
import { ProfileModel } from "./profile.model.js";
import { ArticleModel } from "./article.model.js";
import { TagModel } from "./tag.model.js";
import { ArticleTagModel } from "./article_tag.model.js";

// 1. Relación 1:1 entre User y Profile
UserModel.hasOne(ProfileModel, { foreignKey: "user_id" });
ProfileModel.belongsTo(UserModel, { foreignKey: "user_id" });

// 2. Relación 1:N entre User y Article
UserModel.hasMany(ArticleModel, { foreignKey: "user_id" });
ArticleModel.belongsTo(UserModel, { foreignKey: "user_id" });

// 3. Relación N:M entre Article y Tag (a través de ArticleTag)
ArticleModel.belongsToMany(TagModel, {
  through: ArticleTagModel,
  foreignKey: "article_id",
});
TagModel.belongsToMany(ArticleModel, {
  through: ArticleTagModel,
  foreignKey: "tag_id",
});
