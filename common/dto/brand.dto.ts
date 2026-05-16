import type { ID } from './common.dto';

export interface BrandDto {
  id: ID;
  slug: string;
  title: string;
  country?: string;
  website?: string;
  logoUrl?: string;
}
