/**
 * *** THIS IS JUST A TEMPLATE ***
 * ******* DO NOT KEEP IT! *******
 */

import { Post, PostEntry, PostEntryAttributes } from '.';
import logger from '../../../logger';
import { DatabaseErrorResponse, DatabaseErrorMessage } from '../../messages';

export const createPost = async ({
  author,
  title,
  text,
}: PostEntryAttributes): Promise<Post | DatabaseErrorResponse> => {
  try {
    const post = await Post.create({ author, title, text });
    return post;
  } catch (err) {
    logger.error(`Error while writing to DB
      TABLE: ${Post.tableName}
      FN: createPost
      ERROR: ${err}
    `);
    return { error: DatabaseErrorMessage.DB_CONN };
  }
};

export const getUserPosts = async (authorId: string): Promise<Post[] | DatabaseErrorResponse> => {
  try {
    const posts = await Post.findAll({ where: { author: authorId } });
    return posts;
  } catch (err) {
    logger.error(`Error while reading from DB
      TABLE: ${Post.tableName}
      FN: getUserPosts
      ERROR: ${err}
    `);
    return { error: DatabaseErrorMessage.DB_CONN };
  }
};

export const getPostById = async (id: string): Promise<Post | DatabaseErrorResponse> => {
  try {
    const post = await Post.findByPk(id);
    if (!post) return { error: DatabaseErrorMessage.NOT_FOUND };
    return post;
  } catch (err) {
    logger.error(`Error while reading from DB
      TABLE: ${Post.tableName}
      FN: getPostById
      ERROR: ${err}
    `);
    return { error: DatabaseErrorMessage.DB_CONN };
  }
};

type PostUpdateParameters = Partial<PostEntry>;

const _updatePost = async (
  id: string,
  { title, text }: PostUpdateParameters,
): Promise<Post | DatabaseErrorResponse> => {
  if (!id) return { error: DatabaseErrorMessage.BAD_REQUEST };
  if (!title && !text) return { error: DatabaseErrorMessage.BAD_REQUEST };

  let post: Post | null = null;
  try {
    post = await Post.findByPk(id);
  } catch (err) {
    logger.error(`Error while reading from DB
      TABLE: ${Post.tableName}
      FN: _updatePost
      ERROR: ${err}
    `);
    return { error: DatabaseErrorMessage.DB_CONN };
  }

  if (!post) return { error: DatabaseErrorMessage.NOT_FOUND };
  if (title) post.title = title;
  if (text) post.text = text;

  try {
    await post.save();
    return post;
  } catch (err) {
    logger.error(`Error while writing to DB
      TABLE: ${Post.tableName}
      FN: _updatePost
      ERROR: ${err}
    `);
    return { error: DatabaseErrorMessage.DB_CONN };
  }
};

export const updatePostTitle = async (
  id: string,
  title: string,
): Promise<Post | DatabaseErrorResponse> => (
  _updatePost(id, { title })
);

export const updatePostText = async (
  id: string,
  text: string,
): Promise<Post | DatabaseErrorResponse> => (
  _updatePost(id, { text })
);

export const deletePost = async (id: string): Promise<boolean | DatabaseErrorResponse> => {
  try {
    const post = await Post.findByPk(id);
    if (!post) return false;
    await post.destroy();
    return true;
  } catch (err) {
    logger.error(`Error while deleting from DB
      TABLE: ${Post.tableName}
      FN: deletePost
      ERROR: ${err}
    `);
    return { error: DatabaseErrorMessage.DB_CONN };
  }
};
