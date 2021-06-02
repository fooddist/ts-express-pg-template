import { ensureFile, pathExists, writeJson } from 'fs-extra';
import { resolve } from 'path';
import { nanoid } from 'nanoid';
import { ApiScope } from '../lib/types';
import logger from '../logger';
import {
  addService,
  getAllServices,
  ServiceAttributes,
  ServiceNode,
  __checkRootUser,
} from '../redis/store/services';
import { generateKey } from '../lib/uuid';
import { signToken } from '../lib/jwt';

const generateNew = /true/i.test(process.env.GENERATE_ROOT_USER || '');
const configPath = resolve(process.cwd(), './.root/.root.config.json');

const generateRootUserConfig = async (root: ServiceNode): Promise<void> => {
  const token = signToken({ spid: root.spid }, root.key);
  try {
    await ensureFile(configPath);
    await writeJson(configPath, { ...root, token }, { spaces: 2 });
  } catch (err) {
    logger.error(`Cannot write root user config. Error: ${err}`);
  }
};

const generateRandomRoot = (): ServiceAttributes => ({
  spid: nanoid(8),
  label: 'Root User',
  key: generateKey(),
  scope: ApiScope.root,
});

const bootRootUser = async (): Promise<void> => {
  try {
    const rootExists = await __checkRootUser();
    if (typeof rootExists !== 'boolean') throw new Error(rootExists.error);
    const configExists = await pathExists(configPath);
    if (rootExists && configExists) return;
    if (rootExists && !configExists) {
      const result = await getAllServices(ApiScope.root);
      if ('error' in result) throw new Error(result.error);
      return generateRootUserConfig(result[0]);
    }
    if (!rootExists && generateNew) {
      const randomNode = generateRandomRoot();
      const root = await addService(randomNode);
      if (!root) throw new Error('Failed to generate random spid');
      if ('error' in root) throw new Error(root.error);
      return generateRootUserConfig(root);
    }
    logger.warn('Cannot locate root user. Functionality might be limited');
  } catch (err) {
    logger.error(`Cannot verify root user. Error: ${err}`);
  }
};

export default bootRootUser;
