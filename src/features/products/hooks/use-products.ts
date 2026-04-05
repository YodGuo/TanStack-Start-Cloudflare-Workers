import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  createProductFn,
  updateProductFn,
  deleteProductFn,
  toggleProductPublishedFn,
  createCategoryFn,
} from "../api/products.api";
import { PRODUCT_KEYS } from "../queries/products.queries";
import type { CreateProductInput, UpdateProductInput } from "../products.schema";

export function useCreateProduct() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateProductInput) => createProductFn({ data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      navigate({ to: "/admin/products" });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductInput) => updateProductFn({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProductFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all }),
  });
}

export function useToggleProductPublished() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; published: boolean }) =>
      toggleProductPublishedFn({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all }),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createCategoryFn,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.categories() }),
  });
}
