-- Sample Orders Data for StoreZ E-commerce Database
-- This script creates 10 orders spanning the last 6 months with realistic data
-- Order statuses: PENDING, APPROVED, SHIPPED, DELIVERED, CANCELLED

-- ============================================================================
-- ORDER 1: Delivered order from 6 months ago (May 2025)
-- User: ZAKARIA SABIRI (id: 1)
-- Status: DELIVERED
-- ============================================================================
INSERT INTO orders (created_at, status, user_id)
VALUES ('2025-05-01 10:30:00', 'DELIVERED', 1);

-- Get the last inserted order_id and insert order items
INSERT INTO order_item (quantity, order_id, product_id)
VALUES
    (1, (SELECT MAX(id) FROM orders), 1),  -- Apple MacBook Pro 16" x1 ($2599.99)
    (2, (SELECT MAX(id) FROM orders), 7);  -- AirPods Pro 2 x2 ($279.99 each)

-- ============================================================================
-- ORDER 2: Delivered order from 5 months ago (June 2025)
-- User: issam sabiri (id: 2)
-- Status: DELIVERED
-- ============================================================================
INSERT INTO orders (created_at, status, user_id)
VALUES ('2025-06-15 14:20:00', 'DELIVERED', 2);

INSERT INTO order_item (quantity, order_id, product_id)
VALUES
    (1, (SELECT MAX(id) FROM orders), 3),  -- iPhone 15 Pro x1 ($1299.99)
    (1, (SELECT MAX(id) FROM orders), 6),  -- Sony WH-1000XM5 x1 ($399.99)
    (1, (SELECT MAX(id) FROM orders), 18); -- Apple Watch Series 9 x1 ($449.99)

-- ============================================================================
-- ORDER 3: Delivered order from 4 months ago (July 2025)
-- User: ZAKARIA SABIRI (id: 1)
-- Status: DELIVERED
-- ============================================================================
INSERT INTO orders (created_at, status, user_id)
VALUES ('2025-07-08 09:15:00', 'DELIVERED', 1);

INSERT INTO order_item (quantity, order_id, product_id)
VALUES
    (1, (SELECT MAX(id) FROM orders), 15), -- Dyson V15 Detect x1 ($699.99)
    (1, (SELECT MAX(id) FROM orders), 16); -- Philips Airfryer XXL x1 ($229.99)

-- ============================================================================
-- ORDER 4: Shipped order from 3 months ago (August 2025)
-- User: issam sabiri (id: 2)
-- Status: SHIPPED
-- ============================================================================
INSERT INTO orders (created_at, status, user_id)
VALUES ('2025-08-22 16:45:00', 'SHIPPED', 2);

INSERT INTO order_item (quantity, order_id, product_id)
VALUES
    (2, (SELECT MAX(id) FROM orders), 10), -- Nike Air Max 270 x2 ($129.99 each)
    (1, (SELECT MAX(id) FROM orders), 11), -- Adidas Ultraboost x1 ($149.99)
    (1, (SELECT MAX(id) FROM orders), 12); -- Ray-Ban Wayfarer x1 ($129)

-- ============================================================================
-- ORDER 5: Cancelled order from 3 months ago (August 2025)
-- User: ZAKARIA SABIRI (id: 1)
-- Status: CANCELLED
-- ============================================================================
INSERT INTO orders (created_at, status, user_id)
VALUES ('2025-08-28 11:30:00', 'CANCELLED', 1);

INSERT INTO order_item (quantity, order_id, product_id)
VALUES
    (1, (SELECT MAX(id) FROM orders), 2); -- Dell XPS 13 x1 ($1499)

-- ============================================================================
-- ORDER 6: Delivered order from 2 months ago (September 2025)
-- User: issam sabiri (id: 2)
-- Status: DELIVERED
-- ============================================================================
INSERT INTO orders (created_at, status, user_id)
VALUES ('2025-09-10 13:20:00', 'DELIVERED', 2);

INSERT INTO order_item (quantity, order_id, product_id)
VALUES
    (1, (SELECT MAX(id) FROM orders), 17), -- GoPro Hero 12 x1 ($499)
    (1, (SELECT MAX(id) FROM orders), 19), -- Kindle Paperwhite x1 ($159.99)
    (1, (SELECT MAX(id) FROM orders), 20); -- Logitech MX Master 3S x1 ($129.99)

-- ============================================================================
-- ORDER 7: Approved order from 1.5 months ago (Mid-September 2025)
-- User: ZAKARIA SABIRI (id: 1)
-- Status: APPROVED
-- ============================================================================
INSERT INTO orders (created_at, status, user_id)
VALUES ('2025-09-20 10:00:00', 'APPROVED', 1);

INSERT INTO order_item (quantity, order_id, product_id)
VALUES
    (1, (SELECT MAX(id) FROM orders), 4),  -- Samsung Galaxy S24 Ultra x1 ($1199.99)
    (1, (SELECT MAX(id) FROM orders), 5);  -- iPad Air 5 x1 ($849.99)

-- ============================================================================
-- ORDER 8: Delivered order from 1 month ago (October 2025)
-- User: issam sabiri (id: 2)
-- Status: DELIVERED
-- ============================================================================
INSERT INTO orders (created_at, status, user_id)
VALUES ('2025-10-05 15:30:00', 'DELIVERED', 2);

INSERT INTO order_item (quantity, order_id, product_id)
VALUES
    (2, (SELECT MAX(id) FROM orders), 8),  -- Bose SoundLink Revolve x2 ($199.99 each)
    (1, (SELECT MAX(id) FROM orders), 9),  -- Marshall Acton II x1 ($299)
    (1, (SELECT MAX(id) FROM orders), 14); -- Nespresso Vertuo Next x1 ($179.99)

-- ============================================================================
-- ORDER 9: Pending order from 2 weeks ago (Mid-October 2025)
-- User: ZAKARIA SABIRI (id: 1)
-- Status: PENDING
-- ============================================================================
INSERT INTO orders (created_at, status, user_id)
VALUES ('2025-10-18 09:45:00', 'PENDING', 1);

INSERT INTO order_item (quantity, order_id, product_id)
VALUES
    (1, (SELECT MAX(id) FROM orders), 13), -- Casio G-Shock x1 ($179)
    (2, (SELECT MAX(id) FROM orders), 20); -- Logitech MX Master 3S x2 ($129.99 each)

-- ============================================================================
-- ORDER 10: Recent delivered order (1 week ago - Late October 2025)
-- User: issam sabiri (id: 2)
-- Status: DELIVERED
-- ============================================================================
INSERT INTO orders (created_at, status, user_id)
VALUES ('2025-10-24 12:15:00', 'DELIVERED', 2);

INSERT INTO order_item (quantity, order_id, product_id)
VALUES
    (1, (SELECT MAX(id) FROM orders), 2),  -- Dell XPS 13 x1 ($1499)
    (1, (SELECT MAX(id) FROM orders), 6),  -- Sony WH-1000XM5 x1 ($399.99)
    (1, (SELECT MAX(id) FROM orders), 7);  -- AirPods Pro 2 x1 ($279.99)

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Uncomment to verify the data after insertion:
-- SELECT COUNT(*) as total_orders FROM orders;
-- SELECT COUNT(*) as total_order_items FROM order_item;
-- SELECT status, COUNT(*) as count FROM orders GROUP BY status ORDER BY status;
-- SELECT DATE_TRUNC('month', created_at) as month, COUNT(*) as orders_count, SUM((SELECT SUM(oi.quantity * p.price) FROM order_item oi JOIN product p ON oi.product_id = p.id WHERE oi.order_id = o.id)) as total_revenue FROM orders o GROUP BY month ORDER BY month;
