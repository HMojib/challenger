import { GraphQLNonNull, GraphQLID, GraphQLResolveInfo } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { fromGlobalId, parseInterval } from "../../utils";
import { Context } from "../context";
import {
  EventType,
  EventInputType,
  EventPatchType,
  EventPatch,
  EventInput,
  Interval,
  DeleteEventInput,
} from "../types";
import {
  pgPool,
  getEventById,
  insertEvent,
  updateEventById,
  deleteEventById,
  User,
  Event,
  UpdateEvent,
} from "../../db";
import { eventById } from "../resolvers";

export interface CreateEventInput {
  event: EventInput;
}

export interface UpdatEventInput {
  id: string;
  patch: EventPatch;
}

const validateEventMutation = (event: Event, userId: string): boolean => {
  if (!event) {
    throw new Error("Event not found");
  } else if (event.createdBy !== userId) {
    throw new Error("You don't have permission to modify this Event");
  } else {
    return true;
  }
};

const convertUpdatePatch = (patch: EventPatch): UpdateEvent => {
  const event: UpdateEvent = {};
  const keys = Object.keys(patch);

  for (const key of keys) {
    const value = patch[key];

    if (value) {
      event[key] =
        key === "frequency"
          ? parseInterval(value as Interval)
          : (value as string);
    }
  }

  return event;
};

export const createEvent = mutationWithClientMutationId({
  name: "CreateEvent",
  description: "Create a new event",

  inputFields: {
    event: { type: new GraphQLNonNull(EventInputType) },
  },

  outputFields: {
    event: {
      type: EventType,
      resolve: ({ id }: Event, args, ctx: Context, info: GraphQLResolveInfo) =>
        eventById(id, info),
    },
  },

  mutateAndGetPayload: async (input: CreateEventInput, ctx: Context) => {
    const user = ctx.user as User;
    const { id: userId } = user;
    const { frequency, ...event } = input.event;
    const pgClient = await pgPool.connect();

    try {
      return insertEvent(pgClient, {
        ...event,
        frequency: parseInterval(frequency),
        createdBy: userId,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      //TODO log error
      throw new Error("Unable to create new event");
    } finally {
      pgClient.release();
    }
  },
});

export const updateEvent = mutationWithClientMutationId({
  name: "UpdateEvent",
  description: "Update an existing event",

  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    patch: { type: new GraphQLNonNull(EventPatchType) },
  },

  outputFields: {
    event: {
      type: EventType,
      resolve: ({ id }: Event, args, ctx: Context, info: GraphQLResolveInfo) =>
        eventById(id, info),
    },
  },

  mutateAndGetPayload: async ({ id, patch }: UpdatEventInput, ctx: Context) => {
    const user = ctx.user as User;
    const { id: userId } = user;
    const eventId = fromGlobalId(id, "Event");

    const event = convertUpdatePatch(patch);

    const pgClient = await pgPool.connect();

    try {
      const currentEvent = await getEventById(pgClient, eventId, [
        "created_by",
      ]);

      validateEventMutation(currentEvent, userId);

      return updateEventById(pgClient, eventId, event);
    } finally {
      pgClient.release();
    }
  },
});

export const deleteEvent = mutationWithClientMutationId({
  name: "DeleteEvent",
  description: "Delete an existing event",

  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },

  outputFields: {
    event: {
      type: EventType,
      resolve: ({ id }: Event, args, ctx: Context, info: GraphQLResolveInfo) =>
        eventById(id, info),
    },
  },

  mutateAndGetPayload: async (
    { id }: DeleteEventInput,
    ctx: Context,
    info: GraphQLResolveInfo
  ) => {
    const user = ctx.user as User;
    const { id: userId } = user;
    const eventId = fromGlobalId(id, "Event");

    const pgClient = await pgPool.connect();

    try {
      const currentEvent = await getEventById(pgClient, eventId, ["createdBy"]);

      validateEventMutation(currentEvent, userId);

      return deleteEventById(pgClient, eventId);
    } finally {
      pgClient.release();
    }
  },
});
