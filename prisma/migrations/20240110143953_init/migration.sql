-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "sportId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
