CREATE TABLE "advice_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"weekly_log_id" uuid NOT NULL,
	"advice" text NOT NULL,
	"risk_level" varchar(20),
	"generated_by" varchar(20) DEFAULT 'ai',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farm_id" uuid NOT NULL,
	"crop_name" varchar(100) NOT NULL,
	"soil_type" varchar(50),
	"sowing_date" date NOT NULL,
	"status" varchar(20) DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE "crop_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"weekly_log_id" uuid NOT NULL,
	"image_url" varchar(500) NOT NULL,
	"image_type" varchar(20) NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crop_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "crop_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "farms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"farm_name" varchar(100) NOT NULL,
	"village" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"total_area" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "fertilizer_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"crop_id" uuid NOT NULL,
	"fertilizer_name" varchar(150) NOT NULL,
	"quantity" varchar(100),
	"applied_on" date NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "medicine_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"crop_id" uuid NOT NULL,
	"medicine_name" varchar(150) NOT NULL,
	"dosage" varchar(100),
	"application_method" varchar(50),
	"applied_on" date NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "weather_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"weekly_log_id" uuid NOT NULL,
	"temperature" numeric(5, 2),
	"humidity" integer,
	"rainfall" numeric(5, 2),
	"wind_speed" numeric(5, 2),
	"forecast" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"crop_id" uuid NOT NULL,
	"week_number" integer NOT NULL,
	"growth_stage" varchar(100),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "advice_history" ADD CONSTRAINT "advice_history_weekly_log_id_weekly_logs_id_fk" FOREIGN KEY ("weekly_log_id") REFERENCES "public"."weekly_logs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crops" ADD CONSTRAINT "crops_farm_id_farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crop_images" ADD CONSTRAINT "crop_images_weekly_log_id_weekly_logs_id_fk" FOREIGN KEY ("weekly_log_id") REFERENCES "public"."weekly_logs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farms" ADD CONSTRAINT "farms_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fertilizer_logs" ADD CONSTRAINT "fertilizer_logs_crop_id_crops_id_fk" FOREIGN KEY ("crop_id") REFERENCES "public"."crops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medicine_logs" ADD CONSTRAINT "medicine_logs_crop_id_crops_id_fk" FOREIGN KEY ("crop_id") REFERENCES "public"."crops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weather_snapshots" ADD CONSTRAINT "weather_snapshots_weekly_log_id_weekly_logs_id_fk" FOREIGN KEY ("weekly_log_id") REFERENCES "public"."weekly_logs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_logs" ADD CONSTRAINT "weekly_logs_crop_id_crops_id_fk" FOREIGN KEY ("crop_id") REFERENCES "public"."crops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "farm_user_idx" ON "farms" USING btree ("user_id");