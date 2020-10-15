interface NodeLimits {
  maxNodeLimit: Number;
  defaultNodeLimit: Number;
}

export const nodeLimits: NodeLimits = {
  maxNodeLimit: Number(process.env.MAX_EDGE_LIMIT || 50),
  defaultNodeLimit: Number(process.env.DEFAULT_EDGE_LIMIT || 5),
};
