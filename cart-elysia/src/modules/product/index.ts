import { Elysia, status } from "elysia";
import { ProductService } from "./service";
import { ProductModel } from "./model";

export const productModule = new Elysia({
	prefix: "/products",
	name: "module.products",
})
	.get("/", () => ProductService.list())
	.get("/:id", async ({ params: { id } }) => {
		try {
			return await ProductService.getById(id);
		} catch (e) {
			if (e instanceof Error && e.message === "PRODUCT_NOT_FOUND") {
				throw status(404, "Product not found");
			}
			throw e;
		}
	})
	.post(
		"/",
		async ({ body }) => {
			return ProductService.create(body);
		},
		{
			body: ProductModel.createBody,
		}
	)
	.patch(
		"/:id",
		async ({ params: { id }, body }) => {
			return ProductService.update(id, body);
		},
		{
			body: ProductModel.updateBody,
		}
	)
	.delete("/:id", async ({ params: { id } }) => {
		await ProductService.delete(id);
		return { success: true };
	});
