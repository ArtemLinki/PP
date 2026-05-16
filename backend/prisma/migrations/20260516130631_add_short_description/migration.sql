-- DropIndex
DROP INDEX "product_desc_trgm_idx";

-- DropIndex
DROP INDEX "product_name_trgm_idx";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "shortDescription" TEXT;
