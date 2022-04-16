import { Request } from "express";

/**
 * GraphQL API context variables.
 */
export class Context {
  private readonly req: Request;

  constructor(req: Request) {
    this.req = req;
  }

  /**
   * The currently logged in user.
   */
  get user() {
    return this.req.user;
  }

  get loaders() {
    return this.req.loaders;
  }
}
