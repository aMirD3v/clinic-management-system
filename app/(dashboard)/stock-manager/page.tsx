import { redirect } from "next/navigation";

export default function StockManagerRootPage() {
  redirect("/stock-manager/dashboard");
}