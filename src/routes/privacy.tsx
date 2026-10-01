import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RouteError } from "@/components/route-fallbacks";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Decorum Denied" },
      {
        name: "description",
        content:
          "How Decorum Denied collects, uses, and protects your information. Effective September 30, 2026.",
      },
      { property: "og:title", content: "Privacy Policy — Decorum Denied" },
      {
        property: "og:description",
        content: "How Decorum Denied collects, uses, and protects your information.",
      },
    ],
  }),
  component: PrivacyPage,
  errorComponent: RouteError,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <SiteHeader />

      <section className="diag relative overflow-hidden">
        <div aria-hidden className="diag-lines pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-2xl px-4 pt-12 pb-12 sm:px-6 sm:pt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-2">
            The fine print
          </p>
          <h1 className="font-display mt-4 text-[clamp(2.6rem,12vw,4.5rem)] uppercase leading-[0.85] tracking-tight">
            <span className="block">Privacy</span>
            <span className="block text-primary">Policy</span>
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Effective Date: September 30, 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="prose-poster mt-8">
          <p>
            Decorum Denied respects your privacy. This Privacy Policy explains what information we
            collect, how we use it, the service providers that may process it, and the choices
            available to you.
          </p>

          <h2 className="font-display mt-8 text-xl uppercase tracking-tight">
            Information You Provide
          </h2>
          <p>
            If you subscribe to Decorum Denied, we collect the <strong>email address you provide</strong>.
          </p>
          <p>
            We do not currently ask newsletter subscribers for their name, physical address, phone
            number, demographic information, or other personal information.
          </p>
          <p>
            Your email address is stored in our database and is used to manage your subscription and
            send you Decorum Denied content and updates.
          </p>

          <h2 className="font-display mt-8 text-xl uppercase tracking-tight">
            Information Collected Automatically
          </h2>
          <p>
            Decorum Denied does not currently use Google Analytics, advertising trackers,
            behavioral analytics tools, or similar visitor-tracking services.
          </p>
          <p>Our application does not intentionally collect or store:</p>
          <ul>
            <li>browser or device information;</li>
            <li>referral information;</li>
            <li>geographic location;</li>
            <li>browsing history; or</li>
            <li>visitor profiles.</li>
          </ul>
          <p>
            We also do not currently use tracking pixels or link-tracking technology in newsletter
            emails.
          </p>
          <p>
            However, because Decorum Denied uses Cloudflare to deliver, protect, and operate the
            website, Cloudflare processes certain technical information when visitors access the
            site. This may include:
          </p>
          <ul>
            <li>IP address;</li>
            <li>requested URL;</li>
            <li>HTTP request information;</li>
            <li>browser or user-agent information; and</li>
            <li>security and network-related request data.</li>
          </ul>
          <p>
            Cloudflare also provides infrastructure logging used to diagnose errors and maintain
            the website. Those logs may contain visitor IP addresses and request information.
            Under our current service configuration, these logs are retained for approximately
            <strong> three days</strong>.
          </p>
          <p>
            This technical information is used for website operation, security, troubleshooting,
            performance, and protection against malicious traffic.
          </p>
          <h2 className="font-display mt-8 text-xl uppercase tracking-tight">
            Cookies and Local Storage
          </h2>
          <p>Decorum Denied does not currently set advertising or visitor-tracking cookies.</p>
          <p>
            Ordinary visitors are not intentionally assigned application cookies or local-storage
            identifiers by Decorum Denied.
          </p>
          <p>
            Administrative users may have authentication information stored locally in their
            browser as part of the site's secure login system. This functionality is used for site
            administration and does not apply to ordinary visitors or newsletter subscribers.
          </p>

          <h2 className="font-display mt-8 text-xl uppercase tracking-tight">
            How We Use Your Email Address
          </h2>
          <p>We may use your email address to:</p>
          <ul>
            <li>send articles, newsletters, announcements, or other Decorum Denied content;</li>
            <li>manage your subscription;</li>
            <li>deliver requested communications;</li>
            <li>maintain the security and operation of the mailing list;</li>
            <li>process unsubscribe requests;</li>
            <li>prevent abuse or delivery problems; and</li>
            <li>comply with applicable legal obligations.</li>
          </ul>
          <p>
            We do <strong>not sell your email address or personal information</strong>.
          </p>
          <p>
            We do not currently use subscriber information for targeted advertising or behavioral
            profiling.
          </p>

          <h2 className="font-display mt-8 text-xl uppercase tracking-tight">Email Delivery</h2>
          <p>
            Decorum Denied uses <strong>Resend</strong> to deliver subscriber emails.
          </p>
          <p>
            When an email is sent, Resend receives information necessary to deliver it, including
            your email address, the message subject, and the email content.
          </p>
          <p>
            Resend may also maintain delivery records, including information concerning successful
            delivery, bounced messages, complaints, or addresses that should no longer receive
            mail.
          </p>
          <p>
            Decorum Denied does not currently use email open-tracking pixels or click-tracking
            links.
          </p>

          <h2 className="font-display mt-8 text-xl uppercase tracking-tight">Service Providers</h2>
          <p>We currently rely on several service providers to operate Decorum Denied.</p>
          <p>
            <strong>Cloudflare</strong> provides website delivery, security, networking, and
            infrastructure logging.
          </p>
          <p>
            <strong>Supabase</strong> provides database services used to store subscriber email
            addresses and other site data.
          </p>
          <p>
            <strong>Resend</strong> processes subscriber email addresses when sending newsletters
            and other communications.
          </p>
          <p>
            <strong>IONOS</strong> provides email hosting for Decorum Denied's business email
            accounts.
          </p>
          <p>
            These companies may process limited personal information as necessary to provide their
            services and are subject to their own privacy and data-protection practices.
          </p>

          <h2 className="font-display mt-8 text-xl uppercase tracking-tight">Data Retention</h2>
          <p>
            Subscriber email addresses are generally retained while a subscription remains active.
          </p>
          <p>
            Our current database does not automatically delete subscriber records after a specified
            period. Information may therefore remain stored until it is deleted or no longer
            reasonably necessary for the purpose for which it was collected.
          </p>
          <p>Limited information may also be retained when necessary to:</p>
          <ul>
            <li>honor an unsubscribe request;</li>
            <li>maintain email suppression or bounce records;</li>
            <li>prevent abuse;</li>
            <li>comply with applicable law; or</li>
            <li>resolve disputes.</li>
          </ul>
          <p>
            Cloudflare infrastructure logs are currently retained for approximately three days under
            our present configuration.
          </p>
          <p>
            Third-party service providers may maintain their own operational, security, delivery, or
            suppression records according to their respective policies.
          </p>

          <h2 className="font-display mt-8 text-xl uppercase tracking-tight">Unsubscribing</h2>
          <p>
            You may unsubscribe from Decorum Denied emails at any time using the unsubscribe option
            provided in our communications or by contacting us directly.
          </p>
          <p>
            After unsubscribing, limited information may be retained when necessary to make sure
            your unsubscribe preference continues to be honored.
          </p>

          <h2 className="font-display mt-8 text-xl uppercase tracking-tight">
            Your Privacy Rights
          </h2>
          <p>
            Depending on where you live, applicable law may give you rights concerning your personal
            information.
          </p>
          <p>These may include the right to request:</p>
          <ul>
            <li>access to personal information we maintain about you;</li>
            <li>correction of inaccurate information;</li>
            <li>deletion of certain personal information; or</li>
            <li>information about how your personal information is used.</li>
          </ul>
          <p>To make a privacy-related request, contact us using the information below.</p>
          <p>We may need to verify your identity before completing certain requests.</p>

          <h2 className="font-display mt-8 text-xl uppercase tracking-tight">
            Children's Privacy
          </h2>
          <p>
            Decorum Denied is not directed toward children under 13 and we do not knowingly collect
            personal information from children under 13.
          </p>
          <p>
            If we learn that we have collected such information without appropriate authorization,
            we will take reasonable steps to delete it.
          </p>

          <h2 className="font-display mt-8 text-xl uppercase tracking-tight">Security</h2>
          <p>
            We use reasonable technical and administrative measures intended to protect personal
            information, including encrypted web connections and established third-party
            infrastructure providers.
          </p>
          <p>
            No method of transmitting or storing information electronically can be guaranteed to be
            completely secure.
          </p>

          <h2 className="font-display mt-8 text-xl uppercase tracking-tight">
            Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy as Decorum Denied changes or as we add new services,
            technologies, or data-processing practices.
          </p>
          <p>
            When material changes are made, we will update the effective date shown at the top of
            this policy and provide additional notice when appropriate.
          </p>

          <h2 className="font-display mt-8 text-xl uppercase tracking-tight">Contact Us</h2>
          <p>Questions, requests, or concerns about this Privacy Policy may be sent to:</p>
          <p>
            <strong>Decorum Denied</strong>
            <br />
            <strong>Email:</strong> tara@decorumdenied.com
            <br />
            <strong>Website:</strong> decorumdenied.com
          </p>
        </div>

        <div className="mt-10">
          <Link
            to="/"
            className="font-mono text-[11px] uppercase tracking-wider text-primary transition-colors hover:text-accent-2"
          >
            ← Back to the front page
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

