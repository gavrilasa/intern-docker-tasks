import { Elysia, status } from "elysia";
import { CartService } from "./service";
import { CartModel } from "./model";
import { betterAuthPlugin } from "../../plugins/better-auth";

export const cartModule = new Elysia({
	prefix: "/cart",
	name: "module.cart",
})
	.use(betterAuthPlugin)
	.get(
		"/",
		async ({ user }) => {
			return CartService.getUserCart(user.id);
		},
		{
			auth: true,
		}
	)
	.post(
		"/items",
		async ({ user, body }) => {
			try {
				return await CartService.addItem(
					user.id,
					body.productId,
					body.quantity
				);
			} catch (e) {
				if (e instanceof Error) {
					if (e.message === "PRODUCT_NOT_FOUND")
						throw status(404, "Product not found");
					if (e.message === "INSUFFICIENT_STOCK")
						throw status(400, "Insufficient stock");
					if (e.message === "INVALID_QUANTITY")
						throw status(400, "Invalid quantity");
				}
				throw e;
			}
		},
		{
			auth: true,
			body: CartModel.cartItemBody,
		}
	)
	.put(
		"/items",
		async ({ user, body }) => {
			const results: Array<{
				productId: string;
				ok: boolean;
				data?: unknown;
				error?: string;
			}> = [];

			for (const item of body) {
				try {
					const data = await CartService.setItem(
						user.id,
						item.productId,
						item.quantity
					);
					results.push({ productId: item.productId, ok: true, data });
				} catch (e) {
					let reason = "UNKNOWN_ERROR";
					if (e instanceof Error) reason = e.message;
					results.push({
						productId: item.productId,
						ok: false,
						error: reason,
					});
				}
			}

			return { results };
		},
		{
			auth: true,
			body: CartModel.cartItemsBody,
		}
	);
