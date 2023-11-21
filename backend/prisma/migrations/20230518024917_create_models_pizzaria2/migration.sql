/*
  Warnings:

  - Added the required column `product_id` to the `itens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "itens" ADD COLUMN     "product_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "itens" ADD CONSTRAINT "itens_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
