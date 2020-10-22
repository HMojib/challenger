import DataLoader from "dataloader";
import { EventType, ChallengeType } from "../db";
import { eventType } from "./eventType";
import { challengeType } from "./challengeType";

export interface DataLoaders {
  eventTypeLoader: DataLoader<number, EventType>;
  challengeTypeLoader: DataLoader<number, ChallengeType>;
}
const createLoaders = () => ({
  eventTypeLoader: new DataLoader((keys: readonly number[]) => eventType(keys)),
  challengeTypeLoader: new DataLoader((keys: readonly number[]) =>
    challengeType(keys)
  ),
});

export default createLoaders;
