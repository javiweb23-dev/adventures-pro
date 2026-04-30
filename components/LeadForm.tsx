"use client";

import { FormEvent, useMemo, useState } from "react";

type TripType = "Private Vacation" | "Corporate Retreat" | "Golf Trip" | "Group Travel";

const tripTypes: TripType[] = [
  "Private Vacation",
  "Corporate Retreat",
  "Golf Trip",
  "Group Travel",
];

export default function LeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [travelDates, setTravelDates] = useState("");
  const [guests, setGuests] = useState("");
  const [tripType, setTripType] = useState<TripType | "">("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 1 &&
      email.trim().length > 3 &&
      phone.trim().length > 3 &&
      travelDates.trim().length > 1 &&
      guests.trim().length > 0 &&
      tripType.length > 0 &&
      status !== "loading"
    );
  }, [name, email, phone, travelDates, guests, tripType, status]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setTravelDates("");
    setGuests("");
    setTripType("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/send-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          travelDates: travelDates.trim(),
          guests: Number(guests),
          tripType,
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setErrorMessage(result.error || "We could not submit your request.");
        return;
      }

      setStatus("success");
      resetForm();
    } catch {
      setStatus("error");
      setErrorMessage("We could not submit your request.");
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Plan Your Perfect Trip</h2>
      <p className="mt-2 text-sm text-slate-600">
        Share your preferences and our team will contact you with a tailored proposal.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="lead-name" className="mb-1.5 block text-sm font-medium text-slate-900">
            Name
          </label>
          <input
            id="lead-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="lead-email" className="mb-1.5 block text-sm font-medium text-slate-900">
              Email
            </label>
            <input
              id="lead-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              required
            />
          </div>
          <div>
            <label htmlFor="lead-phone" className="mb-1.5 block text-sm font-medium text-slate-900">
              Phone
            </label>
            <input
              id="lead-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="lead-dates" className="mb-1.5 block text-sm font-medium text-slate-900">
            Travel Dates
          </label>
          <input
            id="lead-dates"
            type="text"
            placeholder="e.g. June 10 - June 15, 2026"
            value={travelDates}
            onChange={(e) => setTravelDates(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            required
          />
        </div>

        <div>
          <label htmlFor="lead-guests" className="mb-1.5 block text-sm font-medium text-slate-900">
            Number of Guests
          </label>
          <input
            id="lead-guests"
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            required
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-900">Trip Type</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {tripTypes.map((option) => {
              const active = tripType === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTripType(option)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "border-cyan-500 bg-cyan-50 text-slate-900"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {status === "success" ? (
          <p className="text-sm font-medium text-emerald-600">Thank you. We will contact you shortly.</p>
        ) : null}
        {status === "error" ? <p className="text-sm font-medium text-red-600">{errorMessage}</p> : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="h-12 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Sending..." : "Start Planning"}
        </button>
      </form>
    </section>
  );
}
