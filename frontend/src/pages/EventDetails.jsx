import {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
} from "lucide-react";

import MainLayout from "../components/layout/MainLayout";

import BookingModal from "../components/events/BookingModal";

import { getEventById } from "../services/eventService";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);
  const navigate = useNavigate();

  const [
    showBookingModal,
    setShowBookingModal,
  ] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent =
    async () => {
      try {
        const data =
          await getEventById(id);

        setEvent(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <MainLayout>
        <div className="container-width px-6 py-32 text-center">
          <h1 className="text-4xl font-black text-violet-700">
            Loading Event...
          </h1>
        </div>
      </MainLayout>
    );
  }

  if (!event) {
    return (
      <MainLayout>
        <div className="container-width px-6 py-32 text-center">
          <h1 className="text-5xl font-black text-gray-900">
            Event Not Found
          </h1>
        </div>
      </MainLayout>
    );
  }

  const handleProceedPayment = (
  quantity,
  total
) => {
  navigate("/payments", {
    state: {
      event,
      quantity,
      total,
    },
  });

  setShowBookingModal(false);
};

  return (
    <MainLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="h-[650px] w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute inset-0 flex items-center">
          <div className="container-width px-6">
            <div className="max-w-3xl text-white">
              <div className="mb-6 inline-flex rounded-full bg-white/20 px-5 py-3 text-sm font-bold backdrop-blur">
                Premium Event Experience
              </div>

              <h1 className="text-6xl font-black leading-tight">
                {event.title}
              </h1>

              <p className="mt-8 text-lg leading-9 text-gray-200">
                {event.description}
              </p>

              {/* INFO */}
              <div className="mt-10 grid gap-5 md:grid-cols-3">
                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-6 w-6" />

                    <span className="font-semibold">
                      {event.date}
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-6 w-6" />

                    <span className="font-semibold">
                      {event.time}
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6" />

                    <span className="font-semibold">
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* PRICE */}
              <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center">
                <div>
                  <p className="text-gray-300">
                    Ticket Price
                  </p>

                  <h2 className="text-5xl font-black">
                    KSh {event.price}
                  </h2>
                </div>

                <button
                  onClick={() =>
                    setShowBookingModal(true)
                  }
                  className="flex h-16 items-center justify-center rounded-2xl bg-violet-700 px-10 font-bold text-white transition hover:bg-violet-800"
                >
                  Book Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {showBookingModal && (
        <BookingModal
          event={event}
          onClose={() =>
            setShowBookingModal(false)
          }
          onProceed={
            handleProceedPayment
          }
        />
      )}
    </MainLayout>
  );
}

export default EventDetails;