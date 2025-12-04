import { t } from "elysia";

export const CartModel = {
	cartItemBody: t.Object({
		productId: t.String(),
		quantity: t.Number(),
	}),
	cartItemsBody: t.Array(
		t.Object({
			productId: t.String(),
			quantity: t.Number(),
		})
	),
};

export type CreateCartBody = typeof CartModel.cartItemBody.static;
export type UpdateCartBody = typeof CartModel.cartItemsBody.static;
