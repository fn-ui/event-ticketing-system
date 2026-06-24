import { useEffect, useState } from "react";

import AdminLayout from "../../components/dashboard/AdminLayout";

import CreateEventModal from "../../components/events/CreateEventModal";

import EditEventModal from "../../components/events/EditEventModal";

import {
  deleteEvent,
  getEvents,
} from "../../services/eventService";

import {
  CalendarDays,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

function AdminEvents() {
  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [openCreate, setOpenCreate] =
    useState(false);

  const [openEdit, setOpenEdit] =
    useState(false);

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const data =
        await getEvents();

      setEvents(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(
    id
  ) {
    const confirmDelete =
      window.confirm(
        "Delete this event?"
      );

    if (!confirmDelete)
      return;

    try {
      await deleteEvent(id);

      fetchEvents();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-5xl font-black text-gray-900">
              Events
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Manage all platform
              events.
            </p>
          </div>

          <button
            onClick={() =>
              setOpenCreate(
                true
              )
            }
            className="primary-btn flex items-center gap-3"
          >
            <Plus className="h-5 w-5" />

            Create Event
          </button>
        </div>

        {/* EVENTS */}
        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            Loading events...
          </div>
        ) : events.length ===
          0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            No events found.
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {events.map(
              (event) => (
                <div
                  key={
                    event.id
                  }
                  className="overflow-hidden rounded-[32px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <img
                    src={
                      event.image
                    }
                    alt={
                      event.title
                    }
                    className="h-60 w-full object-cover"
                  />

                  <div className="p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-black text-gray-900">
                          {
                            event.title
                          }
                        </h2>

                        <div className="mt-4 flex items-center gap-2 text-gray-500">
                          <CalendarDays className="h-4 w-4" />

                          {
                            event.date
                          }
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-gray-500">
                          <MapPin className="h-4 w-4" />

                          {
                            event.location
                          }
                        </div>
                      </div>

                      <div className="rounded-2xl bg-violet-100 px-4 py-3 font-bold text-violet-700">
                        KSh{" "}
                        {
                          event.price
                        }
                      </div>
                    </div>

                    <p className="mt-6 line-clamp-3 leading-7 text-gray-600">
                      {
                        event.description
                      }
                    </p>

                    {/* ACTIONS */}
                    <div className="mt-8 flex items-center gap-4">
                      <button
                        onClick={() => {
                          setSelectedEvent(
                            event
                          );

                          setOpenEdit(
                            true
                          );
                        }}
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-100 font-semibold text-violet-700 transition hover:bg-violet-200"
                      >
                        <Pencil className="h-4 w-4" />

                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            event.id
                          )
                        }
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-red-100 font-semibold text-red-600 transition hover:bg-red-200"
                      >
                        <Trash2 className="h-4 w-4" />

                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* MODALS */}
        <CreateEventModal
          isOpen={
            openCreate
          }
          onClose={() =>
            setOpenCreate(
              false
            )
          }
          onSuccess={
            fetchEvents
          }
        />

        <EditEventModal
          isOpen={
            openEdit
          }
          onClose={() =>
            setOpenEdit(
              false
            )
          }
          event={
            selectedEvent
          }
          onSuccess={
            fetchEvents
          }
        />
      </div>
    </AdminLayout>
  );
}

export default AdminEvents;