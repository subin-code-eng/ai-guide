import { createFileRoute } from "@tanstack/react-router";
import IndexPage from "@/pages/Index";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mysuru Beyond — Decentralised Tourism" },
      { name: "description", content: "Discover hidden gems, local artisans, and cultural trails of Mysuru." },
    ],
  }),
  component: IndexPage,
});
