/**
 * *** THIS IS JUST A TEMPLATE ***
 * ******* DO NOT KEEP IT! *******
 */

import {
  DataTypes,
  Model,
  Optional,
  UUIDV4,
} from 'sequelize';
import db from '../../db';

export interface UserEntry {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

type OptionalUserEntryFields = 'id' | 'created_at' | 'updated_at';

export type UserEntryAttributes = Optional<UserEntry, OptionalUserEntryFields>;

export class User extends Model<UserEntry, UserEntryAttributes> implements UserEntry {
  public id!: string;

  public email!: string;

  public name!: string;

  public created_at!: string;

  public updated_at!: string;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    tableName: 'users',
    timestamps: true,
    underscored: true,
  },
);
