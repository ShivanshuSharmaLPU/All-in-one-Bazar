import React, { useState, useEffect } from 'react';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({ images = [] }) => {
    const [mainImg, setMainImg] = useState(null);

    useEffect(() => {
        if (images && images.length > 0) {
            setMainImg(images[0].url);
        }
    }, [images]);

    if (!images || images.length === 0) {
        return <div className="w-[500px] h-[500px] bg-gray-100 animate-pulse rounded-xl" />;
    }

    return (
        <div className='flex gap-5 items-start'>
            <div className='flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar'>
                {images.map((img, index) => (
                    <div
                        key={index}
                        onClick={() => setMainImg(img.url)}
                        className={`cursor-pointer w-20 h-20 border-2 rounded-md overflow-hidden transition-all duration-200 ${
                            mainImg === img.url ? 'border-orange-600 shadow-sm' : 'border-gray-200 hover:border-orange-300'
                        }`}
                    >
                        <img src={img.url} alt="" className='w-full h-full object-contain bg-white' />
                    </div>
                ))}
            </div>

            <div className='border border-gray-100 shadow-lg rounded-xl p-4 bg-white flex items-center justify-center w-[500px] h-[500px]'>
                {mainImg && (
                    <Zoom>
                        <img src={mainImg} alt="" className='max-w-[460px] max-h-[460px] object-contain' />
                    </Zoom>
                )}
            </div>
        </div>
    );
};

export default ProductImg;