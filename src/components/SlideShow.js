import React, {useState, useEffect} from "react"
import Image from './Image'
import Div100vh from 'react-div-100vh'

import slideShowStyles from "./slideShow.module.css"



const slides = ['favourites/IMG_5399.jpeg','favourites/1qOp6rJsQwu+1Wtfm%FltQ.jpg','favourites/Alfie Narnain.JPG','favourites/e%5UmSF+RRy+vURJnwMMng.jpg','favourites/eXPE3pvOSTO%dUzC4Vuy2g.jpg', 'favourites/fullsizeoutput_1ca1.jpeg', 'favourites/IMG_2269.JPG',
'favourites/IMG_2716.JPG','favourites/JB%FYOoiTRGJn5Q3%dXVVw.jpg', 'favourites/UgsZ%K2PSgyIvHtk5cGnKg.jpg', 'favourites/v7+5d%q8TeWeCELjTThRhg.jpg' ]

function SlideShow(){
  const [activeSlide,setActiveSlide] = useState(0)
  const [translate,setTranslate] = useState(true)
  const [intervalVal, setIntervalVal] = useState(1000);
  const [counter, setCounter] = useState(0);


  function back() {
    setCounter(0)
    activeSlide === 0 ?
    setActiveSlide(slides.length-1)
    :
    setActiveSlide(activeSlide-1)
  }


    function forward() {
      setCounter(0)
      activeSlide === slides.length-1 ?
      setActiveSlide(0)
      :
      setActiveSlide(activeSlide+1)
    }


  useEffect(() => {
    const interval = setInterval(() => {
      if (counter === 4) {
        setCounter(0);
      }
      else {
       setCounter(counter => counter + 1)
     }
    }, intervalVal);

    return () => {
      clearInterval(interval);
    };
  }, [intervalVal, counter]);

  useEffect(() => {
    if (counter === 4) {
      if (activeSlide === slides.length-1) {
        setActiveSlide(0)
      }
      else {setActiveSlide(activeSlide+1)}
    }
  },[counter])



  const slideList = slides.map((slide,index) =>
    <div className="imageCont" id={index}
        Style={activeSlide === index ? 'transform:translateX(0); visibility:visible; z-index: 5'
        : activeSlide === 0 && index === slides.length-1 ? `transform:translateX(-100%); visibility:visible; z-index:4;`
        : activeSlide === slides.length-1 && index === 0 ? 'transform:translateX(100%); visibility:visible; z-index: 3;'
        : index === activeSlide + 1  ? 'transform:translateX(100%); visibility:visible; z-index: 3;'
        : index === activeSlide -  1 ? 'transform:translateX(-100%); visibility:visible; z-index:4;'
        : index === 0 && activeSlide === 2 ? 'transform:translateX(-200%); visibility:hidden; z-index: 2'
        : 'transform:translateX(-200%); visibility:hidden; z-index: 2'

      }>
    <Image
    style={{position:"default"}}
    imgStyle={{
      objectFit: "cover",
      objectPosition: '50% 60%'
    }}
    filename={slide}/>
    </div>
  )

  return (
  <>

  <Div100vh>
  <div className="cont">
  <button onClick={forward} className={slideShowStyles.arrow_forward} >&#8250;</button>
  <button onClick={back} className={slideShowStyles.arrow_back} >&#8249;</button>
  {slideList}
  </div>
  <div Style="text-align:center; padding: 0.5em">Some of our favourite moments!</div>
  </Div100vh>
  </>
)
}

export default SlideShow
