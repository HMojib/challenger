import { Event } from "../../db";
import { Context } from "../context";

export const eventTypeById = async (event: Event, args: {}, ctx: Context) => {
  const { eventType: eventTypeId } = event;

  const { loaders } = ctx;
  const { eventTypeLoader } = loaders;

  const { title } = await eventTypeLoader.load(eventTypeId);

  return title;
};
