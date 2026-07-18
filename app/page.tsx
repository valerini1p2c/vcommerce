import { Storefront } from "@/components/storefront/Storefront";
import { demoProducts } from "@/lib/demo-products";

export default function Home() {
  return <Storefront products={demoProducts} />;
}
