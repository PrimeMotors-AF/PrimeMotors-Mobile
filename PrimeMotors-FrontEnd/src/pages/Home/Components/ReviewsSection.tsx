import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { UserReviews } from "../../../data/reviews";

export default function ReviewsSection() {
  return (
    <section className="bg-[#121212] p-8! overflow-hidden mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-[#C59958]!">
            A experiência de quem escolheu a excelência!
          </h3>
        </div>

        <div className="w-full px-4 my-5 ">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={2.5}
            centeredSlides={true}
            loop={true}
            wrapperClass="flex items-center justify-self-center m-auto"
            autoplay={{ delay: 4000 }}
            pagination={{ clickable: true }}
            breakpoints={{
              1024: { slidesPerView: 2 },
            }}
            className="w-full pb-16"
          >
            {UserReviews.map((t) => (
              <SwiperSlide key={t.id}>
                {({ isActive }) => (
                  <div
                    className={`bg-zinc-900/50 border border-zinc-800 p-10 h-full flex flex-col justify-between hover:border-zinc-600 transition-colors duration-500 ${isActive ? "opacity-100 scale-100" : "opacity-30 scale-90"}`}
                  >
                    <div>
                      <span className="block mb-6">
                        <img src={t.img} alt="logo" />
                      </span>
                      <p className="text-sm leading-relaxed text-zinc-300 italic mb-8 p-2">
                        {t.content}
                      </p>
                    </div>

                    <div className="border-t border-zinc-800 pt-6">
                      <h4 className="font-bold tracking-wider uppercase text-sm p-2 text-white">
                        {t.name}
                      </h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[15px] bg-zinc-800 px-2 py-1 text-zinc-400 font-mono uppercase tracking-wider">
                          {t.carPurchased}
                        </span>
                        <span className="text-[15px] bg-zinc-800 px-2 py-1 text-zinc-400 font-mono uppercase">
                          <i className="bi bi-star-fill mr-2! text-[#C59958]"></i>
                          {t.stars} / 10
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
