import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListGallery } from "@workspace/api-client-react";
import { X } from "lucide-react";
import heroImg from "@/assets/images/hero.png";
import starterImg from "@/assets/images/starter.png";
import main1Img from "@/assets/images/main1.png";
import main2Img from "@/assets/images/main2.png";
import dessertImg from "@/assets/images/dessert.png";
import drinkImg from "@/assets/images/drink.png";
import interior1Img from "@/assets/images/interior1.png";
import interior2Img from "@/assets/images/interior2.png";

// Fallback images in case the API is empty
const FALLBACK_GALLERY = [
  { id: 1, imageUrl: heroImg, caption: "Farm to table spread", sortOrder: 1 },
  { id: 2, imageUrl: interior1Img, caption: "Our dining room", sortOrder: 2 },
  { id: 3, imageUrl: main1Img, caption: "Herb roasted chicken", sortOrder: 3 },
  { id: 4, imageUrl: drinkImg, caption: "Botanical spritz", sortOrder: 4 },
  { id: 5, imageUrl: interior2Img, caption: "Cozy corners", sortOrder: 5 },
  { id: 6, imageUrl: main2Img, caption: "Handmade pappardelle", sortOrder: 6 },
  { id: 7, imageUrl: starterImg, caption: "Heirloom burrata", sortOrder: 7 },
  { id: 8, imageUrl: dessertImg, caption: "Rustic fruit tart", sortOrder: 8 },
];

export default function Gallery() {
  const { data: apiGallery, isLoading } = useListGallery();
  const [selectedImage, setSelectedImage] = useState<{imageUrl: string, caption?: string | null} | null>(null);

  const gallery = apiGallery && apiGallery.length > 0 ? apiGallery : FALLBACK_GALLERY;

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">Gallery</h1>
          <div className="h-px w-24 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto italic">
            Glimpses of life, food, and atmosphere at The Harvest Table.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-muted animate-pulse rounded-xl w-full" style={{ height: `${Math.random() * 200 + 200}px` }}></div>
            ))}
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {gallery.sort((a,b) => a.sortOrder - b.sortOrder).map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl"
                onClick={() => setSelectedImage({ imageUrl: photo.imageUrl, caption: photo.caption })}
              >
                <img 
                  src={photo.imageUrl} 
                  alt={photo.caption || "Gallery image"} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {photo.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <p className="text-white p-6 font-serif text-lg">{photo.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-5xl max-h-[85vh] relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage.imageUrl} 
                alt={selectedImage.caption || "Enlarged gallery image"} 
                className="w-auto max-h-[80vh] object-contain rounded-lg"
              />
              {selectedImage.caption && (
                <p className="text-white text-center mt-4 font-serif text-xl">{selectedImage.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
