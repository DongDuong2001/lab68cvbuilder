"use client";

import { useEffect, useState } from "react";
import { ProductsDropdown } from "./products-dropdown";

export function ProductsDropdownClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <ProductsDropdown />;
}
