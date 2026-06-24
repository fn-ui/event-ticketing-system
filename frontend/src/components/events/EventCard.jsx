import { Link } from "react-router-dom";

import {
  CalendarDays,
  MapPin,
} from "lucide-react";

function EventCard({ event }) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <img
        src={event.image}
        alt={event.title}
        className="h-[240px] w-full object-cover"
      />

      {/* Content */}
      <div className="p-6">
        <h2 className="line-clamp-1 text-2xl font-bold text-gray-900">
          {event.title}
        </h2>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays className="h-4 w-4" />

          <span>{event.date}</span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />

          <span>{event.location}</span>
        </div>

        <p className="mt-4 line-clamp-2 text-gray-600">
          {event.description}
        </p>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <h3 className="text-2xl font-extrabold text-violet-700">
            KSh {event.price}
          </h3>

          <Link
            to={`/events/${event.id}`}
            className="rounded-2xl bg-violet-700 px-5 py-3 font-semibold text-white transition hover:bg-violet-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;