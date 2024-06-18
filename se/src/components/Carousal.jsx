import React from 'react';

const Carousal = ({ images, index, goToSlide }) => {
  return (
    <>
      <div className="image-container">
        <img
          src={images[index].src} // Use the index prop to access the current image
          alt={`Slide ${index + 1}`} // Use the index prop to display the slide number
          // No need for isFading state here, as it's controlled by the parent component
          // className={isFading ? 'fade' : ''} 
        />
        {/* <div className="text" dangerouslySetInnerHTML={{ __html: images[index].text }} /> */}
      </div>
      <div className="dots">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={index === i ? 'active' : ''} // Use index prop for comparison
          ></button>
        ))}
      </div>
    </>
  );
};

export default Carousal;
