export interface WordGroup {
  id: number;
  category: string;
  words: string[];
  color: string;
  difficulty: "easy" | "medium" | "hard" | "very hard";
}
