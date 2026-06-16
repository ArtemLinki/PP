import type { ID } from './common.dto';

export interface CategoryDto {
  id: ID;
  slug: string;
  title: string;
  parentId?: ID | null;
  iconKey?: string;
  productCount?: number;
  children?: CategoryDto[];
}
