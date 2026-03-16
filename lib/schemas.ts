import { z } from "zod";

export const completeChecklistSchema = z.object({
  taskId: z.string().min(1),
  taskTitle: z.string().min(1),
  taskIcon: z.string().optional(),
  workerName: z.string().optional(),
  siteName: z.string().optional(),
  siteId: z.string().optional(),
  checkedCount: z.number().int().min(0),
  totalCount: z.number().int().min(1),
  location: z.string().optional(),
  notes: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional(),
});

export const createSiteSchema = z.object({
  name: z.string().min(1).max(200),
  address: z.string().max(500).optional(),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
});

export const updateSiteSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200).optional(),
  address: z.string().max(500).optional().nullable(),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
  active: z.boolean().optional(),
});

export type CompleteChecklistInput = z.infer<typeof completeChecklistSchema>;
export type CreateSiteInput = z.infer<typeof createSiteSchema>;
export type UpdateSiteInput = z.infer<typeof updateSiteSchema>;
