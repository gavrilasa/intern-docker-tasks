import { t } from "elysia";

export const ProductModel = {
	createBody: t.Object({
		name: t.String(),
		price: t.Number(),
		stock: t.Number(),
	}),
	updateBody: t.Partial(
		t.Object({
			name: t.String(),
			price: t.Number(),
			stock: t.Number(),
		})
	),
};

export type CreateProductBody = typeof ProductModel.createBody.static;
export type UpdateProductBody = typeof ProductModel.updateBody.static;
