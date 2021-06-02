import healthcheck from './routes/healthcheck';
import bootServer from './server';
import bootRootUser from './server/root';

const PORT = Number(process.env.PORT);

const main = async () => {
  await bootRootUser();
  const server = bootServer(PORT);
  healthcheck(server);
};

main();
