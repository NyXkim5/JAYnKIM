import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact — Jay Kim",
  description: "Get in touch. Email, GitHub, LinkedIn.",
};

export default function ContactPage() {
  return <ContactContent />;
}
