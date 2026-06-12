import { SwaggerUIClient } from "@/components/safrico/swagger-ui-client";

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card px-4 py-4 lg:px-8">
        <h1 className="text-xl font-semibold">Safrico API Documentation</h1>
        <p className="text-sm text-muted-foreground">
          OpenAPI 3.0 — authenticate via Auth endpoints first (session cookie), then try Crops &
          Projects.
        </p>
      </div>
      <SwaggerUIClient />
    </div>
  );
}
