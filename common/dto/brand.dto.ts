import { ID } from './common.dto';

export interface BrandDto {
  id: ID;
  name: string;
  slug: string;
  country?: string;
  website?: string;
  logoUrl?: string;
}
