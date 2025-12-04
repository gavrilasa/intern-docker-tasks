import prisma from "../../lib/prisma";

export abstract class CartService {
	static async getUserCart(userId: string) {
		const items = await prisma.cartItem.findMany({
			where: { userId },
			include: {
				product: true,
			},
		});

		const itemsWithSubtotal = items.map((item) => {
			const subtotal = item.quantity * item.product.price;
			return {
				...item,
				subtotal,
			};
		});

		const total = itemsWithSubtotal.reduce(
			(sum, item) => sum + item.subtotal,
			0
		);

		return {
			items: itemsWithSubtotal,
			total,
		};
	}

	static async addItem(userId: string, productId: string, quantity: number) {
		if (quantity <= 0) throw new Error("INVALID_QUANTITY");

		const product = await prisma.product.findUnique({
			where: { id: productId },
		});
		if (!product) throw new Error("PRODUCT_NOT_FOUND");
		if (product.stock < quantity) throw new Error("INSUFFICIENT_STOCK");

		const existing = await prisma.cartItem.findUnique({
			where: {
				userId_productId: { userId, productId },
			},
		});

		if (existing) {
			return prisma.cartItem.update({
				where: { userId_productId: { userId, productId } },
				data: { quantity: existing.quantity + quantity },
			});
		}

		return prisma.cartItem.create({
			data: { userId, productId, quantity },
		});
	}

	static async setItem(userId: string, productId: string, quantity: number) {
		if (quantity <= 0) {
			await prisma.cartItem
				.delete({
					where: { userId_productId: { userId, productId } },
				})
				.catch(() => {});
			return null;
		}

		const product = await prisma.product.findUnique({
			where: { id: productId },
		});
		if (!product) throw new Error("PRODUCT_NOT_FOUND");
		if (product.stock < quantity) throw new Error("INSUFFICIENT_STOCK");

		const existing = await prisma.cartItem.findUnique({
			where: {
				userId_productId: { userId, productId },
			},
		});

		if (existing) {
			return prisma.cartItem.update({
				where: { userId_productId: { userId, productId } },
				data: { quantity },
			});
		}

		return prisma.cartItem.create({
			data: { userId, productId, quantity },
		});
	}
}
