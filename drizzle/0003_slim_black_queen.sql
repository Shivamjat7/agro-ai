ALTER TABLE "crops" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "crops" ADD COLUMN "variety" varchar(100);--> statement-breakpoint
ALTER TABLE "crops" ADD COLUMN "expected_harvest_date" date;--> statement-breakpoint
ALTER TABLE "crops" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "crops" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "weekly_logs" ADD COLUMN "plant_height" real;--> statement-breakpoint
ALTER TABLE "weekly_logs" ADD COLUMN "leaf_color" varchar(50);--> statement-breakpoint
ALTER TABLE "weekly_logs" ADD COLUMN "health_score" integer;--> statement-breakpoint
ALTER TABLE "weekly_logs" ADD COLUMN "irrigation_done" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "weekly_logs" ADD COLUMN "fertilizer_applied" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "weekly_logs" ADD COLUMN "pesticide_applied" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "weekly_logs" ADD COLUMN "farmer_notes" text;--> statement-breakpoint
ALTER TABLE "weekly_logs" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "weekly_logs" DROP COLUMN "growth_stage";--> statement-breakpoint
ALTER TABLE "weekly_logs" DROP COLUMN "notes";