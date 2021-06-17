import React, { useRef,useEffect,useState } from 'react';
import { ZapparCamera, ImageTracker, ZapparCanvas,useFrame} from '@zappar/zappar-react-three-fiber';

import targetFile from './assets/trackers/mrtan_AR.zpt'
import qrCode from './assets/trackers/qr_code.zpt'
import { gsap } from "gsap";

import * as THREE from "three";

function App() {
  
    const [vid0, setVid0] = useState(undefined);

    useEffect(() => {
      setVid0(document.querySelector(".dancer-vid"));
    }, []);

    return (
      <>
      <ZapparCanvas>
        <Scene vid0={vid0}></Scene>
      </ZapparCanvas>
      <video className="dancer-vid" style={{display:"none"}} loop={true} autoPlay={true} playsInline={true} src="https://goodgood.sg/resources/ncid/dancer1.webm" crossOrigin="anonymous"></video>
      </>
    );
}

function Scene(props){
  const {vid0} = props;
  
  

  const planeMesh=useRef();

  const [boxVisible, setBoxVisible] = useState(false);
  const [planeVisible, setPlaneVisible] = useState(false);
  // const [planeTexture,setPlaneTexture]= useState(undefined);
  const [opacities, setOpacities] = useState({
    dancer:0
  });

  function onVisible(anchor){
    vid0.play();
    setPlaneVisible(true);
    gsap.to(opacities,{dancer:1,duration:0.7,onUpdate:()=>{
      planeMesh.current.material.opacity=opacities.dancer;
    }})
    // gsap.to(opacities,{dancer:1,duration:0.3})
  }
  function onNotVisible(anchor){
    vid0.pause();
    gsap.to(opacities,{dancer:0,duration:0.2,onUpdate:()=>{
      planeMesh.current.material.opacity=opacities.dancer;
    },onComplete:()=>{
      setPlaneVisible(false);
    }})
  }

  useEffect(() => {
    
    console.log(opacities.dancer)
  }, [opacities]);


  return (
    <>
      <ZapparCamera userCameraMirrorMode="poses" rearCameraMirrorMode="none" />
        <ImageTracker
          onNotVisible={(anchor) => {console.log(`Not visible ${anchor.id}`);onNotVisible(anchor)}}
          onNewAnchor={(anchor) => console.log(`New anchor ${anchor.id}`)}
          onVisible={(anchor) => {console.log(`Visible ${anchor.id}`);onVisible(anchor)}}
          targetImage={targetFile}
        >
          <mesh visible={planeVisible} ref={planeMesh} position={[0, 0, 0]}>
            <planeGeometry attach="geometry" args={[4,4]} />
            <meshBasicMaterial transparent={true}>
              <videoTexture attach="map" args={[vid0]} format={THREE.RGBAFormat} />
            </meshBasicMaterial>
          </mesh>
        </ImageTracker>

        <ImageTracker
          onNotVisible={(anchor) => {setBoxVisible(false)}}
          onNewAnchor={(anchor) => console.log(`New anchor ${anchor.id}`)}
          onVisible={(anchor) => {setBoxVisible(true)}}
          targetImage={qrCode}
        >
          <mesh visible={boxVisible} position={[0, 0, 0.5]}>
            <boxGeometry attach="geometry" args={[1,1,1]} />
            <meshNormalMaterial transparent={true} opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
          <mesh visible={boxVisible} position={[0, 0, 0.5]}>
            <torusKnotGeometry attach="geometry" args={[0.3,0.1,64,16]}  />
            <meshNormalMaterial />
          </mesh>
        </ImageTracker>
      <directionalLight position={[2.5, 8, 5]} intensity={1.5} />
      
    </>
  )
}

export default App;
