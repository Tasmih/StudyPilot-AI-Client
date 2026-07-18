import { redirect } from "next/navigation";

export default function ItemsIndexPage() {
  // Automatically redirect the base /items route to the management dashboard
  redirect("/items/manage");
}
