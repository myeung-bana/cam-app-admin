import "server-only";
import { type DocumentNode, print } from "graphql";
import { nhostServer } from "@/lib/nhost";

export async function executeGraphQL<TData>(
  document: DocumentNode,
  variables?: Record<string, unknown>
): Promise<TData> {
  const response = await nhostServer.graphql.request({
    query: print(document),
    variables,
  });

  if (response.body.errors?.length) {
    throw new Error(JSON.stringify(response.body.errors));
  }

  return response.body.data as TData;
}
