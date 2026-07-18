import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getD1() {
  if (!env.DB) {
    throw new Error("O banco de dados da VCommerce não está disponível.");
  }

  return env.DB;
}

export function getDb() {
  return drizzle(getD1(), { schema });
}
