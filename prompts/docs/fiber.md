Basic Animations - React Three Fiber
React Three Fiber
.docs

Quick search for anything
Press/to search
getting started
api
advanced
tutorials
v8 Migration Guide
Events and Interaction
Loading Models
Loading Textures
Basic Animations
Using with React Spring
Using with TypeScript
Testing
How does it work?
Basic Animations
This guide will help you understand refs, useFrame and how to make basic animations with Fiber

This tutorial will assume some React knowledge, and will be based on this starter codesandbox, so just fork it and follow along!

We will build a really small, continuous animation loop, that will be the basic building block of more advanced animations later on.

useFrame
useFrame is a Fiber hook that lets you execute code on every frame of Fiber's render loop. This can have a lot of uses, but we will focus on building an animation with it.

It's important to remember that Fiber hooks can only be called inside a <Canvas /> parent!

import { useFrame } from '@react-three/fiber'

function MyAnimatedBox() {
  useFrame(() => {
    console.log("Hey, I'm executing every frame!")
  })
  return (
    <mesh>
      <boxGeometry />
      <meshBasicMaterial color="royalblue" />
    </mesh>
  )
}

This loop is the basic building block of our animation, the callback we pass to useFrame will be executed every frame and it will be passed an object containing the state of our Fiber scene:

For example, we can extract time information from the clock parameter, to know how much time has elapsed in our application, and use that time to animate a value:

useFrame(({ clock }) => {
  const a = clock.getElapsedTime()
  console.log(a) // the value will be 0 at scene initialization and grow each frame
})

clock is a three.js Clock object, from which we are getting the total elapsed time, which will be key for our animations.

Animating with Refs
It would be tempting to just update the state of our component via setState and let it change the mesh via props, but going through state isn't ideal, when dealing with continuous updates, commonly know as transient updates. Instead, we want to directly mutate our mesh each frame. First, we'll have to get a reference to it, via the useRef React hook:

import React from 'react'

function MyAnimatedBox() {
  const myMesh = React.useRef()
  return (
    <mesh ref={myMesh}>
      <boxGeometry />
      <meshBasicMaterial color="royalblue" />
    </mesh>
  )
}

myMesh will now hold a reference to the actual three.js object, which we can now freely mutate in useFrame, without having to worry about React:

useFrame(({ clock }) => {
  myMesh.current.rotation.x = clock.getElapsedTime()
})

Let's have a closer look:

We are destructuring clock from the argument passed to useFrame, which we know is the state of our Fiber scene.
We are accessing the rotation.x property of myMesh.current object, which is a reference to our mesh object
We are assigning our time-dependent value a to the rotation on the x axis, meaning our object will now infinitely rotate between -1 and 1 radians around the x axis!
getting-started-01 (forked)
getting-started-01 (forked)
Exercises

Try Math.sin(clock.getElapsedTime()) and see how your animation changes
Next steps
Now that you understand the basic technique for animating in Fiber, learn how event works!

If you want to go deeper into animations, check these out:

Animating with React Spring
Edit this page
Previous
Loading Textures
Next
Using with React Spring
On This Page
useFrame
Animating with Refs
Next steps

Loading Textures - React Three Fiber
React Three Fiber
.docs

Quick search for anything
Press/to search
getting started
api
advanced
tutorials
v8 Migration Guide
Events and Interaction
Loading Models
Loading Textures
Basic Animations
Using with React Spring
Using with TypeScript
Testing
How does it work?
Loading Textures
Let's load some fancy textures.

All textures used in this chapter were downloaded from cc0textures.

Using TextureLoader & useLoader
To load the textures we will use the TextureLoader from three.js in combination with useLoader that will allow us to pass the location of the texture and get the map back.

It's better to explain with code, let's say you downloaded this texture and placed it in the public folder of your site, to get the color map from it you could do:

const colorMap = useLoader(TextureLoader, 'PavingStones092_1K_Color.jpg')

Let's then with this information create a small scene where we can use this texture:

import { Suspense } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

function Scene() {
  const colorMap = useLoader(TextureLoader, 'PavingStones092_1K_Color.jpg')
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial />
      </mesh>
    </>
  )
}

export default function App() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}

If everything went according to plan, you should now be able to apply this texture to the sphere like so:

<meshStandardMaterial map={colorMap} />

Awesome! That works but we have a lot more textures to import and do we have to create a different useLoader for each of them?

That's the great part! You don't, the second argument is an array where you can pass all the textures you have and the maps will be returned and ready to use:

const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
  'PavingStones092_1K_Color.jpg',
  'PavingStones092_1K_Displacement.jpg',
  'PavingStones092_1K_Normal.jpg',
  'PavingStones092_1K_Roughness.jpg',
  'PavingStones092_1K_AmbientOcclusion.jpg',
])

Now we can place them in our mesh like so:

<meshStandardMaterial
  map={colorMap}
  displacementMap={displacementMap}
  normalMap={normalMap}
  roughnessMap={roughnessMap}
  aoMap={aoMap}
/>

The displacement will probably be too much, usually setting it to 0.2 will make it look good. Our final code would look something like:

function Scene() {
  const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
    'PavingStones092_1K_Color.jpg',
    'PavingStones092_1K_Displacement.jpg',
    'PavingStones092_1K_Normal.jpg',
    'PavingStones092_1K_Roughness.jpg',
    'PavingStones092_1K_AmbientOcclusion.jpg',
  ])
  return (
    <mesh>
      {/* Width and height segments for displacementMap */}
      <sphereGeometry args={[1, 100, 100]} />
      <meshStandardMaterial
        displacementScale={0.2}
        map={colorMap}
        displacementMap={displacementMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
      />
    </mesh>
  )
}

Using useTexture
Another way to import these is using useTexture from @react-three/drei, that will make it slightly easier and there is no need to import the TextureLoader, our code would look like:

import { useTexture } from "@react-three/drei"

...

const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useTexture([
  'PavingStones092_1K_Color.jpg',
  'PavingStones092_1K_Displacement.jpg',
  'PavingStones092_1K_Normal.jpg',
  'PavingStones092_1K_Roughness.jpg',
  'PavingStones092_1K_AmbientOcclusion.jpg',
])

You can also use object-notation which is the most convenient:

const props = useTexture({
  map: 'PavingStones092_1K_Color.jpg',
  displacementMap: 'PavingStones092_1K_Displacement.jpg',
  normalMap: 'PavingStones092_1K_Normal.jpg',
  roughnessMap: 'PavingStones092_1K_Roughness.jpg',
  aoMap: 'PavingStones092_1K_AmbientOcclusion.jpg',
})

return (
  <mesh>
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial {...props} />
  </mesh>
)

You can play with the sandbox and see how it looks:

TextureLoader
TextureLoader
Edit this page
Previous
Loading Models
Next
Basic Animations
On This Page
Using TextureLoader & useLoader
Using useTexture

Loading Models - React Three Fiber
React Three Fiber
.docs

Quick search for anything
Press/to search
getting started
api
advanced
tutorials
v8 Migration Guide
Events and Interaction
Loading Models
Loading Textures
Basic Animations
Using with React Spring
Using with TypeScript
Testing
How does it work?
Loading Models
3D Software to the web!

All the models in this page were created by Sara Vieira and are freely available to download from any of the sandboxes.

There are many types of 3D model extensions, in this page we will focus on loading the three most common ones: GLTF, FBX and OBJ. All of these will use the useLoader function but in slightly different ways.

This whole section will assume you have placed your models in the public folder or in a place in your application where you can import them easily.

Loading GLTF models
Starting with the open standard and the one that has more support in React Three Fiber we will load a .gltf model.

Let's start by importing the two things we need:

import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

With this we can create a Model component and place it in our scene like so:

function Scene() {
  const gltf = useLoader(GLTFLoader, '/Poimandres.gltf')
  return <primitive object={gltf.scene} />
}

You can play with the sandbox and see how it looks here after I added an HDRI background:

GLTFLoader
GLTFLoader
Loading GLTF models as JSX Components
Here comes the really fancy part, you can transform these models into React components and then use them as you would any React component.

To do this, grab your GLTF model and head over to https://gltf.pmnd.rs/ and drop your GLTF, after that you should see something like:

gltfjsx

Let's now copy the code and move it over to Model.js:

/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const groupRef = useRef()
  const { nodes, materials } = useGLTF('/Poimandres.gltf')
  return (
    <group ref={groupRef} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Curve007_1.geometry} material={materials['Material.001']} />
      <mesh castShadow receiveShadow geometry={nodes.Curve007_2.geometry} material={materials['Material.002']} />
    </group>
  )
}

useGLTF.preload('/Poimandres.gltf')

Now we can import our model like we would import any React component and use it in our app:

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'

import Model from './Model'

export default function App() {
  return (
    <div className="App">
      <Canvas>
        <Suspense fallback={null}>
          <Model />
          <Environment preset="sunset" background />
        </Suspense>
      </Canvas>
    </div>
  )
}

You can play with the sandbox here:

gltfjsx
gltfjsx
Loading OBJ models
In this case, we will use the trusted useLoader hook but in combination with three.js OBJLoader.

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'

With these imported let's get the mesh into our scene:

function Scene() {
  const obj = useLoader(OBJLoader, '/Poimandres.obj')
  return <primitive object={obj} />
}

And here we go, we have an OBJ model showing on the web! Pretty cool ah?

You can play with the sandbox here:

OBJLoader
OBJLoader
Loading FBX models
Let's again use the trusted useLoader but this time with the FBXLoader that comes from three.js

import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

To create our scene we can get the FBX as a return value of the useLoader by passing the FBXloader and the location of our file like so:

function Scene() {
  const fbx = useLoader(FBXLoader, '/Poimandres.fbx')
  return <primitive object={fbx} />
}

You can play with the sandbox here:

FBXLoader
FBXLoader
Loading FBX models using useFBX
@react-three/drei exports a very useful helper when it comes to loading FBX models and it's called useFBX, in this case there is no need to import anything from three.js as it is all done behind the scenes and we can just pass the location of the file to useFBX like so:

function Scene() {
  const fbx = useFBX('/Poimandres.fbx')
  return <primitive object={fbx} />
}

You can play with the sandbox here:

useFBX
useFBX
Showing a loader
If your model is big and takes a while to load, it's always good to show a small loader of how much is already is loaded and again @react-three/drei is here to help with Html and useProgress.

Html allows you place plain ol' HTML in your canvas and render it like you would a normal DOM element.
useProgress is a hook that gives you a bunch of information about the loading status of your model.
With these two things, we can create a very bare-bones loading component like so:

import { Html, useProgress } from '@react-three/drei'

function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

We can then wrap our model in it using Suspense like so:

export default function App() {
  return (
    <Canvas>
      <Suspense fallback={<Loader />}>
        <Model />
      </Suspense>
    </Canvas>
  )
}

The hook returns much more than just the progress so there is a lot you can do there to give the user more information about the loading status of the application. You can play with all of them in this sandbox:

GLTFLoader - Loading
GLTFLoader - Loading
Edit this page
Previous
Events and Interaction
Next
Loading Textures
On This Page
Loading GLTF models
Loading GLTF models as JSX Components
Loading OBJ models
Loading FBX models
Loading FBX models using useFBX
Showing a loader

Canvas - React Three Fiber
React Three Fiber
.docs

Quick search for anything
Press/to search
getting started
api
Canvas
Objects, properties and constructor arguments
Hooks
Events
Additional Exports
advanced
tutorials
Canvas
The Canvas object is your portal into three.js.

The Canvas object is where you start to define your React Three Fiber Scene.

import React from 'react'
import { Canvas } from '@react-three/fiber'

const App = () => (
  <Canvas>
    <pointLight position={[10, 10, 10]} />
    <mesh>
      <sphereGeometry />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  </Canvas>
)

Properties
Prop	Description	Default
children	three.js JSX elements or regular components	
fallback	optional DOM JSX elements or regular components in case GL is not supported	
gl	Props that go into the default renderer, or your own renderer. Also accepts a synchronous callback like gl={canvas => new Renderer({ canvas })}	{}
camera	Props that go into the default camera, or your own THREE.Camera	{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 5] }
scene	Props that go into the default scene, or your own THREE.Scene	{}
shadows	Props that go into gl.shadowMap, can be set true for PCFsoft or one of the following: 'basic', 'percentage', 'soft', 'variance'	false
raycaster	Props that go into the default raycaster	{}
frameloop	Render mode: always, demand, never	always
resize	Resize config, see react-use-measure's options	{ scroll: true, debounce: { scroll: 50, resize: 0 } }
orthographic	Creates an orthographic camera	false
dpr	Pixel-ratio, use window.devicePixelRatio, or automatic: [min, max]	[1, 2]
legacy	Enables THREE.ColorManagement in three r139 or later	false
linear	Switch off automatic sRGB color space and gamma correction	false
events	Configuration for the event manager, as a function of state	import { events } from "@react-three/fiber"
eventSource	The source where events are being subscribed to, HTMLElement	React.MutableRefObject<HTMLElement>, gl.domElement.parentNode
eventPrefix	The event prefix that is cast into canvas pointer x/y events	offset
flat	Use THREE.NoToneMapping instead of THREE.ACESFilmicToneMapping	false
onCreated	Callback after the canvas has rendered (but not yet committed)	(state) => {}
onPointerMissed	Response for pointer clicks that have missed any target	(event) => {}
Defaults
Canvas uses createRoot which will create a translucent THREE.WebGLRenderer with the following constructor args:

antialias=true
alpha=true
powerPreference="high-performance"
and with the following properties:

outputColorSpace = THREE.SRGBColorSpace
toneMapping = THREE.ACESFilmicToneMapping
It will also create the following scene internals:

A THREE.Perspective camera
A THREE.Orthographic cam if orthographic is true
A THREE.PCFSoftShadowMap if shadows is true
A THREE.Scene (into which all the JSX is rendered) and a THREE.Raycaster
In recent versions of threejs, THREE.ColorManagement.enabled will be set to true to enable automatic conversion of colors according to the renderer's configured color space. R3F will handle texture color space conversion. For more on this topic, see https://threejs.org/docs/#manual/en/introduction/Color-management.

Errors and fallbacks
On some systems WebGL may not be supported, you can provide a fallback component that will be rendered instead of the canvas:

<Canvas fallback={<div>Sorry no WebGL supported!</div>}>
  <mesh />
</Canvas>

You should also safeguard the canvas against WebGL context crashes, for instance if users have the GPU disabled or GPU drivers are faulty.

import { useErrorBoundary } from 'use-error-boundary'

function App() {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary()
  return didCatch ? (
    <div>{error.message}</div>
  ) : (
    <ErrorBoundary>
      <Canvas>
        <mesh />
      </Canvas>
    </ErrorBoundary>
  )
}

Note
Ideally, and if possible, your fallback is a seamless, visual replacement for what the canvas would have otherwise rendered.

Custom Canvas
R3F can render to a root, similar to how react-dom and all the other React renderers work. This allows you to shave off react-dom (~40kb), react-use-measure (~3kb) and, if you don't need them, pointer-events (~7kb) (you need to explicitly import events and add them to the config otherwise).

Roots have the same options and properties as Canvas, but you are responsible for resizing it. It requires an existing DOM <canvas> object into which it renders.

CreateRoot
Creates a root targeting a canvas, rendering JSX.

import * as THREE from 'three'
import { extend, createRoot, events } from '@react-three/fiber'

// Register the THREE namespace as native JSX elements.
// See below for notes on tree-shaking
extend(THREE)

// Create a react root
const root = createRoot(document.querySelector('canvas'))

// Configure the root, inject events optionally, set camera, etc
root.configure({ events, camera: { position: [0, 0, 50] } })

// createRoot by design is not responsive, you have to take care of resize yourself
window.addEventListener('resize', () => {
  root.configure({ size: { width: window.innerWidth, height: window.innerHeight } })
})

// Trigger resize
window.dispatchEvent(new Event('resize'))

// Render entry point
root.render(<App />)

// Unmount and dispose of memory
// root.unmount()

Tree-shaking
New with v8, the underlying reconciler no longer pulls in the THREE namespace automatically.

This enables a granular catalogue which also enables tree-shaking via the extend API:

import { extend, createRoot } from '@react-three/fiber'
import { Mesh, BoxGeometry, MeshStandardMaterial } from 'three'

extend({ Mesh, BoxGeometry, MeshStandardMaterial })

createRoot(canvas).render(
  <>
    <mesh>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  </>,
)

There's an official babel plugin which will do this for you automatically:

// In:

import { createRoot } from '@react-three/fiber'

createRoot(canvasNode).render(
  <mesh>
    <boxGeometry />
    <meshStandardMaterial />
  </mesh>,
)

// Out:

import { createRoot, extend } from '@react-three/fiber'
import { Mesh as _Mesh, BoxGeometry as _BoxGeometry, MeshStandardMaterial as _MeshStandardMaterial } from 'three'

extend({
  Mesh: _Mesh,
  BoxGeometry: _BoxGeometry,
  MeshStandardMaterial: _MeshStandardMaterial,
})

createRoot(canvasNode).render(
  <mesh>
    <boxGeometry />
    <meshStandardMaterial />
  </mesh>,
)

Edit this page
Previous
Examples
Next
Objects, properties and constructor arguments
On This Page
Properties
Defaults
Errors and fallbacks
Custom Canvas
CreateRoot
Tree-shaking