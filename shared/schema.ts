import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  blocks: json("blocks").notNull().default('{}'),
  code: text("code").notNull().default(''),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const arduinoBoards = pgTable("arduino_boards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  port: text("port").notNull(),
  boardType: text("board_type").notNull(),
  isConnected: text("is_connected").notNull().default('false'),
  lastSeen: timestamp("last_seen").default(sql`now()`),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertArduinoBoardSchema = createInsertSchema(arduinoBoards).omit({
  id: true,
  lastSeen: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertArduinoBoard = z.infer<typeof insertArduinoBoardSchema>;
export type ArduinoBoard = typeof arduinoBoards.$inferSelect;
