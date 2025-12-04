import prisma from "../../lib/prisma";

export abstract class ProductService {
	static list() {
		return prisma.product.findMany();
	}

	static async getById(id: string) {
		const product = await prisma.product.findUnique({ where: { id } });
		if (!product) throw new Error("PRODUCT_NOT_FOUND");
		return product;
	}

	static create(data: { name: string; price: number; stock: number }) {
		return prisma.product.create({ data });
	}

	static async update(
		id: string,
		data: Partial<{ name: string; price: number; stock: number }>
	) {
		await this.getById(id);
		return prisma.product.update({ where: { id }, data });
	}

	static async delete(id: string) {
		await this.getById(id);
		await prisma.product.delete({ where: { id } });
		return { success: true };
	}
}
