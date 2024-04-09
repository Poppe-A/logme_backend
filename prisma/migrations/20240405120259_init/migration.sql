-- AlterTable
CREATE SEQUENCE serie_order_seq;
ALTER TABLE "Serie" ALTER COLUMN "order" SET DEFAULT nextval('serie_order_seq');
ALTER SEQUENCE serie_order_seq OWNED BY "Serie"."order";
