import { SnakeToCamel } from "../types/SnakeToCamel";

export const mapFromSnakeToCamel = <T extends string>(text: T) =>
  text.replace(/(_\w)/g, (word) => word[1].toUpperCase()) as SnakeToCamel<T>;
