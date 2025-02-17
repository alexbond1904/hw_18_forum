export const roles = ['user', 'admin', 'moderator'] as const;

export type Role = typeof roles[number];