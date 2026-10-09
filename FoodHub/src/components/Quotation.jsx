import React from 'react'

export default function Quotation() {
  return (
    <div>
        <section className="bg-orange-100 ">
            <div className="max-w-6xl mx-auto px-2 py-8 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="max-w-xl">
                    <h1 className="text-2xl md:text-4xl font-bold leading-tight">
                        Delicious<span className='text-orange-500'>Food</span><br /> Delivered to Your Door
                    </h1>

                    <p className="mt-6 text-lg font-semibold">
                        Discover the best restaurants near you and enjoy fast delivery with
                        FoodHub.
                    </p>

                    <button className="mt-8 bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover">
                        Order Now
                    </button>
                </div>

                <img
                    src="https://images.pexels.com/photos/18601877/pexels-photo-18601877.jpeg?_gl=1*skzayo*_ga*MzEyODg0NTkwLjE3ODU5MzQ3MDQ.*_ga_8JE65Q40S6*czE3ODU5MzQ3MDMkbzEkZzEkdDE3ODU5MzQ5MDYkajU5JGwwJGgw"
                    alt="Pizza"
                    className="rounded-3xl shadow-2xl max-w-72"
                />
            </div>
        </section>
    </div>
  )
}
