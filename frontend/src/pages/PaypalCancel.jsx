function PaypalCancel() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-3xl bg-white p-10 shadow-xl">
        <h1 className="text-4xl font-black text-red-600">
          Payment Cancelled
        </h1>

        <p className="mt-4 text-gray-500">
          You cancelled the payment.
        </p>
      </div>
    </div>
  );
}

export default PaypalCancel;