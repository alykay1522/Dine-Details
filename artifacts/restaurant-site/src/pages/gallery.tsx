import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "@assets/1000017237_1776656424748.jpg";
import img2 from "@assets/1000017238_1776656424749.jpg";
import img3 from "@assets/1000017239_1776656424750.jpg";
import img4 from "@assets/1000017240_1776656424751.jpg";
import img5 from "@assets/1000017241_1776656424752.jpg";
import img6 from "@assets/1000017242_1776656424753.jpg";
import img7 from "@assets/1000017243_1776656424754.jpg";
import img8 from "@assets/1000017244_1776656424756.jpg";
import img9 from "@assets/1000017245_1776656424757.jpg";
import img10 from "@assets/1000017246_1776656424758.jpg";
import img11 from "@assets/1000017247_1776656424760.jpg";
import img12 from "@assets/1000017248_1776656424761.jpg";
import truckFront from "@assets/foodtruckfront_1776656329344.jpg";
import truckBack from "@assets/Foodtruck_1776656329342.jpg";
import msPiggy from "@assets/msPiggy_1776656228023.jpg";
import img16 from "@assets/1000017249_1776657659125.jpg";
import img17 from "@assets/1000017250_1776657659128.jpg";
import img18 from "@assets/1000017251_1776657659129.jpg";
import img19 from "@assets/1000017252_1776657659130.jpg";
import img20 from "@assets/1000017253_1776657659132.jpg";
import img21 from "@assets/1000017254_1776657659134.jpg";
import img22 from "@assets/1000017255_1776657659135.jpg";
import img23 from "@assets/1000017256_1776657659136.jpg";
import img24 from "@assets/1000017257_1776657659137.jpg";
import img25 from "@assets/1000017258_1776657659139.jpg";
import img26 from "@assets/1000017259_1776657659140.jpg";
import img27 from "@assets/1000017260_1776657659141.jpg";
import img28 from "@assets/1000017261_1776657659143.jpg";
import img29 from "@assets/1000017262_1776657659145.jpg";
import img30 from "@assets/1000017263_1776657659146.jpg";
import img31 from "@assets/1000017264_1776657659147.jpg";

const GALLERY = [
  { id: 1, src: img1, caption: "Fresh from the kitchen" },
  { id: 2, src: img2, caption: "Handmade with love" },
  { id: 3, src: img3, caption: "Big flavors" },
  { id: 4, src: img4, caption: "Made to order" },
  { id: 5, src: img5, caption: "Texas Panhandle favorites" },
  { id: 6, src: img6, caption: "Served hot" },
  { id: 7, src: img7, caption: "Come hungry" },
  { id: 8, src: img8, caption: "Something for everyone" },
  { id: 9, src: img9, caption: "Family favorites" },
  { id: 10, src: img10, caption: "Canyon, TX eats" },
  { id: 11, src: img11, caption: "Tim & Rene's kitchen" },
  { id: 12, src: img12, caption: "Every bite counts" },
  { id: 13, src: truckFront, caption: "The original food truck" },
  { id: 14, src: truckBack, caption: "Honk if you like my butt!" },
  { id: 15, src: msPiggy, caption: "The face of This Little Piggy" },
  { id: 16, src: img16, caption: "Golden fried catfish" },
  { id: 17, src: img17, caption: "Pasta with marinara & olive tapenade" },
  { id: 18, src: img18, caption: "Loaded burger & fries" },
  { id: 19, src: img19, caption: "Open-face roasted chicken & mashed potatoes" },
  { id: 20, src: img20, caption: "Creamy homestyle chowder" },
  { id: 21, src: img21, caption: "Club sandwiches with chips & fried okra" },
  { id: 22, src: img22, caption: "The Piggy Pizza — jalapeños & all" },
  { id: 23, src: img23, caption: "Frito pie loaded up right" },
  { id: 24, src: img24, caption: "House salad piled high" },
  { id: 25, src: img25, caption: "Hearty minestrone soup" },
  { id: 26, src: img26, caption: "Marinated olive & mushroom salad" },
  { id: 27, src: img27, caption: "Smothered potato & cherry cobbler" },
  { id: 28, src: img28, caption: "Chicken marsala with fettuccine" },
  { id: 29, src: img29, caption: "Fried veggie basket" },
  { id: 30, src: img30, caption: "Taco pizza" },
  { id: 31, src: img31, caption: "Supreme pizza fresh out of the oven" },
];

export default function Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);

  const goPrev = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + GALLERY.length) % GALLERY.length);
  };

  const goNext = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % GALLERY.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
    if (e.key === "Escape") closeLightbox();
  };

  return (
    <div className="min-h-screen bg-background pt-12 pb-24" onKeyDown={handleKeyDown}>
      <div className="container mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            <span className="text-primary">Food</span> <span className="text-accent">Gallery</span>
          </h1>
          <div className="h-1 w-24 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A peek at the delicious food coming out of This Little Piggy's kitchen every day.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {GALLERY.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl border border-border hover:border-primary/60 transition-colors shadow-md shadow-black/40"
              onClick={() => openLightbox(index)}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Caption overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end pointer-events-none">
                <p className="text-white p-4 font-serif text-base font-semibold">{photo.caption}</p>
              </div>
              {/* Pink corner accent */}
              <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-primary/50" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 z-10 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={closeLightbox}
            >
              <X size={28} />
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 z-10 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-primary/80 transition-colors"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >
              <ChevronLeft size={28} />
            </button>

            {/* Next */}
            <button
              className="absolute right-4 z-10 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-primary/80 transition-colors"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            >
              <ChevronRight size={28} />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIdx}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY[lightboxIdx].src}
                alt={GALLERY[lightboxIdx].caption}
                className="max-h-[80vh] max-w-full object-contain rounded-xl border-2 border-primary/40 shadow-2xl"
              />
              <p className="text-white mt-4 font-serif text-lg text-center">
                {GALLERY[lightboxIdx].caption}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                {lightboxIdx + 1} / {GALLERY.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
