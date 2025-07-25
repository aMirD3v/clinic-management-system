import Login from "./login/page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role) {
    switch (session.user.role) {
      case "RECEPTION":
        redirect("/clinic/reception");
        break;
      case "NURSE":
        redirect("/clinic/nurse");
        break;
      case "DOCTOR":
        redirect("/clinic/doctor");
        break;
      case "LABORATORY":
        redirect("/clinic/laboratory");
        break;
      case "PHARMACY":
        redirect("/clinic/pharmacy");
        break;
      case "STOCK_MANAGER":
        redirect("/stock-manager");
        break;
      default:
        // fallback, could redirect to a generic dashboard or logout
        redirect("/login");
    }
  }

  return <Login />;
}
