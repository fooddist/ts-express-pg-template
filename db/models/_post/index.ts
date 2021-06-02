/**
 * *** THIS IS JUST A TEMPLATE ***
 * ******* DO NOT KEEP IT! *******
 */

import {
  Association,
  DataTypes,
  Model,
  Optional,
  UUIDV4,
} from 'sequelize';
import db from '../../db';
import { User } from '../_user';

export interface PostEntry {
  id: string;
  author: string;
  title: string;
  text: string;
  created_at: string;
  updated_at: string;
}

type OptionalPostEntryFields = 'id' | 'created_at' | 'updated_at';
export type PostEntryAttributes = Optional<PostEntry, OptionalPostEntryFields>;

export class Post extends Model<PostEntry, PostEntryAttributes> implements PostEntry {
  public id!: string;

  public author!: string;

  public title!: string;

  public text!: string;

  public created_at!: string;

  public updated_at!: string;

  public static associations: {
    author: Association<Post, User>;
  }
}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    author: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: 'posts',
    timestamps: true,
    underscored: true,
  },
);
