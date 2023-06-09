import React, { useState } from 'react';
import styles from './Slider.module.css';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, IconButton } from '@mui/material';

function Slider(media) {
    
    const [currentActiveSlide, setCurrentActiveSlide] = useState(0);     

    const nextSlide = () => {
        setCurrentActiveSlide(currentActiveSlide === media.media.length - 1 ? 0 : currentActiveSlide + 1);
    };

    const previousSlide = () => {
        setCurrentActiveSlide(currentActiveSlide === 0 ? media.media.length - 1 : currentActiveSlide - 1);
    }; 

    return (
        <Box>
            <Box sx={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginX:2, background: '#e6e7ee'}}> 
                <IconButton onClick ={previousSlide} sx={{position: 'absolute', left: '1rem', top: '50%', zIndex: 1}}>
                    <ArrowBackIosIcon />
                </IconButton>
                               
                {media.media.map((currentSlide, index) => {
                    return (
                        <Box
                            className={`${index === currentActiveSlide ? styles.active : ''} ${styles.currentSlide}`}
                            key={index}
                            sx={{height: '350px',}}
                        >
                            {index === currentActiveSlide && <img src={currentSlide} className={styles.media_image} />}
                        </Box>
                    );
                })}

                <IconButton onClick ={nextSlide} sx={{position: 'absolute', right: '1rem', top: '50%', zIndex: 1}}> 
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
        </Box>
    )
}

export default Slider;