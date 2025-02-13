/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "imageUrl",
ADD COLUMN     "file" TEXT NOT NULL DEFAULT '';
