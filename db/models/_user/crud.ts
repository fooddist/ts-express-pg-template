/**
 * *** THIS IS JUST A TEMPLATE ***
 * ******* DO NOT KEEP IT! *******
 */

import { User, UserEntry, UserEntryAttributes } from '.';
import logger from '../../../logger';
import { DatabaseErrorResponse, DatabaseErrorMessage } from '../../messages';

export const createUser = async ({
  email,
  name,
}: UserEntryAttributes): Promise<User | DatabaseErrorResponse> => {
  let user;

  try {
    user = await User.findOne({ where: { email } });
  } catch (err) {
    logger.error(`Error while reading from DB
      TABLE: ${User.tableName}
      FN: createUser
      ERROR: ${err}
    `);
    return { error: DatabaseErrorMessage.DB_CONN };
  }

  if (user) return { error: DatabaseErrorMessage.ALREADY_EXISTS };

  try {
    user = await User.create({ email, name });
    return user;
  } catch (err) {
    logger.error(`Error while writing to DB
      TABLE: ${User.tableName}
      FN: createUser
      ERROR: ${err}
    `);
    return { error: DatabaseErrorMessage.DB_CONN };
  }
};

export const getUserById = async (id: string): Promise<User | DatabaseErrorResponse> => {
  try {
    const user = await User.findByPk(id);
    if (!user) return { error: DatabaseErrorMessage.NOT_FOUND };
    return user;
  } catch (err) {
    logger.error(`Error while writing to DB
      TABLE: ${User.tableName}
      FN: getUserById
      ERROR: ${err}
    `);
    return { error: DatabaseErrorMessage.DB_CONN };
  }
};

export const getUserByEmail = async (email: string): Promise<User | DatabaseErrorResponse> => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return { error: DatabaseErrorMessage.NOT_FOUND };
    return user;
  } catch (err) {
    logger.error(`Error while writing to DB
      TABLE: ${User.tableName}
      FN: getUserByEmail
      ERROR: ${err}
    `);
    return { error: DatabaseErrorMessage.DB_CONN };
  }
};

type UserUpdateParameters = Partial<UserEntry>;

const _updateUser = async (
  id: string,
  { email, name }: UserUpdateParameters,
): Promise<User | DatabaseErrorResponse> => {
  if (!id) return { error: DatabaseErrorMessage.BAD_REQUEST };
  if (!email && !name) return { error: DatabaseErrorMessage.BAD_REQUEST };

  let user: User | null = null;
  try {
    user = await User.findByPk(id);
  } catch (err) {
    logger.error(`Error while reading from DB
      TABLE: ${User.tableName}
      FN: _updateUser
      ERROR: ${err}
    `);
    return { error: DatabaseErrorMessage.DB_CONN };
  }

  if (!user) return { error: DatabaseErrorMessage.NOT_FOUND };
  if (email) user.email = email;
  if (name) user.name = name;

  try {
    await user.save();
    return user;
  } catch (err) {
    logger.error(`Error while writing to DB
      TABLE: ${User.tableName}
      FN: _updateUser
      ERROR: ${err}
    `);
    return { error: DatabaseErrorMessage.DB_CONN };
  }
};

export const updateUserEmail = async (
  id: string,
  email: string,
): Promise<User | DatabaseErrorResponse> => (
  _updateUser(id, { email })
);

export const updateUserPassword = async (
  id: string,
  name: string,
): Promise<User | DatabaseErrorResponse> => (
  _updateUser(id, { name })
);

export const deleteUser = async (id: string): Promise<boolean | DatabaseErrorResponse> => {
  try {
    const user = await User.findByPk(id);
    if (!user) return false;
    await user.destroy();
    return true;
  } catch (err) {
    logger.error(`Error while deleting from DB
      TABLE: ${User.tableName}
      FN: deleteUser
      ERROR: ${err}
    `);
    return { error: DatabaseErrorMessage.DB_CONN };
  }
};
