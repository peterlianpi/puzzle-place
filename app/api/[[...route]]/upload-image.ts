// import { Hono } from "hono";
// import { zValidator } from "@hono/zod-validator";
// import { v2 as cloudinary } from "cloudinary";
// import { z } from "zod";
// import { db } from "@/lib/db";
// import { getOptionalOrganizationContext, optionalPermission } from "@/lib/security/tenant";
// import {
//   ImageUploadSchema,
//   ImageDeleteSchema,
//   ImageListSchema
// } from "@/lib/schemas/image-schemas";

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Helper to get Cloudinary folder based on owner type and feature
// const getCloudinaryFolder = (ownerType: string, feature: string = "profile", orgId?: string) => {
//   const baseFolder = "p-core";
//   const orgFolder = orgId ? `org-${orgId}` : "global";

//   switch (ownerType.toLowerCase()) {
//     case "user":
//       return `${baseFolder}/${orgFolder}/users/${feature}`;
//     case "organization":
//       return `${baseFolder}/organizations/${feature}`;
//     case "student":
//       return `${baseFolder}/${orgFolder}/students/${feature}`;
//     case "member":
//       return `${baseFolder}/${orgFolder}/members/${feature}`;
//     case "book":
//       return `${baseFolder}/${orgFolder}/books/${feature}`;
//     case "course":
//       return `${baseFolder}/${orgFolder}/courses/${feature}`;
//     case "lesson":
//       return `${baseFolder}/${orgFolder}/lessons/${feature}`;
//     case "schedule":
//       return `${baseFolder}/${orgFolder}/schedules/${feature}`;
//     default:
//       return `${baseFolder}/${orgFolder}/others/${feature}`;
//   }
// };

// // Helper to generate image public ID
// const generatePublicId = (ownerType: string, ownerId: string, feature: string) => {
//   const timestamp = Date.now();
//   return `${ownerType.toLowerCase()}_${ownerId}_${feature}_${timestamp}`;
// };

// const app = new Hono()
//   // ✅ Upload Image
//   .post(
//     "/",
//     zValidator("json", ImageUploadSchema),
//     optionalPermission("write:images"),
//     async (c) => {
//       try {
//         const { imageData, ownerType, ownerId, feature,orgId } = c.req.valid("json");
//         const orgContext = getOptionalOrganizationContext(c);
//         // --- BEGIN: Detailed Debug Logging ---
//         console.log("[BACKEND] Upload-image handler hit");
//         // Normalize ownerType for robust comparison
//         const normalizedOwnerType = ownerType.trim().toUpperCase();
//         console.log("[BACKEND] ownerType (normalized):", normalizedOwnerType);
//         console.log("[BACKEND] orgContext?.organizationId:", orgContext?.organizationId);
//         const orgRequiredTypes = [
//           "MEMBER", "STUDENT", "BOOK", "COURSE", "LESSON", "SCHEDULE",
//         ];
//         console.log("[BACKEND] orgRequiredTypes:", orgRequiredTypes);
//         console.log(
//           "[BACKEND] orgId required check:",
//           orgRequiredTypes.includes(normalizedOwnerType) && !orgContext?.organizationId
//         );
//         // --- END: Detailed Debug Logging ---

//         // Only require orgId for org-scoped resources (not for USER profile uploads)
//         if (orgRequiredTypes.includes(normalizedOwnerType) && !orgContext?.organizationId) {
//           return c.json({ error: "Organization ID is required" }, 400);
//         }

//         // Debug log to help trace the error
//         console.log("[DEBUG] Incoming upload payload", {
//           ownerType,
//           ownerId,
//           feature,
//           orgId: orgContext?.organizationId
//         });

//         // Log upload request
//         console.log("[UPLOAD] Request", {
//           ownerType,
//           ownerId,
//           feature,
//           orgId: orgContext?.organizationId,
//         });

//         // Generate folder and public ID
//         const folder = getCloudinaryFolder(ownerType, feature, orgContext?.organizationId);
//         const publicId = generatePublicId(ownerType, ownerId, feature);
//         console.log(`[UPLOAD] Using folder: ${folder}, publicId: ${publicId}`);

//         // Ensure Cloudinary folder exists (create if needed)
//         try {
//           // Create nested folder structure step by step
//           const folderParts = folder.split('/');
//           let currentPath = '';

//           for (const part of folderParts) {
//             currentPath = currentPath ? `${currentPath}/${part}` : part;
//             try {
//               await cloudinary.api.create_folder(currentPath);
//               console.log(`[UPLOAD] Created folder: ${currentPath}`);
//             } catch (folderError: unknown) {
//               // Folder might already exist - that's fine
//               const errorMessage = folderError instanceof Error ? folderError.message : String(folderError);
//               if (!errorMessage.includes('already exists') && !errorMessage.includes('Bad Request')) {
//                 console.warn(`[UPLOAD] Could not create folder ${currentPath}:`, errorMessage);
//               }
//             }
//           }
//         } catch (error: unknown) {
//           const errorMessage = error instanceof Error ? error.message : String(error);
//           console.warn(`[UPLOAD] Failed to create folder structure for ${folder}:`, errorMessage);
//         }

//         // Upload to Cloudinary
//         const cloudinaryResult = await cloudinary.uploader.upload(imageData, {
//           folder,
//           public_id: publicId,
//           resource_type: "image",
//           transformation: [
//             { width: 800, height: 600, crop: "limit" }, // Optimize size
//             { quality: "auto" }, // Auto quality
//             { fetch_format: "auto" } // Auto format (WebP, etc.)
//           ]
//         });
//         console.log("[UPLOAD] Cloudinary upload result", {
//           publicId: cloudinaryResult.public_id,
//           url: cloudinaryResult.secure_url,
//         });

//         // TODO: Save image record to database when image model is added to schema
//         const imageRecord = {
//           id: "temp_" + Date.now(),
//           url: cloudinaryResult.secure_url,
//           publicId: cloudinaryResult.public_id,
//           feature: feature,
//         };

//         return c.json({
//           success: true,
//           data: imageRecord
//         }, 201);

//       } catch (error) {
//         console.error("[UPLOAD] Image upload error:", error);
//         return c.json({
//           success: false,
//           error: "Failed to upload image"
//         }, 500);
//       }
//     }
//   )

//   // ✅ Get Images
//   .get(
//     "/",
//     zValidator("query", ImageListSchema),
//     optionalPermission("read:images"),
//     async (c) => {
//       try {
//         const { ownerType, ownerId, feature } = c.req.valid("query");
//         const orgContext = getOptionalOrganizationContext(c);

//         // Log get images request
//         console.log("[GET] Images request", {
//           ownerType,
//           ownerId,
//           feature,
//           orgId: orgContext?.organizationId,
//         });

//         const where: Record<string, unknown> = {};

//         // Only filter by org if we have org context
//         if (orgContext?.organizationId) {
//           where.orgId = orgContext.organizationId;
//         }

//         if (ownerType) where.ownerType = ownerType;
//         if (ownerId) where.ownerId = ownerId;
//         if (feature) where.feature = feature;

//         // TODO: Implement when image model is added to schema
//         const images = [
//           {
//             id: "mock_image_1",
//             url: "https://example.com/image.jpg",
//             publicId: "mock_public_id",
//             feature: feature || "profile",
//             ownerType: ownerType || "USER",
//             ownerId: ownerId || "mock_owner",
//             createdAt: new Date(),
//           }
//         ];

//         return c.json({
//           success: true,
//           data: images
//         });

//       } catch (error) {
//         console.error("[GET] Get images error:", error);
//         return c.json({
//           success: false,
//           error: "Failed to fetch images"
//         }, 500);
//       }
//     }
//   )

//   // ✅ Delete Image
//   .delete(
//     "/",
//     zValidator("json", ImageDeleteSchema),
//     optionalPermission("delete:images"),
//     async (c) => {
//       try {
//         const { imageId } = c.req.valid("json");
//         const orgContext = getOptionalOrganizationContext(c);

//         // Log delete request
//         console.log("[DELETE] Image request", {
//           imageId,
//           orgId: orgContext?.organizationId,
//         });

//         // Find image record
//         const where: Record<string, unknown> = { id: imageId };
//         if (orgContext?.organizationId) {
//           where.orgId = orgContext.organizationId;
//         }

//         // TODO: Implement when image model is added to schema
//         // Mock successful deletion
//         return c.json({
//           success: true,
//           message: "Image deleted successfully"
//         });

//       } catch (error) {
//         console.error("[DELETE] Image deletion error:", error);
//         return c.json({
//           success: false,
//           error: "Failed to delete image"
//         }, 500);
//       }
//     }
//   )

//   // ✅ Update Image (replace existing)
//   .put(
//     "/:imageId",
//     zValidator("param", z.object({ imageId: z.string() })),
//     zValidator("json", z.object({
//       imageData: z.string().min(1, "Image data is required"),
//       feature: z.string().optional()
//     })),
//     async (c) => {
//       try {
//         const { imageId } = c.req.valid("param");
//         const { imageData, feature } = c.req.valid("json");
//         const orgContext = getOptionalOrganizationContext(c);

//         // Log update request
//         console.log("[UPDATE] Image request", {
//           imageId,
//           feature,
//           orgId: orgContext?.organizationId,
//         });

//         // Find existing image
//         const where: Record<string, unknown> = { id: imageId };
//         if (orgContext?.organizationId) {
//           where.orgId = orgContext.organizationId;
//         }

//         // TODO: Implement when image model is added to schema
//         // Mock successful update
//         return c.json({
//           success: true,
//           data: {
//             id: imageId,
//             url: "https://example.com/updated-image.jpg",
//             publicId: "updated_public_id",
//             feature: feature || "profile",
//           }
//         });

//       } catch (error) {
//         console.error("[UPDATE] Image update error:", error);
//         return c.json({
//           success: false,
//           error: "Failed to update image"
//         }, 500);
//       }
//     }
//   );

// export default app;
