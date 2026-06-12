"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export function SwaggerUIClient() {
  return (
    <div className="swagger-wrap px-4 pb-12">
      <SwaggerUI url="/api/openapi" docExpansion="list" defaultModelsExpandDepth={1} />
    </div>
  );
}
