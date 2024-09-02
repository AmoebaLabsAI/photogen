APP
import { useLayoutEffect, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMask, useGLTF, useAnimations, Float, Instance, Instances, CameraControls } from '@react-three/drei'
import { Lightformer, Environment, RandomizedLight, AccumulativeShadows, MeshTransmissionMaterial } from '@react-three/drei'

export default function App({ spheres }) {
  return (
    <Canvas shadows camera={{ position: [30, 0, -3], fov: 35, near: 1, far: 50 }}>
      <color attach="background" args={['#c6e5db']} />
      {/** Glass aquarium */}
      <Aquarium position={[0, 0.25, 0]}>
        <Float rotationIntensity={2} floatIntensity={10} speed={2}>
          <Turtle position={[0, -0.5, -1]} rotation={[0, Math.PI, 0]} scale={23} />
        </Float>
        <Instances renderOrder={-1000}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial depthTest={false} />
          {spheres.map(([scale, color, speed, position], index) => (
            <Sphere key={index} scale={scale} color={color} speed={speed} position={position} />
          ))}
        </Instances>
      </Aquarium>
      {/** Soft shadows */}
      <AccumulativeShadows temporal frames={100} color="lightblue" colorBlend={2} opacity={0.7} scale={60} position={[0, -5, 0]}>
        <RandomizedLight amount={8} radius={15} ambient={0.5} intensity={1} position={[-5, 10, -5]} size={20} />
      </AccumulativeShadows>
      {/** Custom environment map */}
      <Environment resolution={1024}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
            <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
          ))}
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
        </group>
      </Environment>
      <CameraControls truckSpeed={0} dollySpeed={0} minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  )
}

function Aquarium({ children, ...props }) {
  const ref = useRef()
  const { nodes } = useGLTF('/shapes-transformed.glb')
  const stencil = useMask(1, false)
  useLayoutEffect(() => {
    // Apply stencil to all contents
    ref.current.traverse((child) => child.material && Object.assign(child.material, { ...stencil }))
  }, [])
  return (
    <group {...props} dispose={null}>
      <mesh castShadow scale={[0.61 * 6, 0.8 * 6, 1 * 6]} geometry={nodes.Cube.geometry}>
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={3}
          chromaticAberration={0.025}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.2}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
        />
      </mesh>
      <group ref={ref}>{children}</group>
    </group>
  )
}

function Sphere({ position, scale = 1, speed = 0.1, color = 'white' }) {
  return (
    <Float rotationIntensity={40} floatIntensity={20} speed={speed / 2}>
      <Instance position={position} scale={scale} color={color} />
    </Float>
  )
}

/*
Author: DigitalLife3D (https://sketchfab.com/DigitalLife3D)
License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
Source: https://sketchfab.com/3d-models/model-52a-kemps-ridley-sea-turtle-no-id-7aba937dfbce480fb3aca47be3a9740b
Title: Model 52A - Kemps Ridley Sea Turtle (no ID)
*/
function Turtle(props) {
  const { scene, animations } = useGLTF('/model_52a_-_kemps_ridley_sea_turtle_no_id-transformed.glb')
  const { actions, mixer } = useAnimations(animations, scene)
  useEffect(() => {
    mixer.timeScale = 0.5
    actions['Swim Cycle'].play()
  }, [])
  useFrame((state) => (scene.rotation.z = Math.sin(state.clock.elapsedTime / 4) / 2))
  return <primitive object={scene} {...props} />
}


INDEX

import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { Logo } from '@pmndrs/branding'

function Overlay() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <Logo style={{ position: 'absolute', bottom: 40, left: 40, width: 30 }} />
      <a href="https://pmnd.rs/" style={{ position: 'absolute', bottom: 40, left: 90, fontSize: '13px' }}>
        pmnd.rs
        <br />
        dev collective
      </a>
      <div style={{ position: 'absolute', top: 40, left: 40 }}>ok —</div>
      <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: '13px' }}>29/01/2023</div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <>
    <App
      spheres={[
        [1, 'orange', 0.05, [-4, -1, -1]],
        [0.75, 'hotpink', 0.1, [-4, 2, -2]],
        [1.25, 'aquamarine', 0.2, [4, -3, 2]],
        [1.5, 'lightblue', 0.3, [-4, -2, -3]],
        [2, 'pink', 0.3, [-4, 2, -4]],
        [2, 'skyblue', 0.3, [-4, 2, -4]],
        [1.5, 'orange', 0.05, [-4, -1, -1]],
        [2, 'hotpink', 0.1, [-4, 2, -2]],
        [1.5, 'aquamarine', 0.2, [4, -3, 2]],
        [1.25, 'lightblue', 0.3, [-4, -2, -3]],
        [1, 'pink', 0.3, [-4, 2, -4]],
        [1, 'skyblue', 0.3, [-4, 2, -4]]
      ]}
    />
    <Overlay />
  </>
)


Styles

@import url('https://rsms.me/inter/inter.css');

* {
  box-sizing: border-box;
}

html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background: #c6e5db;
  font-family: 'Inter';
}

a {
  color: black;
}

a {
  pointer-events: all;
  color: black;
  text-decoration: none;
}

svg {
  fill: black;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

canvas {
  opacity: 0;
  touch-action: none;
  animation: fade-in 5s ease 1s forwards;
}

Index html

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="theme-color" content="#000000">
	<!--
      manifest.json provides metadata used when your web app is added to the
      homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
    -->
	<link rel="manifest" href="%PUBLIC_URL%/manifest.json">
	<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
	<!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
	<title>React App</title>
</head>

<body>
	<noscript>
		You need to enable JavaScript to run this app.
	</noscript>
	<div id="root"></div>
	<!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
</body>

</html>