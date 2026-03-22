"use client";

import { useSyncExternalStore } from "react";
import { ProductsDropdown } from "./products-dropdown";

const emptySubscribe = () => () => {};

export function ProductsDropdownClient() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return null;
  }

  return <ProductsDropdown />;
}
