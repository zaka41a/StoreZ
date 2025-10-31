-- Quick Verification Script for StoreZ Orders Data
-- Run this to verify sample orders were created successfully

\echo '========================================='
\echo 'STOREZ ORDERS DATA VERIFICATION'
\echo '========================================='
\echo ''

\echo '1. TOTAL COUNTS'
\echo '-----------------------------------------'
SELECT
    (SELECT COUNT(*) FROM orders) as total_orders,
    (SELECT COUNT(*) FROM order_item) as total_order_items,
    (SELECT COUNT(DISTINCT user_id) FROM orders) as customers_with_orders;
\echo ''

\echo '2. ORDERS BY STATUS'
\echo '-----------------------------------------'
SELECT
    status,
    COUNT(*) as count,
    ROUND(COUNT(*)::numeric * 100.0 / (SELECT COUNT(*) FROM orders), 1) as percentage
FROM orders
GROUP BY status
ORDER BY count DESC;
\echo ''

\echo '3. MONTHLY SALES SUMMARY'
\echo '-----------------------------------------'
WITH monthly_stats AS (
    SELECT
        TO_CHAR(o.created_at, 'YYYY-MM') as month,
        TO_CHAR(o.created_at, 'Mon YYYY') as month_name,
        o.id,
        o.status,
        COALESCE(SUM(oi.quantity * p.price), 0) as order_total
    FROM orders o
    LEFT JOIN order_item oi ON o.id = oi.order_id
    LEFT JOIN product p ON oi.product_id = p.id
    GROUP BY o.id, TO_CHAR(o.created_at, 'YYYY-MM'), TO_CHAR(o.created_at, 'Mon YYYY'), o.status
)
SELECT
    month_name as "Month",
    COUNT(*) as "Total Orders",
    SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END) as "Delivered",
    '$' || ROUND(SUM(order_total)::numeric, 2) as "Revenue"
FROM monthly_stats
GROUP BY month, month_name
ORDER BY month;
\echo ''

\echo '4. TOP 5 PRODUCTS SOLD'
\echo '-----------------------------------------'
SELECT
    p.name as "Product",
    COUNT(DISTINCT oi.order_id) as "Times Ordered",
    SUM(oi.quantity) as "Units Sold",
    '$' || ROUND(SUM(oi.quantity * p.price)::numeric, 2) as "Total Revenue"
FROM order_item oi
JOIN product p ON oi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY "Total Revenue" DESC
LIMIT 5;
\echo ''

\echo '5. CUSTOMER ORDER SUMMARY'
\echo '-----------------------------------------'
SELECT
    u.name as "Customer",
    u.email as "Email",
    COUNT(o.id) as "Total Orders",
    '$' || ROUND(SUM(
        (SELECT SUM(oi.quantity * p.price)
         FROM order_item oi
         JOIN product p ON oi.product_id = p.id
         WHERE oi.order_id = o.id)
    )::numeric, 2) as "Total Spent"
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY "Total Orders" DESC;
\echo ''

\echo '6. RECENT ORDERS (Last 5)'
\echo '-----------------------------------------'
SELECT
    o.id as "Order ID",
    TO_CHAR(o.created_at, 'YYYY-MM-DD') as "Date",
    o.status as "Status",
    u.name as "Customer",
    '$' || ROUND(SUM(oi.quantity * p.price)::numeric, 2) as "Total"
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_item oi ON o.id = oi.order_id
JOIN product p ON oi.product_id = p.id
GROUP BY o.id, o.created_at, o.status, u.name
ORDER BY o.created_at DESC
LIMIT 5;
\echo ''

\echo '========================================='
\echo 'VERIFICATION COMPLETE!'
\echo '========================================='
