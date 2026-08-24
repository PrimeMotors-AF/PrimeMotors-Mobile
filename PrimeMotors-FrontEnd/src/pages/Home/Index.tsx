import CarrouselCar from "./Components/BannerCar";
import BannerVideo from "./Components/BannerVideo";
import ReviewsSection from "./Components/ReviewsSection";

export default function Home(){
    return(
        <div>
            <BannerVideo/>
            <CarrouselCar/>
            <ReviewsSection/>
        </div>
    );
}