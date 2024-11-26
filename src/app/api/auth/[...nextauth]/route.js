import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import mongooseConnection from '../../../../../lib/mongoose'; // Ensure this path is correct
import { User } from '../../../../../model/User'; // Ensure this path is correct
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import client from '../../../../../lib/mongodb'; // Ensure this path is correct

export const authOptions = {
  adapter: MongoDBAdapter(client),
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXTAUTH_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials) {
        await mongooseConnection(); // Ensure mongoose is connected

        const { email, password } = credentials;
        try {
          const userRecord = await User.findOne({ email });
          if (!userRecord) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, userRecord.password);
          if (!passwordMatch) {
            return null;
          }

          console.log('Authenticated user:', userRecord);
          return userRecord; // Return user record containing _id
        } catch (error) {
          console.error('Authorization Error:', error); // Improved error logging
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Attach _id to token if user is defined
      if (user) {
        token.id = user._id ? user._id.toString() : user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach token id to session
      if (token) {
        session.user.id = token.id; // MongoDB _id
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
