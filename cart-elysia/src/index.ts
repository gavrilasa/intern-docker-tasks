import { Elysia } from "elysia";
import { betterAuthPlugin } from "./plugins/better-auth";
import { cartModule } from "./modules/cart";
import { productModule } from "./modules/product";
import openapi from "@elysiajs/openapi";
import { auth } from "./lib/auth";

const app = new Elysia()
	.mount(auth.handler)
	.use(openapi())
	.use(betterAuthPlugin)
	.use(productModule)
	.use(cartModule)
	.listen(3000);
