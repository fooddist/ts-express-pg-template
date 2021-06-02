import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import store from '../redis/store';

const {
  RL_WINDOW = 100000,
  RL_MAX = 100,
} = process.env;

const limiter = rateLimit({
  store: new RedisStore({
    client: store,
  }),
  windowMs: +RL_WINDOW,
  max: +RL_MAX,
});

export default limiter;
