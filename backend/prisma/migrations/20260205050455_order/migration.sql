-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_table_id_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "table_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("table_id") ON DELETE SET NULL ON UPDATE CASCADE;
