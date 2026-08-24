
export default function BannerVideo() {
  return (
    <>
      <div id="carouselExampleIndicators" className="carousel slide mb-20!">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active  ">
            <iframe
              width="100%"
              height="500px"
              src="https://www.youtube.com/embed/xmOSb5SbRZ8?si=jDLRSIBhnqmowwOR"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
          <div className="carousel-item">
            <iframe
              width="100%"
              height="500px"
              src="https://www.youtube.com/embed/fdS1ZQ7WJMk?si=CITowxDwgFl6zPMD"
              title="YouTube video player"
              allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
          <div className="carousel-item">
            <iframe
              width="100%"
              height="500px"
              src="https://www.youtube.com/embed/jfOVme9RxdY?si=55V6SRl75u1ikjIU"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <button
          className="carousel-control-prev h-16! w-16! top-1/2! -translate-y-1/2!"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
         <button
          className="carousel-control-next h-16! w-16! top-1/2! -translate-y-1/2!"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
}
