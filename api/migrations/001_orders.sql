CREATE TABLE orders (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term        TEXT NOT NULL,
    months      INT NOT NULL,
    amount      NUMERIC(18, 2) NOT NULL,
    yield       NUMERIC(8, 4) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX orders_created_at_idx ON orders(created_at DESC);
