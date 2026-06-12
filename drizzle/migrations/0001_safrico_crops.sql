CREATE TYPE "public"."crop_type" AS ENUM('grains', 'vegetables', 'fruits', 'legumes', 'other');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "crops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"crop_type" "crop_type" NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"harvest_date" timestamp,
	"owner_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "crops" ADD CONSTRAINT "crops_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
