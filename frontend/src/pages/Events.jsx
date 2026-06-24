import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  MapPin,
  Ticket,
} from "lucide-react";

import MainLayout from "../components/layout/MainLayout";

import BookingModal from "../components/events/BookingModal";

import { getEvents } from "../services/eventService";

function Events() {
  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents =
    async () => {
      try {
        const data =
          await getEvents();

        setEvents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainLayout>
      <section className="section-padding">
        <div className="container-width px-6">
          {/* HEADER */}
          <div className="text-center">
            <h1 className="text-5xl font-black text-gray-900">
              Explore Events
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-500">
              Discover premium
              concerts,
              conferences,
              festivals,
              exhibitions, and
              unforgettable
              experiences.
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="mt-20 flex justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700" />
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            events.length ===
              0 && (
              <div className="mt-20 rounded-3xl bg-white p-12 text-center shadow-sm">
                <h2 className="text-3xl font-black text-gray-900">
                  No Events
                  Available
                </h2>

                <p className="mt-4 text-gray-500">
                  Events will appear
                  here once created
                  by the admin.
                </p>
              </div>
            )}

          {/* EVENTS GRID */}
          {!loading &&
            events.length >
              0 && (
              <div className="mt-16 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
                {events.map(
                  (event) => {
                    const soldOut =
                      event.tickets_available <=
                      0;

                    return (
                      <div
                        key={
                          event.id
                        }
                        className="overflow-hidden rounded-3xl bg-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                      >
                        {/* IMAGE */}
                        <div className="relative h-72 overflow-hidden">
                          <img
                            src={
                              event.image
                            }
                            alt={
                              event.title
                            }
                            className="h-full w-full object-cover transition duration-500 hover:scale-110"
                          />

                          {/* PRICE */}
                          <div className="absolute right-5 top-5 rounded-2xl bg-violet-700 px-5 py-3 text-white shadow-lg">
                            <h4 className="text-xl font-black">
                              KES{" "}
                              {
                                event.price
                              }
                            </h4>
                          </div>

                          {/* SOLD OUT */}
                          {soldOut && (
                            <div className="absolute left-5 top-5 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg">
                              SOLD
                              OUT
                            </div>
                          )}
                        </div>

                        {/* CONTENT */}
                        <div className="p-8">
                          {/* TITLE */}
                          <h2 className="text-3xl font-black text-gray-900">
                            {
                              event.title
                            }
                          </h2>

                          {/* DESCRIPTION */}
                          <p className="mt-5 line-clamp-3 text-gray-500">
                            {
                              event.description
                            }
                          </p>

                          {/* INFO */}
                          <div className="mt-8 space-y-5">
                            {/* LOCATION */}
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">
                                <MapPin className="h-6 w-6 text-violet-700" />
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">
                                  Location
                                </p>

                                <h4 className="font-bold text-gray-900">
                                  {
                                    event.location
                                  }
                                </h4>
                              </div>
                            </div>

                            {/* DATE */}
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                                <CalendarDays className="h-6 w-6 text-blue-700" />
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">
                                  Event
                                  Date
                                </p>

                                <h4 className="font-bold text-gray-900">
                                  {new Date(
                                    event.date
                                  ).toLocaleDateString()}
                                </h4>
                              </div>
                            </div>

                            {/* TICKETS */}
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                                <Ticket className="h-6 w-6 text-green-700" />
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">
                                  Tickets
                                  Left
                                </p>

                                <h4
                                  className={`font-bold ${
                                    soldOut
                                      ? "text-red-600"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {soldOut
                                    ? "0 - Sold Out"
                                    : event.tickets_available}
                                </h4>
                              </div>
                            </div>
                          </div>

                          {/* BUTTON */}
                          <button
                            disabled={
                              soldOut
                            }
                            onClick={() =>
                              setSelectedEvent(
                                event
                              )
                            }
                            className={`mt-10 w-full rounded-2xl py-4 font-semibold text-white transition ${
                              soldOut
                                ? "cursor-not-allowed bg-gray-400"
                                : "bg-violet-700 hover:bg-violet-800"
                            }`}
                          >
                            {soldOut
                              ? "Sold Out"
                              : "Book Ticket"}
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
        </div>
      </section>

      {/* BOOKING MODAL */}
      {selectedEvent && (
        <BookingModal
          event={
            selectedEvent
          }
          onClose={() =>
            setSelectedEvent(
              null
            )
          }
        />
      )}
    </MainLayout>
  );
}

export default Events;