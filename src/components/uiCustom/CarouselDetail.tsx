import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface CarouselDetailProps {
  images?: string[];
}

export function CarouselDetail({ images = [] }: CarouselDetailProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Fungsi untuk update state index saat slide berubah
  const onSelect = React.useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  React.useEffect(() => {
    if (!api) return;

    // Hitung total slide & set index awal dengan benar
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    // Daftarkan event listener
    api.on("select", onSelect);
    api.on("reInit", onSelect); // Penting agar tetap sinkron saat resize

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  if (!images || images.length === 0) {
    return (
      <div className="h-64 w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center mt-6">
        <span className="text-gray-400">No Images</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-1 mt-10">
      <div className="flex justify-center w-full mt-4">
        {/* Responsif: w-full agar mengikuti container induknya */}
        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{
            align: "start",
            loop: true, // Membuat carousel bisa berputar terus
          }}
        >
          <CarouselContent>
            {images.map((imgUrl, index) => (
              <CarouselItem key={index} className="basis-full">
                <Card className="border-none shadow-none p-0 bg-transparent">
                  <CardContent className="flex h-64 md:h-80 items-center justify-center p-0 overflow-hidden rounded-3xl">
                    <img
                      src={imgUrl}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Indikator Titik (Dots) dengan Transisi */}
      <div className="flex justify-center items-center gap-2.5 mt-6">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`transition-all duration-500 ease-in-out rounded-full ${
              current === index
                ? "w-8 h-2.5 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
