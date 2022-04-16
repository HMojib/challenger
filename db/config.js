module.exports = {
  db: {
    seed: {
      count: Number(process.env.SEED_COUNT || 10),
    },
  },
};
