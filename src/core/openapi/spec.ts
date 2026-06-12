export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Safrico API",
    description:
      "Crop inventory and farm operations API. Auth uses Supabase session cookies — log in via POST /api/auth/login in the browser or Swagger, then try protected routes.",
    version: "1.0.0",
    contact: { name: "Safrico", url: "https://github.com/Temam-Hashim/nextjs-ai-optimized-codebase" },
  },
  servers: [{ url: "/", description: "Current host" }],
  tags: [
    { name: "Auth", description: "Authentication (Supabase)" },
    { name: "Users", description: "User profiles" },
    { name: "Crops", description: "Crop inventory" },
    { name: "Projects", description: "Farm projects" },
    { name: "Inventory", description: "Public buyer marketplace" },
    { name: "Health", description: "Service health checks" },
  ],
  paths: {
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Sign in",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Signed in — session cookie set" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Registered" },
          "400": { description: "Registration failed" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Sign out",
        responses: { "200": { description: "Signed out" } },
      },
    },
    "/api/auth/session": {
      get: {
        tags: ["Auth"],
        summary: "Current session",
        responses: {
          "200": { description: "Authenticated user" },
          "401": { description: "Not authenticated" },
        },
      },
    },
    "/api/users/me": {
      get: {
        tags: ["Users"],
        summary: "Current user profile",
        responses: {
          "200": { description: "Auth + public.users profile" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/crops": {
      get: {
        tags: ["Crops"],
        summary: "List crops",
        parameters: [
          {
            name: "cropType",
            in: "query",
            schema: {
              type: "string",
              enum: ["grains", "vegetables", "fruits", "legumes", "other"],
            },
          },
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "pageSize", in: "query", schema: { type: "integer" } },
        ],
        responses: { "200": { description: "Paginated crop list" } },
      },
      post: {
        tags: ["Crops"],
        summary: "Create crop",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCrop" },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/api/crops/{id}": {
      get: {
        tags: ["Crops"],
        summary: "Get crop",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Crop" } },
      },
      patch: {
        tags: ["Crops"],
        summary: "Update crop",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateCrop" } } },
        },
        responses: { "200": { description: "Updated" } },
      },
      delete: {
        tags: ["Crops"],
        summary: "Delete crop",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "204": { description: "Deleted" } },
      },
    },
    "/api/crops/summary": {
      get: {
        tags: ["Crops"],
        summary: "Crop summary by type (owner)",
        responses: { "200": { description: "Aggregated kg by crop type" } },
      },
    },
    "/api/crops/alerts": {
      get: {
        tags: ["Crops"],
        summary: "Harvest alerts (7 days)",
        responses: { "200": { description: "Upcoming harvests" } },
      },
    },
    "/api/projects": {
      get: {
        tags: ["Projects"],
        summary: "List projects",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "pageSize", in: "query", schema: { type: "integer" } },
        ],
        responses: { "200": { description: "Paginated projects" } },
      },
      post: {
        tags: ["Projects"],
        summary: "Create project",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProject" },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/api/projects/{id}": {
      get: {
        tags: ["Projects"],
        summary: "Get project",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Project" } },
      },
      patch: {
        tags: ["Projects"],
        summary: "Update project",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateProject" } } },
        },
        responses: { "200": { description: "Updated" } },
      },
      delete: {
        tags: ["Projects"],
        summary: "Delete project",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "204": { description: "Deleted" } },
      },
    },
    "/api/inventory/summary": {
      get: {
        tags: ["Inventory"],
        summary: "Public market inventory (feature-flagged)",
        responses: { "200": { description: "Aggregates by crop type" }, "404": { description: "Flag disabled" } },
      },
    },
    "/api/health": {
      get: { tags: ["Health"], summary: "Health check", responses: { "200": { description: "OK" } } },
    },
    "/api/health/ready": {
      get: { tags: ["Health"], summary: "Readiness", responses: { "200": { description: "Ready" } } },
    },
    "/api/health/db": {
      get: { tags: ["Health"], summary: "Database health", responses: { "200": { description: "DB OK" } } },
    },
  },
  components: {
    schemas: {
      CreateCrop: {
        type: "object",
        required: ["name", "cropType", "quantity"],
        properties: {
          name: { type: "string", minLength: 2 },
          cropType: { type: "string", enum: ["grains", "vegetables", "fruits", "legumes", "other"] },
          quantity: { type: "integer", minimum: 0 },
          harvestDate: { type: "string", format: "date-time" },
        },
      },
      UpdateCrop: {
        type: "object",
        properties: {
          name: { type: "string" },
          cropType: { type: "string", enum: ["grains", "vegetables", "fruits", "legumes", "other"] },
          quantity: { type: "integer", minimum: 0 },
          harvestDate: { type: "string", format: "date-time", nullable: true },
        },
      },
      CreateProject: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 3 },
          description: { type: "string" },
          isPublic: { type: "boolean", default: false },
        },
      },
      UpdateProject: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          isPublic: { type: "boolean" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
          code: { type: "string" },
        },
      },
    },
  },
} as const;
