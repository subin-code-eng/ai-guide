import { createFileRoute } from "@tanstack/react-router";
import RegisterArtisan from "@/pages/RegisterArtisan";

export const Route = createFileRoute("/register-artisan")({
  head: () => ({ meta: [{ title: "Register as Artisan — Mysuru Beyond" }] }),
  component: RegisterArtisan,
});
