"use client";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split,
} from "@apollo/client";
import { ApolloProvider as BaseApolloProvider } from "@apollo/client/react";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { useMemo } from "react";
import { useAuth } from "@/lib/auth/auth-context";

const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN ?? "";
const region = process.env.NEXT_PUBLIC_NHOST_REGION ?? "";
const hasHasuraConfig = Boolean(subdomain && region);
const HASURA_HTTP = hasHasuraConfig
  ? `https://${subdomain}.hasura.${region}.nhost.run/v1/graphql`
  : "/graphql";
const HASURA_WS = HASURA_HTTP.replace("https", "wss");

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuth();

  const client = useMemo(() => {
    const headers: Record<string, string> = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    const httpLink = new HttpLink({ uri: HASURA_HTTP, headers });

    if (!accessToken || !hasHasuraConfig) {
      return new ApolloClient({ link: httpLink, cache: new InMemoryCache() });
    }

    const wsLink = new GraphQLWsLink(
      createClient({
        url: HASURA_WS,
        connectionParams: { headers },
      })
    );

    const splitLink = split(
      ({ query }) => {
        const def = getMainDefinition(query);
        return (
          def.kind === "OperationDefinition" &&
          def.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    );

    return new ApolloClient({ link: splitLink, cache: new InMemoryCache() });
  }, [accessToken]);

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
