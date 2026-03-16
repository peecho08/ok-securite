"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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

interface Prediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
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
  const serviceRef = useRef<any>(null);
  const placesRef = useRef<any>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [suggestions, setSuggestions] = useState<Prediction[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    if (!apiKey) return;
    loadGoogleMaps(apiKey).then(() => {
      serviceRef.current = new google.maps.places.AutocompleteService();
      const div = document.createElement("div");
      placesRef.current = new google.maps.places.PlacesService(div);
    });
  }, [apiKey]);

  const fetchSuggestions = useCallback((input: string) => {
    if (!input.trim() || !serviceRef.current) {
      setSuggestions([]);
      return;
    }
    serviceRef.current.getPlacePredictions(
      { input, componentRestrictions: { country: "ca" } },
      (predictions: Prediction[] | null, status: string) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.slice(0, 5));
        } else {
          setSuggestions([]);
        }
      },
    );
  }, []);

  const selectPrediction = useCallback(
    (prediction: Prediction) => {
      setSuggestions([]);
      setOpen(false);
      setActiveIdx(-1);

      if (!placesRef.current) return;
      placesRef.current.getDetails(
        { placeId: prediction.place_id, fields: ["name", "formatted_address", "geometry"] },
        (place: any, status: string) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !place) return;
          const name = place.name || "";
          const address = place.formatted_address || "";
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();
          onChange(name);
          onPlaceSelected?.({ name, address, lat, lng });
        },
      );
    },
    [onChange, onPlaceSelected],
  );

  function handleInputChange(val: string) {
    onChange(val);
    setActiveIdx(-1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 200);
    setOpen(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (open && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => (i < suggestions.length - 1 ? i + 1 : 0));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => (i > 0 ? i - 1 : suggestions.length - 1));
        return;
      }
      if (e.key === "Enter" && activeIdx >= 0) {
        e.preventDefault();
        selectPrediction(suggestions[activeIdx]);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        setSuggestions([]);
        return;
      }
    }
    onKeyDown?.(e);
  }

  const showDropdown = open && suggestions.length > 0;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => { if (value.trim()) setOpen(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 250)}
        placeholder={placeholder}
        className={className}
        autoFocus={autoFocus}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
      />
      {showDropdown && (
        <ul className="absolute left-0 right-0 top-full z-[10000] mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
          {suggestions.map((s, i) => (
            <li
              key={s.place_id}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectPrediction(s)}
              onTouchEnd={(e) => { e.preventDefault(); selectPrediction(s); }}
              className={`flex cursor-pointer items-start gap-2.5 px-3.5 py-3 text-sm transition-colors active:bg-gray-100 dark:active:bg-neutral-700 ${
                i === activeIdx ? "bg-gray-100 dark:bg-neutral-700" : ""
              } ${i < suggestions.length - 1 ? "border-b border-gray-100 dark:border-neutral-700" : ""}`}
            >
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="min-w-0">
                <span className="font-medium text-gray-800 dark:text-neutral-100">{s.structured_formatting.main_text}</span>
                <span className="ml-1 text-gray-400 dark:text-neutral-500">{s.structured_formatting.secondary_text}</span>
              </span>
            </li>
          ))}
          <li className="px-3.5 py-1.5 text-right">
            <img src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3_hdpi.png" alt="Powered by Google" className="inline-block h-3 dark:brightness-0 dark:invert" />
          </li>
        </ul>
      )}
    </div>
  );
}
