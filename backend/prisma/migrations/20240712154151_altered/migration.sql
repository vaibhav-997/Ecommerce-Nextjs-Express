-- CreateEnum
CREATE TYPE "Category" AS ENUM ('MEN', 'WOMEN', 'KID');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'MEN';
