-- CreateTable
CREATE TABLE "StockActivity" (
    "id" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StockActivity" ADD CONSTRAINT "StockActivity_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
