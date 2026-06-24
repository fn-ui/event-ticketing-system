function Footer() {
  return (
    <footer className="mt-20 border-t border-violet-100 bg-white">
      <div className="container-width px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <div>
            <h2 className="text-2xl font-extrabold text-violet-700">
              EventHub
            </h2>

            <p className="mt-2 text-gray-500">
              Modern Event Ticketing &
              Payment Platform
            </p>
          </div>

          <p className="text-sm text-gray-500">
            © 2026 EventHub. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;