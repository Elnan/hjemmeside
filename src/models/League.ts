import { z } from "zod";

export const LeagueSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(50),
  createdAt: z.date(),
  createdById: z.string(),
  inviteCode: z.string(),
  isPrivate: z.boolean(),
});

export const LeagueMemberSchema = z.object({
  id: z.string(),
  leagueId: z.string(),
  userId: z.string(),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
  joinedAt: z.date(),
});

export const LeagueScoreSchema = z.object({
  id: z.string(),
  leagueId: z.string(),
  userId: z.string(),
  gameId: z.string(),
  score: z.number(),
  date: z.date(),
});

export type League = z.infer<typeof LeagueSchema>;
export type LeagueMember = z.infer<typeof LeagueMemberSchema>;
export type LeagueScore = z.infer<typeof LeagueScoreSchema>;
