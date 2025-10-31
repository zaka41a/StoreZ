# StoreZ Sample Orders Data Summary

## Execution Status: ✅ SUCCESS

Sample order data has been successfully created and inserted into the StoreZ PostgreSQL database.

---

## Database Connection Details
- **Container**: storez-db (postgres:16)
- **Host**: localhost:5432
- **Database**: storez
- **User**: storez
- **Password**: storez

---

## Data Created

### Overview Statistics
- **Total Orders**: 10
- **Total Order Items**: 24
- **Date Range**: May 1, 2025 - October 24, 2025 (6 months)
- **Total Revenue**: $14,613.71
- **Customers**: 2 (ZAKARIA SABIRI and issam sabiri)

### Orders by Status
| Status    | Count | Percentage |
|-----------|-------|------------|
| DELIVERED | 6     | 60%        |
| PENDING   | 1     | 10%        |
| APPROVED  | 1     | 10%        |
| SHIPPED   | 1     | 10%        |
| CANCELLED | 1     | 10%        |

---

## Monthly Sales Breakdown

| Month    | Orders | Delivered | Total Revenue |
|----------|--------|-----------|---------------|
| 2025-05  | 1      | 1         | $3,159.97     |
| 2025-06  | 1      | 1         | $2,149.97     |
| 2025-07  | 1      | 1         | $929.98       |
| 2025-08  | 2      | 0         | $2,037.97     |
| 2025-09  | 2      | 1         | $2,838.96     |
| 2025-10  | 3      | 2         | $3,496.93     |

---

## Detailed Order Information

### Order #1 - May 1, 2025 (DELIVERED)
- **Customer**: ZAKARIA SABIRI
- **Products**:
  - Apple MacBook Pro 16" (x1) - $2,599.99
  - AirPods Pro 2 (x2) - $279.99 each
- **Total**: $3,159.97

### Order #2 - June 15, 2025 (DELIVERED)
- **Customer**: issam sabiri
- **Products**:
  - iPhone 15 Pro (x1) - $1,299.99
  - Sony WH-1000XM5 (x1) - $399.99
  - Apple Watch Series 9 (x1) - $449.99
- **Total**: $2,149.97

### Order #3 - July 8, 2025 (DELIVERED)
- **Customer**: ZAKARIA SABIRI
- **Products**:
  - Dyson V15 Detect (x1) - $699.99
  - Philips Airfryer XXL (x1) - $229.99
- **Total**: $929.98

### Order #4 - August 22, 2025 (SHIPPED)
- **Customer**: issam sabiri
- **Products**:
  - Nike Air Max 270 (x2) - $129.99 each
  - Adidas Ultraboost (x1) - $149.99
  - Ray-Ban Wayfarer (x1) - $129.00
- **Total**: $538.97

### Order #5 - August 28, 2025 (CANCELLED)
- **Customer**: ZAKARIA SABIRI
- **Products**:
  - Dell XPS 13 (x1) - $1,499.00
- **Total**: $1,499.00

### Order #6 - September 10, 2025 (DELIVERED)
- **Customer**: issam sabiri
- **Products**:
  - GoPro Hero 12 (x1) - $499.00
  - Kindle Paperwhite (x1) - $159.99
  - Logitech MX Master 3S (x1) - $129.99
- **Total**: $788.98

### Order #7 - September 20, 2025 (APPROVED)
- **Customer**: ZAKARIA SABIRI
- **Products**:
  - Samsung Galaxy S24 Ultra (x1) - $1,199.99
  - iPad Air 5 (x1) - $849.99
- **Total**: $2,049.98

### Order #8 - October 5, 2025 (DELIVERED)
- **Customer**: issam sabiri
- **Products**:
  - Bose SoundLink Revolve (x2) - $199.99 each
  - Marshall Acton II (x1) - $299.00
  - Nespresso Vertuo Next (x1) - $179.99
- **Total**: $878.97

### Order #9 - October 18, 2025 (PENDING)
- **Customer**: ZAKARIA SABIRI
- **Products**:
  - Casio G-Shock (x1) - $179.00
  - Logitech MX Master 3S (x2) - $129.99 each
- **Total**: $438.98

### Order #10 - October 24, 2025 (DELIVERED)
- **Customer**: issam sabiri
- **Products**:
  - Dell XPS 13 (x1) - $1,499.00
  - Sony WH-1000XM5 (x1) - $399.99
  - AirPods Pro 2 (x1) - $279.99
- **Total**: $2,178.98

---

## Product Distribution

### Most Ordered Products
1. **Sony WH-1000XM5** - 2 orders (2 units)
2. **AirPods Pro 2** - 2 orders (3 units total)
3. **Dell XPS 13** - 2 orders (2 units)
4. **Logitech MX Master 3S** - 2 orders (3 units total)
5. **Nike Air Max 270** - 1 order (2 units)
6. **Bose SoundLink Revolve** - 1 order (2 units)

### Product Categories Represented
- Electronics (MacBooks, Dell XPS, iPhone, Samsung Galaxy)
- Wearables (Apple Watch, Casio G-Shock)
- Audio (Headphones, Speakers, AirPods)
- Home Appliances (Dyson Vacuum, Philips Airfryer, Nespresso)
- Accessories (Ray-Ban, Nike Shoes, Adidas Shoes)
- Tech Gadgets (GoPro, Kindle, Mouse)
- Tablets (iPad Air)

---

## Data Characteristics

### Realistic Features Included:
✅ Orders distributed across 6 months (May - October 2025)
✅ Multiple order statuses representing order lifecycle
✅ Varying order values ($439 - $3,160)
✅ Different customer purchase patterns
✅ Mix of single and multi-item orders
✅ High-value electronics and everyday items
✅ Repeat customers with multiple orders
✅ Cancelled and pending orders for realistic scenarios

### Foreign Key Integrity:
✅ All orders linked to existing users (IDs: 1, 2)
✅ All order items linked to valid product IDs (1-21)
✅ All order items properly associated with orders
✅ No orphaned records

---

## Verification Queries

Use these SQL queries to verify the data in your database:

```sql
-- Count total orders
SELECT COUNT(*) as total_orders FROM orders;

-- Count total order items
SELECT COUNT(*) as total_order_items FROM order_item;

-- Orders by status
SELECT status, COUNT(*) as count
FROM orders
GROUP BY status
ORDER BY status;

-- Monthly revenue
WITH monthly_revenue AS (
    SELECT
        TO_CHAR(o.created_at, 'YYYY-MM') as month,
        o.id as order_id,
        o.status,
        SUM(oi.quantity * p.price) as order_total
    FROM orders o
    LEFT JOIN order_item oi ON o.id = oi.order_id
    LEFT JOIN product p ON oi.product_id = p.id
    GROUP BY o.id, TO_CHAR(o.created_at, 'YYYY-MM'), o.status
)
SELECT
    month,
    COUNT(*) as orders_count,
    SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END) as delivered_orders,
    ROUND(SUM(order_total)::numeric, 2) as total_revenue
FROM monthly_revenue
GROUP BY month
ORDER BY month;

-- Detailed order view
SELECT
    o.id,
    TO_CHAR(o.created_at, 'YYYY-MM-DD HH24:MI') as order_datetime,
    o.status,
    u.name,
    STRING_AGG(p.name || ' (x' || oi.quantity || ')', ', ' ORDER BY oi.id) as products,
    ROUND(SUM(oi.quantity * p.price)::numeric, 2) as total
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_item oi ON o.id = oi.order_id
JOIN product p ON oi.product_id = p.id
GROUP BY o.id, o.created_at, o.status, u.name
ORDER BY o.created_at;
```

---

## Next Steps

1. **Test Analytics Dashboard**:
   - Refresh your admin analytics page
   - Verify "Monthly Sales Overview" now displays data
   - Check charts and graphs render correctly

2. **Test Order Management**:
   - View orders in the admin panel
   - Filter by status
   - Test order detail views

3. **Test User Order History**:
   - Login as ZAKARIA SABIRI (zaksab89@gmail.com)
   - Verify order history displays correctly
   - Login as issam sabiri (issam@gmail.com)
   - Verify their order history

4. **Additional Data** (Optional):
   - You can re-run the `sample_orders.sql` script to add more data
   - Modify dates in the script to fit different time periods
   - Adjust quantities and products to test various scenarios

---

## Files Created

1. **`/Users/zakaria/Documents/AllProjects-java/StoreZ/backend/sample_orders.sql`**
   - Complete SQL script with INSERT statements
   - Well-commented and organized
   - Can be re-run to add more sample data

2. **`/Users/zakaria/Documents/AllProjects-java/StoreZ/backend/SAMPLE_DATA_SUMMARY.md`**
   - This summary document
   - Complete breakdown of all created data
   - Verification queries included

---

## Database Schema Notes

### Orders Table Structure:
```
orders (
  id BIGINT PRIMARY KEY (auto-generated),
  created_at TIMESTAMP(6),
  status VARCHAR(255) CHECK (status IN 'PENDING', 'APPROVED', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
  user_id BIGINT FK -> users(id)
)
```

### Order Items Table Structure:
```
order_item (
  id BIGINT PRIMARY KEY (auto-generated),
  quantity INTEGER NOT NULL,
  order_id BIGINT FK -> orders(id),
  product_id BIGINT FK -> product(id)
)
```

**Note**: The order_item table does NOT store the price at time of purchase. Prices are calculated by joining with the product table. This means historical order totals will change if product prices are updated.

### Recommendation for Production:
Consider adding a `price_at_purchase` column to the order_item table to preserve historical pricing:
```sql
ALTER TABLE order_item ADD COLUMN price_at_purchase NUMERIC(10,2);
```

---

## Troubleshooting

### If orders don't appear in analytics:
1. Clear application cache
2. Restart the Spring Boot application: `docker restart storez-app`
3. Check application logs: `docker logs storez-app`
4. Verify database connection in application

### To reset and re-run:
```sql
-- Delete all order items first (foreign key constraint)
DELETE FROM order_item;

-- Then delete all orders
DELETE FROM orders;

-- Reset sequences (optional)
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_item_id_seq RESTART WITH 1;

-- Re-run the sample_orders.sql script
```

---

**Generated**: 2025-10-31
**Database**: PostgreSQL 16 in Docker
**Status**: ✅ All data successfully inserted and verified
