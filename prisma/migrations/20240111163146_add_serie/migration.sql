-- CreateTable
CREATE TABLE "Serie" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Serie_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Serie" ADD CONSTRAINT "Serie_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Serie" ADD CONSTRAINT "Serie_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
