import { queryOptions } from "@tanstack/react-query";
import {
  getProductsFn,
  getProductBySlugFn,
  getCategoriesFn,
  getAdminProductsFn,
  getAdminProductByIdFn,
} from "../api/products.api";

export const PRODUCT_KEYS = {
  all:        ["products"] as const,
  list:       (categoryId?: string) => ["products", "list", categoryId ?? "all"] as const,
  detail:     (slug: string)        => ["products", "detail", slug] as const,
  categories: ()                    => ["products", "categories"] as const,
  adminList:  ()                    => ["products", "admin", "list"] as const,
  adminById:  (id: string)          => ["products", "admin", id] as const,
};

export function productsQuery(categoryId?: string) {
  return queryOptions({
    queryKey: PRODUCT_KEYS.list(categoryId),
    queryFn: () => getProductsFn({ data: { categoryId } }),
  });
}

export function productBySlugQuery(slug: string) {
  return queryOptions({
    queryKey: PRODUCT_KEYS.detail(slug),
    queryFn: () => getProductBySlugFn({ data: { slug } }),
  });
}

export function categoriesQuery() {
  return queryOptions({
    queryKey: PRODUCT_KEYS.categories(),
    queryFn: () => getCategoriesFn(),
  });
}

export function adminProductsQuery() {
  return queryOptions({
    queryKey: PRODUCT_KEYS.adminList(),
    queryFn: () => getAdminProductsFn(),
  });
}

export function adminProductByIdQuery(id: string) {
  return queryOptions({
    queryKey: PRODUCT_KEYS.adminById(id),
    queryFn: () => getAdminProductByIdFn({ data: { id } }),
  });
}
