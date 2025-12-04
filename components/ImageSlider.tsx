import React, {useState, useEffect} from 'react';
import {View, Image, TouchableOpacity, Dimensions} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

interface ImageSliderProps {
  images: any[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  height?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  autoPlay = true,
  interval = 3000,
  showIndicators = true,
  height = 160,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval, images.length]);

  const goToSlide = (index: number) => setCurrentIndex(index);

  const goToNext = () =>
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));

  const goToPrev = () =>
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));

  if (!images || images.length === 0) return null;

  return (
    <View
      className="rounded-xl overflow-hidden my-2.5 mb-5"
      style={{width: screenWidth - 32, height}}>
      
      {/* Image */}
      <Image
        source={images[currentIndex]}
        className="w-full h-full resize-cover "
        resizeMode="stretch"
      />

      {/* LEFT BUTTON */}
      {images.length > 1 && (
        <TouchableOpacity
          className="absolute top-1/2 -translate-y-4 left-3 w-8 h-8 rounded-full bg-black/30 justify-center items-center"
          onPress={goToPrev}>
          <View
            className="w-0 h-0 border-y-[5px] border-y-transparent border-r-[8px] border-r-white rotate-180"
          />
        </TouchableOpacity>
      )}

      {/* RIGHT BUTTON */}
      {images.length > 1 && (
        <TouchableOpacity
          className="absolute top-1/2 -translate-y-4 right-3 w-8 h-8 rounded-full bg-black/30 justify-center items-center"
          onPress={goToNext}>
          <View
            className="w-0 h-0 border-y-[5px] border-y-transparent border-r-[8px] border-r-white"
          />
        </TouchableOpacity>
      )}

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <View className="absolute bottom-3 flex-row self-center">
          {images.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToSlide(index)}
              className={`h-2 rounded-full mx-1 
                ${currentIndex === index ? 'bg-green-600 w-5' : 'bg-white/50 w-2'}
              `}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default ImageSlider;
