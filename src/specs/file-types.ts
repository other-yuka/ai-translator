import Z from 'zod';

export const fileTypes = ['json'] as const;

export const fileTypeSchema = Z.enum(fileTypes);
