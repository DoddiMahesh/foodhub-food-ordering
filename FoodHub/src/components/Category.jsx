const categories = [
  "🍕 Pizza",
  "🍔 Burger",
  "🍟 Fries",
  "🌮 Taco",
  "🍜 Noodles",
  "🍗 Chicken",
  "🥗 Salad",
  "🍰 Dessert",
];

export default function Category() {
  return (
    <section className="w-full bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4">
        
        <h2 className="text-3xl font-bold mb-8 pt-10">
          Browse Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-5 pb-10">
          
          {categories.map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 text-center cursor-pointer hover:-translate-y-1"
            >
              
              <div className="text-4xl mb-3">
                {item.split(" ")[0]}
              </div>

              <h3 className="font-semibold">
                {item.split(" ")[1]}
              </h3>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}