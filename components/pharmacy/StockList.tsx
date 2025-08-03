// components/pharmacy/StockList.tsx

import { Stock } from "@prisma/client";

type StockListProps = {
  stocks: Stock[];
};

export function StockList({ stocks }: StockListProps) {
  return (
    <div className="space-y-2">
      {stocks.map((stock) => (
        <div key={stock.id} className="border p-4 rounded-lg">
          <h3 className="font-medium">{stock.medicineName}</h3>
          <p className="text-sm text-gray-600">{stock.description}</p>
          <div className="flex justify-between mt-2">
            <span>
              Quantity: {stock.quantity} unit {stock.unit}
            </span>
            <span>Price: ${stock.price?.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Expires: {new Date(stock.expiryDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
