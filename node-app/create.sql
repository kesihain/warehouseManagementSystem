-- Database: warehouseManagementSystem
-- DROP DATABASE "warehouseManagementSystem";
CREATE DATABASE "warehouseManagementSystem" WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'English_Malaysia.1252' LC_CTYPE = 'English_Malaysia.1252' TABLESPACE = pg_default CONNECTION
LIMIT
    = -1;

-- SCHEMA: public
-- DROP SCHEMA public ;
CREATE SCHEMA public AUTHORIZATION postgres;

COMMENT ON SCHEMA public IS 'standard public schema';

GRANT ALL ON SCHEMA public TO PUBLIC;

GRANT ALL ON SCHEMA public TO postgres;

-- Table: public.itemLocationRel
-- DROP TABLE public."itemLocationRel";
CREATE TABLE public."itemLocationRel" (
    "itemId" uuid,
    "locationId" uuid,
    "createUserId" uuid,
    action character varying COLLATE pg_catalog."default"
) TABLESPACE pg_default;

ALTER TABLE
    public."itemLocationRel" OWNER to postgres;

-- Table: public.items
-- DROP TABLE public.items;
CREATE TABLE public.items (
    "ID" uuid NOT NULL,
    "itemName" "char",
    "purchaseOrderItemId" uuid,
    CONSTRAINT items_pkey PRIMARY KEY ("ID")
) TABLESPACE pg_default;

ALTER TABLE
    public.items OWNER to postgres;

-- Table: public.location
-- DROP TABLE public.location;
CREATE TABLE public.location (
    "ID" uuid NOT NULL,
    "locationName" "char",
    CONSTRAINT location_pkey PRIMARY KEY ("ID")
) TABLESPACE pg_default;

ALTER TABLE
    public.location OWNER to postgres;

-- Table: public.purchaseOrder
-- DROP TABLE public."purchaseOrder";
CREATE TABLE public."purchaseOrder" (
    "ID" uuid NOT NULL,
    "vendorName" character varying COLLATE pg_catalog."default",
    "totalAmount" numeric,
    "createUserId" uuid,
    "createDate" date,
    CONSTRAINT "purchaseOrder_pkey" PRIMARY KEY ("ID")
) TABLESPACE pg_default;

ALTER TABLE
    public."purchaseOrder" OWNER to postgres;

-- Table: public.purchaseOrderItem
-- DROP TABLE public."purchaseOrderItem";
CREATE TABLE public."purchaseOrderItem" (
    "ID" uuid NOT NULL,
    name "char",
    price numeric,
    quantity integer,
    "purchaseOrderId" uuid,
    "quantityFilled" integer,
    CONSTRAINT "purchaseOrderItem_pkey" PRIMARY KEY ("ID")
) TABLESPACE pg_default;

ALTER TABLE
    public."purchaseOrderItem" OWNER to postgres;

-- Table: public.user
-- DROP TABLE public."user";
CREATE TABLE public."user" (
    "ID" uuid,
    password character varying COLLATE pg_catalog."default",
    name character varying COLLATE pg_catalog."default",
    role character varying COLLATE pg_catalog."default"
) TABLESPACE pg_default;

ALTER TABLE
    public."user" OWNER to postgres;

-- Table: public.userLogin
-- DROP TABLE public."userLogin";
CREATE TABLE public."userLogin" (
    "userId" character varying COLLATE pg_catalog."default",
    token character varying COLLATE pg_catalog."default"
) TABLESPACE pg_default;

ALTER TABLE
    public."userLogin" OWNER to postgres;