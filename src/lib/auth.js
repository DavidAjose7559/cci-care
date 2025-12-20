import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

function isAdminEmail(email) {
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return email && list.includes(email.toLowerCase());
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { host } = new URL(url);
        const transport = nodemailer.createTransport(provider.server);

        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to CCI Care Network`,
          text: `Sign in to ${host}\n${url}\n\nIf you did not request this email, you can ignore it.`,
          html: `
            <p>Sign in to <strong>${host}</strong></p>
            <p><a href="${url}">Click here to sign in</a></p>
            <p>If you did not request this email, you can ignore it.</p>
          `,
        });
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      const existing = await prisma.user.findUnique({
        where: { email: user.email },
        include: { profile: true },
      });

      if (existing) {
        if (isAdminEmail(user.email) && existing.role !== "ADMIN") {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: "ADMIN" },
          });
        }

        if (!existing.profile) {
          await prisma.profile.create({
            data: { userId: existing.id },
          });
        }
      }

      return true;
    },

    async jwt({ token }) {
      if (!token?.email) return token;

      const dbUser = await prisma.user.findUnique({
        where: { email: token.email },
        select: { id: true, role: true, status: true },
      });

      if (dbUser) {
        token.userId = dbUser.id;
        token.role = dbUser.role;
        token.status = dbUser.status;
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.userId;
        session.user.role = token.role;
        session.user.status = token.status;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-request",
  },
};
