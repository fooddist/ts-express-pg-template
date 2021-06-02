/**
 * *** THIS IS JUST A TEMPLATE ***
 * ******* DO NOT KEEP IT! *******
 */

import { User } from './_user';
import { Post } from './_post';

const associate = (): void => {
  const userPostAssociation = {
    sourceKey: 'id',
    foreignKey: 'author',
    as: 'posts',
  };
  User.hasMany(Post, userPostAssociation);
  Post.belongsTo(User, userPostAssociation);
};

export default associate;
