"use client";

import { useEffect, useRef, useCallback } from "react";

declare global {
  // eslint-disable-next-line no-var
  var google: any;
  interface Window {
    __googleMapsCallback?: () => void;
  }
}

let loadPromise: Promise<void> | null = null;

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof google !== "undefined" && google.maps?.places) {
    return Promise.resolve();
  }
  if (loadPromise) return loadPromise;
  loadPromise = new Promise<void>((resolve, reject) => {
    window.__googleMapsCallback = () => {
      delete window.__googleMapsCallback;
      resolve();
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__googleMapsCallback`;
    script.async = true;
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Google Maps"));
    };
    document.head.appendChild(script);
  });
  return loadPromise;
}

export interface PlaceResult {
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}

interface PlaceAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected?: (place: PlaceResult) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function PlaceAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  placeholder,
  className,
  autoFocus,
  onKeyDown,
}: PlaceAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (!place) return;
    const name = place.name || "";
    const address = place.formatted_address || "";
    const lat = place.geometry?.location?.lat();
    const lng = place.geometry?.location?.lng();
    if (name) onChange(name);
    onPlaceSelected?.({ name, address, lat, lng });
  }, [onChange, onPlaceSelected]);

  useEffect(() => {
    if (!apiKey || !inputRef.current) return;

    let cancelled = false;
    loadGoogleMaps(apiKey).then(() => {
      if (cancelled || !inputRef.current) return;
      if (autocompleteRef.current) return;

      const ac = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["establishment"],
        fields: ["name", "formatted_address", "geometry"],
      });
      ac.addListener("place_changed", handlePlaceChanged);
      autocompleteRef.current = ac;
    });

    return () => {
      cancelled = true;
    };
  }, [apiKey, handlePlaceChanged]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      autoFocus={autoFocus}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          const pac = document.querySelector(".pac-container");
          if (pac && pac.clientHeight > 0) {
            e.preventDefault();
            return;
          }
        }
        onKeyDown?.(e);
      }}
    />
  );
}
