"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { hasAnalyticsConsent } from "@/components/cookie-consent";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

function initPostHog() {
  if (typeof window === "undefined" || !POSTHOG_KEY || posthog.__loaded) return;
  if (!hasAnalyticsConsent()) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
  });
}

initPostHog();

function PostHogConsentListener() {
  useEffect(() => {
    function onConsent() {
      initPostHog();
    }
    window.addEventListener("analytics-consent-granted", onConsent);
    return () => window.removeEventListener("analytics-consent-granted", onConsent);
  }, []);

  return null;
}

function PostHogIdentifier() {
  const { user, isLoaded } = useUser();
  const ph = usePostHog();
  const identifiedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !ph) return;

    if (user && identifiedRef.current !== user.id) {
      ph.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      });
      identifiedRef.current = user.id;
    } else if (!user && identifiedRef.current) {
      ph.reset();
      identifiedRef.current = null;
    }
  }, [user, isLoaded, ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!POSTHOG_KEY) return <>{children}</>;

  return (
    <PHProvider client={posthog}>
      <PostHogConsentListener />
      <PostHogIdentifier />
      {children}
    </PHProvider>
  );
}
