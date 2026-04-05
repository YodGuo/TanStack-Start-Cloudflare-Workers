import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import type { Env } from "@/lib/env";

export function db(d1: Env["DB"]) {
  return drizzle(d1, { schema });
}

export type DB = ReturnType<typeof db>;
