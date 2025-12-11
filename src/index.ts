import { createGenericSync } from '@tern-secure/backend/functions';
import { prisma } from './lib/prisma';

export const syncUserToPrisma = createGenericSync({
  fieldMapping: {
    uid: 'uid',
    email: 'email',
    displayName: 'name',
    photoURL: 'avatar',
    phoneNumber: 'phoneNumber',
    emailVerified: 'emailVerified',
    tenantId: 'tenantId', 
  },

  extraFields: (user) => ({
    CreatedAt: new Date(user.metadata.creationTime),
    LastSignInAt: new Date(user.metadata.lastSignInTime),
    updatedAt: new Date(),
    disabled: user.disabled || false,
    isAdmin: user.customClaims?.admin || false,
    email: user.email?.toLowerCase()
  }),


  syncFn: async (data) => {
    await prisma.users.create({
      data: {
        uid: data.uid,
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        tenantId: data.tenantId,
        isAdmin: data.isAdmin,
        phoneNumber: data.phoneNumber,
        emailVerified: data.emailVerified,
        CreatedAt: data.CreatedAt,
        LastSignInAt: data.LastSignInAt,
        updatedAt: data.updatedAt,
        disabled: data.disabled
      }
    });
  }
});