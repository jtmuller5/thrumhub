import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { getDb } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "github" && profile) {
        const sql = getDb();
        const githubProfile = profile as {
          id: number;
          login: string;
          avatar_url: string;
        };
        await sql`
          INSERT INTO users (github_id, username, avatar_url)
          VALUES (${githubProfile.id}, ${githubProfile.login}, ${githubProfile.avatar_url})
          ON CONFLICT (github_id) DO UPDATE SET
            username = EXCLUDED.username,
            avatar_url = EXCLUDED.avatar_url
        `;
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as { id: number };
        const sql = getDb();
        const rows = await sql`SELECT id FROM users WHERE github_id = ${githubProfile.id}`;
        if (rows.length > 0) {
          token.dbId = rows[0].id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.dbId) {
        (session as unknown as Record<string, unknown>).dbId = token.dbId;
      }
      return session;
    },
  },
};
