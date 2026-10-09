export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 ">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Food<span className="text-orange-500">Hub</span>
          </h2>

          <p className="mt-4">
            Fast, fresh and delicious food delivered right to your doorstep.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>Home</li>
            <li>Restaurants</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <p>Email: foodhub@gmail.com</p>
          <p>Phone: +91 99999 88888</p>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-sm">
        &copy; 2026 FoodHub. All rights reserved.
      </div>
    </footer>
  );
}