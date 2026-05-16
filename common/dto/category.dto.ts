import { ID } from './common.dto';

export interface CategoryDto {
  id: ID;
  name: string;
  slug: string;
  parentId?: ID;
  isVisible: boolean;
  order: number;
  children?: CategoryDto[];
}
