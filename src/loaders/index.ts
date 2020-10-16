import DataLoader from "dataloader";
import { EventType } from "../db";
import { eventType } from "./eventType";

export interface DataLoaders {
  eventTypeLoader: DataLoader<number, EventType>;
}
const createLoaders = () => ({
  eventTypeLoader: new DataLoader((keys: readonly number[]) => eventType(keys)),
});

export default createLoaders;
