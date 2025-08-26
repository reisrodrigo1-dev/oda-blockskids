import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, integer, boolean } from "drizzle-orm/pg-core";
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

// Tabela de Clientes (Instituições de Ensino)
export const clientes = pgTable("clientes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  razaoSocial: text("razao_social").notNull(),
  nomeFantasia: text("nome_fantasia"),
  cnpj: text("cnpj"),
  email: text("email").notNull(),
  telefone: text("telefone"),
  endereco: json("endereco"),
  ativo: boolean("ativo").notNull().default(true),
  criadoEm: timestamp("criado_em").default(sql`now()`),
  atualizadoEm: timestamp("atualizado_em").default(sql`now()`),
});

// Tabela de Rotas de Estudo por Cliente
export const rotasEstudo = pgTable("rotas_estudo", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clienteId: varchar("cliente_id").notNull(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  codigo: text("codigo").notNull(), // Código único da turma
  projetos: json("projetos").default('[]'),
  ativo: boolean("ativo").notNull().default(true),
  criadoEm: timestamp("criado_em").default(sql`now()`),
  atualizadoEm: timestamp("atualizado_em").default(sql`now()`),
});

// Tabela de Professores
export const professores = pgTable("professores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  telefone: text("telefone"),
  clienteId: varchar("cliente_id").notNull(),
  clienteNome: text("cliente_nome"),
  codigosTurmas: json("codigos_turmas").default('[]'), // Array de códigos de turma
  rotasEstudo: json("rotas_estudo").default('[]'), // Array de IDs das rotas
  ativo: boolean("ativo").notNull().default(true),
  criadoEm: timestamp("criado_em").default(sql`now()`),
  atualizadoEm: timestamp("atualizado_em").default(sql`now()`),
});

// Tabela de Alunos
export const alunos = pgTable("alunos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  idade: integer("idade"),
  professorId: varchar("professor_id").notNull(),
  professorNome: text("professor_nome"),
  clienteId: varchar("cliente_id").notNull(),
  rotaEstudoId: varchar("rota_estudo_id").notNull(),
  rotaEstudoTitulo: text("rota_estudo_titulo"),
  codigoTurma: text("codigo_turma").notNull(),
  progresso: json("progresso").default('{"projetosCompletados": 0, "ultimoAcesso": null, "nivelAtual": 1}'),
  ativo: boolean("ativo").notNull().default(true),
  criadoEm: timestamp("criado_em").default(sql`now()`),
  atualizadoEm: timestamp("atualizado_em").default(sql`now()`),
});

// Tabela de Projetos dos Alunos
export const projetosAlunos = pgTable("projetos_alunos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  alunoId: varchar("aluno_id").notNull(),
  projetoId: text("projeto_id").notNull(), // ID do projeto na rota de estudo
  titulo: text("titulo").notNull(),
  blocos: json("blocos").default('[]'),
  codigo: text("codigo"),
  concluido: boolean("concluido").notNull().default(false),
  tempoGasto: integer("tempo_gasto").default(0), // em minutos
  criadoEm: timestamp("criado_em").default(sql`now()`),
  atualizadoEm: timestamp("atualizado_em").default(sql`now()`),
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

export const insertClienteSchema = createInsertSchema(clientes).omit({
  id: true,
  criadoEm: true,
  atualizadoEm: true,
});

export const insertRotaEstudoSchema = createInsertSchema(rotasEstudo).omit({
  id: true,
  criadoEm: true,
  atualizadoEm: true,
});

export const insertProfessorSchema = createInsertSchema(professores).omit({
  id: true,
  criadoEm: true,
  atualizadoEm: true,
});

export const insertAlunoSchema = createInsertSchema(alunos).omit({
  id: true,
  criadoEm: true,
  atualizadoEm: true,
});

export const insertProjetoAlunoSchema = createInsertSchema(projetosAlunos).omit({
  id: true,
  criadoEm: true,
  atualizadoEm: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertArduinoBoard = z.infer<typeof insertArduinoBoardSchema>;
export type ArduinoBoard = typeof arduinoBoards.$inferSelect;

export type InsertCliente = z.infer<typeof insertClienteSchema>;
export type Cliente = typeof clientes.$inferSelect;

export type InsertRotaEstudo = z.infer<typeof insertRotaEstudoSchema>;
export type RotaEstudo = typeof rotasEstudo.$inferSelect;

export type InsertProfessor = z.infer<typeof insertProfessorSchema>;
export type Professor = typeof professores.$inferSelect;

export type InsertAluno = z.infer<typeof insertAlunoSchema>;
export type Aluno = typeof alunos.$inferSelect;

export type InsertProjetoAluno = z.infer<typeof insertProjetoAlunoSchema>;
export type ProjetoAluno = typeof projetosAlunos.$inferSelect;
