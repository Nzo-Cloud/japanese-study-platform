'use client';

import { useFrame } from '@react-three/fiber';
import { MotionValue } from 'framer-motion';
import { useRef } from 'react';
import * as THREE from 'three';

interface Props {
  progress: MotionValue<number>;
}

const CAMERA_KEYFRAMES = [
  // Chapter 1 start: far from gate (scroll 0.0)
  { position: [0, 1, 20], target: [0, 2.5, 0], scroll: 0 },
  // Chapter 1 end: close to gate (scroll 0.20)
  { position: [0, 3, 4], target: [0, 3, 0], scroll: 0.20 },
  // Chapter 2: passing through (scroll 0.30)
  { position: [0, 4, 0], target: [0, 4, -5], scroll: 0.30 },
  // Chapter 3: forest path (scroll 0.45)
  { position: [0, 5, -15], target: [0, 5, -25], scroll: 0.45 },
  // Chapter 4: mountain viewpoint looking down at city (scroll 0.65)
  { position: [0, 30, -20], target: [0, 0, -40], scroll: 0.65 },
  // Chapter 5: facing Mount Fuji (scroll 1.0)
  { position: [0, 15, -30], target: [0, 10, -80], scroll: 1.0 },
];

export default function CameraRig({ progress }: Props) {
  const currentPos = useRef(new THREE.Vector3()).current;
  const currentTarget = useRef(new THREE.Vector3()).current;
  const smoothedLookAt = useRef(new THREE.Vector3(0, 3, 0)).current;

  // Persistent refs for lerp calculations to avoid GC thrashing
  const startP = useRef(new THREE.Vector3());
  const endP = useRef(new THREE.Vector3());
  const startT = useRef(new THREE.Vector3());
  const endT = useRef(new THREE.Vector3());

  useFrame((state) => {
    const p = progress.get();

    // Find the current segment
    let startIndex = 0;
    for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
      if (p >= CAMERA_KEYFRAMES[i].scroll) {
        startIndex = i;
      }
    }
    const endIndex = Math.min(startIndex + 1, CAMERA_KEYFRAMES.length - 1);

    if (startIndex === endIndex) {
      currentPos.set(...CAMERA_KEYFRAMES[startIndex].position as [number, number, number]);
      currentTarget.set(...CAMERA_KEYFRAMES[startIndex].target as [number, number, number]);
    } else {
      const start = CAMERA_KEYFRAMES[startIndex];
      const end = CAMERA_KEYFRAMES[endIndex];
      // Prevent division by zero
      const t = end.scroll - start.scroll > 0 ? (p - start.scroll) / (end.scroll - start.scroll) : 0;

      startP.current.set(...start.position as [number, number, number]);
      endP.current.set(...end.position as [number, number, number]);
      currentPos.lerpVectors(startP.current, endP.current, t);

      startT.current.set(...start.target as [number, number, number]);
      endT.current.set(...end.target as [number, number, number]);
      currentTarget.lerpVectors(startT.current, endT.current, t);
    }

    // Smooth movement heavily using a slow lerp tracking the target points
    state.camera.position.lerp(currentPos, 0.05);
    smoothedLookAt.lerp(currentTarget, 0.05);
    state.camera.lookAt(smoothedLookAt);
  });

  return null;
}
