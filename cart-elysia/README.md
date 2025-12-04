# Mini Cart API

API Cart mini berbasis **Elysia + Prisma + Better Auth** yang mendukung:

- Produk dengan stok
- Cart per-user (stateful)
- Validasi quantity vs stock
- Total price dihitung otomatis setiap fetch cart
- Auth wajib login untuk fitur Cart per-user
- OpenAPI untuk testing manual

---

## Teknologi

| Komponen                     | Peran                        |
| ---------------------------- | ---------------------------- |
| Elysia                       | HTTP Controller + Validation |
| Prisma                       | Database ORM                 |
| Better Auth                  | Authentication + Session     |
| JWT Plugin (Better Auth)     | Token                        |
| OpenAPI Plugin (Better Auth) | Dokumentasi API Auth         |
| OpenAPI Plugin (Elysia JS)   | Dokumentasi API Cart         |

---

## Database Schema (Prisma)

Entitas utama:

- `Product`: `id`, `name`, `price`, `stock`
- `CartItem`: `userId`, `productId`, `quantity`

Cart belum memotong stok.

---

## Business Logic

### getUserCart

- Load items + product
- Tambahkan `subtotal`
- Hitung `total`

### addItem

- Increment quantity
- `quantity > 0`
- Validasi hanya pada `delta` vs `stock`
- Bisa menghasilkan total quantity > stock (trade-off cart modern)

### setItem

- Absolute quantity
- `quantity <= 0` → delete
- Validasi `quantity <= stock`

### delete

- Via `setItem(..., 0)`
- Endpoint DELETE dapat ditambahkan jika ingin eksplisit

---

## Cara Uji API

1. **Daftar/Login** melalui OpenAPI Reference Better Auth
   http://localhost:3000/api/auth/reference
2. **Uji Product dan Cart** via Swagger UI OpenAPI
   http://localhost:3000/openapi
