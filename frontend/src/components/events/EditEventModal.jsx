import {
  useEffect,
  useState,
} from "react";

import { X } from "lucide-react";

function EditEventModal({
  isOpen,
  onClose,
  selectedEvent,
  onUpdate,
}) {
  const [formData, setFormData] =
    useState({
      title: "",
      location: "",
      date: "",
      price: "",
      image: "",
      description: "",
      tickets_available: "",
    });

  const [imageFile, setImageFile] =
    useState(null);

  const [previewImage, setPreviewImage] =
    useState("");

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        ...selectedEvent,
      });

      setPreviewImage(
        selectedEvent.image || ""
      );
    }
  }, [selectedEvent]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleImageChange = (
    e
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    setImageFile(file);

    const imageUrl =
      URL.createObjectURL(file);

    setPreviewImage(
      imageUrl
    );
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    await onUpdate({
      ...formData,
      imageFile,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-8">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Edit Event
            </h2>

            <p className="mt-2 text-gray-500">
              Update event details.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-6"
        >
          {/* TOP GRID */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* TITLE */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Event Title
              </label>

              <input
                type="text"
                name="title"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
                required
                placeholder="Event title"
                className="h-14 w-full rounded-2xl border border-gray-300 px-4 outline-none focus:border-violet-700"
              />
            </div>

            {/* LOCATION */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={
                  formData.location
                }
                onChange={
                  handleChange
                }
                required
                placeholder="Location"
                className="h-14 w-full rounded-2xl border border-gray-300 px-4 outline-none focus:border-violet-700"
              />
            </div>

            {/* DATE */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Event Date
              </label>

              <input
                type="date"
                name="date"
                value={
                  formData.date
                }
                onChange={
                  handleChange
                }
                required
                className="h-14 w-full rounded-2xl border border-gray-300 px-4 outline-none focus:border-violet-700"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Ticket Price
              </label>

              <input
                type="number"
                name="price"
                value={
                  formData.price
                }
                onChange={
                  handleChange
                }
                required
                placeholder="Price"
                className="h-14 w-full rounded-2xl border border-gray-300 px-4 outline-none focus:border-violet-700"
              />
            </div>
          </div>

          {/* IMAGE */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Upload New Event
              Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
              className="w-full rounded-2xl border border-gray-300 p-4 file:mr-4 file:rounded-xl file:border-0 file:bg-violet-700 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-violet-800"
            />
          </div>

          {/* IMAGE PREVIEW */}
          {previewImage && (
            <div>
              <p className="mb-3 font-medium text-gray-700">
                Image Preview
              </p>

              <img
                src={
                  previewImage
                }
                alt="Preview"
                className="h-64 w-full rounded-3xl object-cover"
              />
            </div>
          )}

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Description
            </label>

            <textarea
              rows="5"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              required
              placeholder="Description"
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
                placeholder="Tickets available"
                className="h-14 rounded-2xl border border-gray-300 px-4 outline-none focus:border-violet-700"
              />
            </div>

          {/* BUTTONS */}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEventModal;