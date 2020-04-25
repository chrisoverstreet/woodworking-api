import * as admin from 'firebase-admin';
import { Request } from 'express';

import DecodedIdToken = admin.auth.DecodedIdToken;

admin.initializeApp({ credential: admin.credential.applicationDefault() });

export async function getFirebaseUserFromRequest(
  req: Request,
): Promise<DecodedIdToken | null> {
  const { authorization } = req.headers;

  if (
    !authorization ||
    !authorization.match(
      /^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
    )
  ) {
    return null;
  }

  const [, token] = authorization.split(' ');
  const decodedToken = await admin.auth().verifyIdToken(token);

  return decodedToken || null;
}

export default admin;
