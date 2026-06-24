const bookings = [
  {
    id: "EVT-2026-000123",
    user: "Brian Otieno",
    event: "Tech Summit 2026",
    amount: "KSh 2,000",
    status: "Paid",
  },
  {
    id: "EVT-2026-000124",
    user: "Alice Wanjiku",
    event: "AI Workshop",
    amount: "KSh 1,500",
    status: "Paid",
  },
  {
    id: "EVT-2026-000125",
    user: "David Mwangi",
    event: "Music Fest Nairobi",
    amount: "KSh 3,000",
    status: "Pending",
  },
];

function RecentBookings() {
  return (
    <div className="table-wrapper">
      {/* Header */}
      <div className="border-b border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Recent Bookings
        </h2>

        <p className="mt-2 text-gray-500">
          Latest ticket purchases and
          payment activity.
        </p>
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Booking ID</th>

              <th>User</th>

              <th>Event</th>

              <th>Amount</th>

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="font-semibold text-gray-900">
                  {booking.id}
                </td>

                <td>{booking.user}</td>

                <td>{booking.event}</td>

                <td className="font-semibold">
                  {booking.amount}
                </td>

                <td>
                  <span
                    className={
                      booking.status ===
                      "Paid"
                        ? "badge-success"
                        : "badge-pending"
                    }
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentBookings;