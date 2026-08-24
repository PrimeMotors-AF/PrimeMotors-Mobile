import { useNavigate } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Button from "../../../components/Button";
import {cars} from "../../../data/bannerCar";


export default function CarrouselCar() {
  const navigate = useNavigate();
  return (
    
    <div className="justify-self-center w-full vh-300 overflow-hidden ">
      <h2 className="text-center my-5 text-[#C59958]!">Encontre sua próxima obra-prima</h2>
      <div className="relative  bg-white py-10 ">
        <Swiper
          modules={[Navigation]}
          spaceBetween={15}
          slidesPerView={2}
          centeredSlides={true}
          loop={true}
          wrapperClass="flex justify-self-center place-items-center m-auto my-20!"
          navigation={{
            nextEl: ".button-next",
            prevEl: ".button-prev",
          }}
          className="mySwiper"
        >
          {cars.map((car, index) => (
            <SwiperSlide key={index}>
              {({ isActive }) => (
                <div
                  className={`flex flex-col items-center transition-all duration-500  ${isActive ? "opacity-100 scale-100" : "opacity-30 scale-90"}`}
                >
                  <h2 className="italic tracking-wide mb-4 text-special ">
                    {car.name}
                  </h2>

                  <h3 className="text-6xl font-extrabold uppercase text-gray-800 mb-8 text-center max-w-2xl">
                    {car.slogan}
                  </h3>

                  <img
                    src={car.img}
                    alt={car.name}
                    className="w-full max-w-4xl h-70! object-contain scale-90"
                  />

                  <div
                    className={`flex gap-4 mt-10 transition-opacity  ${isActive ? "opacity-100" : "opacity-0"}`}
                  >
                    <Button texto="Ver Mais  ↓" className="border border-[#121212] px-4 py-3 font-bold uppercase text-xs flex items-center gap-2 hover:bg-[#121212] hover:text-white transition-all " onClick={()=>{navigate('/Explorar')}}/>
            
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="button-prev absolute left-10 top-1/3 -translate-y-1/12 z-10 border border-gray-400 p-4 rounded-sm hover:bg-[#121212] hover:text-white transition-all">
          ←
        </button>
        <button className="button-next absolute right-10 top-1/3 -translate-y-1/12 z-10 border border-gray-400 p-4 rounded-sm hover:bg-[#121212] hover:text-white transition-all">
          →
        </button>
      </div>
    </div>
  );
}
