import { DataLoaders } from "../../src/loaders";

declare global {
  namespace Express {
    interface Request {
      user?: User | undefined;
      loaders: DataLoaders;
    }
  }
}
