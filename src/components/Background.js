import React, {useState} from "react"
import Image from './Image'

function Background(){
  const [translate,setTranslate] = useState(true)

  function move() {
    translate ? setTranslate(false) : setTranslate(true)
  }
  return (
  <>
  <button onClick={move} Style="position:absolute; top: 0">Click</button>

  <div className="cont">
  <div className="imageCont" Style={translate ? 'transform:translateX(0)' : 'transform:translateX(100%)'}>
  <Image
  imgStyle={{
    objectFit: "cover",
    objectPosition: '50% 50%'
  }}
  filename={'primary.jpeg'}/>
  </div>

  <div className="imageCont" Style={translate ? 'transform:translateX(-100%)' : 'transform:translateX(0)'}>
  <Image
  imgStyle={{
    objectFit: "cover",
    objectPosition: '50% 50%'
  }}
  filename={'primary.jpeg'}/>
  </div>

  <div className="imageCont" Style={translate ? 'transform:translateX(100%)' : 'transform:translateX(-100%)'}>
  <Image
  imgStyle={{
    objectFit: "cover",
    objectPosition: '50% 50%'
  }}
  filename={'primary.jpeg'}/>
  </div>

  </div>
  </>
)
}

export default Background
