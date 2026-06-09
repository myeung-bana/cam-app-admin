import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.NHOST_SUBDOMAIN
    ? {
        [`https://${process.env.NHOST_SUBDOMAIN}.hasura.${process.env.NHOST_REGION}.nhost.run/v1/graphql`]:
          {
            headers: {
              "x-hasura-admin-secret": process.env.NHOST_ADMIN_SECRET!,
            },
          },
      }
    : undefined,
  documents: ["lib/graphql/**/*.ts"],
  generates: {
    "lib/types/graphql.generated.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        strictScalars: true,
        scalars: {
          uuid: "string",
          timestamptz: "string",
          float8: "number",
        },
      },
    },
  },
};

export default config;
