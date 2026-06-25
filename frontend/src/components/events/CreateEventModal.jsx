import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { createEvent } from "../../services/eventService";
import toast from "react-hot-toast";
function CreateEventModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    price: "",
    image: "",
    description: "",
    tickets_available: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let imageUrl = "";

    if (formData.image) {
      const fileName = `${Date.now()}-${formData.image.name}`;

      const { error: uploadError } =
        await supabase.storage
          .from("event-images")
          .upload(fileName, formData.image);

      if (uploadError) {
        throw uploadError;
      }

      const { data } =
        supabase.storage
          .from("event-images")
          .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

          const newEvent = {
        title: formData.title,
        location: formData.location,
        date: formData.date,
        price: Number(formData.price),
        image: imageUrl,
        description: formData.description,
        tickets_available: Number(
       formData.tickets_available
         ),
      };

      await createEvent(newEvent);

      if (onSuccess) {
        onSuccess();
      }

      onClose();

    setFormData({
      title: "",
      location: "",
      date: "",
      price: "",
      image: null,
      description: "",
      tickets_available: "",
    });

    onClose();
  } catch (error) {
    console.error(error);
    toast.error("Failed to create event");
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Create Event
            </h2>

            <p className="mt-2 text-gray-500">
              Add a new event to the platform.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* Title */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Event Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter event title"
                className="h-14 w-full rounded-2xl border border-gray-300 px-4 outline-none focus:border-violet-700"
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter location"
                className="h-14 w-full rounded-2xl border border-gray-300 px-4 outline-none focus:border-violet-700"
              />
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Event Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="h-14 w-full rounded-2xl border border-gray-300 px-4 outline-none focus:border-violet-700"
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Ticket Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="Enter price"
                className="h-14 w-full rounded-2xl border border-gray-300 px-4 outline-none focus:border-violet-700"
              />
            </div>
          </div>

          
                          {/* Image Upload */}
                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Event Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        image: e.target.files[0],
                      }))
                    }
                    required
                    className="w-full rounded-2xl border border-gray-300 p-4 outline-none focus:border-violet-700"
                  />
                </div>

          {/* Description */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Description
            </label>

            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Write event description"
              className="w-full rounded-2xl border border-gray-300 p-4 outline-none focus:border-violet-700"
            />
          </div>
          {/* Tickets Available */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Tickets Available
            </label>

            <input
              type="number"
              name="tickets_available"
              value={formData.tickets_available}
              onChange={handleChange}
              required
              placeholder="Enter number of tickets"
              className="h-14 w-full rounded-2xl border border-gray-300 px-4 outline-none focus:border-violet-700"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-14 flex-1 rounded-2xl border border-gray-300 font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-14 flex-1 rounded-2xl bg-violet-700 font-semibold text-white transition hover:bg-violet-800"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEventModal;