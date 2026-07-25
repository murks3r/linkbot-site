import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { subProgress, ease } from './timeline';

export interface ThreeExperienceProps {
  progressRef: React.MutableRefObject<number>;
}

export default function ThreeExperience({ progressRef }: ThreeExperienceProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true }}
      camera={{ position: [0, 0, 6.5], fov: 38, near: 0.1, far: 60 }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
    >
      <Scene progressRef={progressRef} />
    </Canvas>
  );
}

function Scene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const personaGroup = useRef<THREE.Group>(null);
  const ringGroup = useRef<THREE.Group>(null);
  const nodeGroup = useRef<THREE.InstancedMesh>(null);
  const matchedLines = useRef<THREE.Group>(null);
  const smoothed = useRef(0);
  const isVisible = useRef(true);
  const lastRenderedT = useRef(-1);

  useEffect(() => {
    const onVisibility = () => { isVisible.current = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useFrame((state, delta) => {
    if (!isVisible.current) return;
    const target = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    const k = 1 - Math.pow(0.001, delta);
    smoothed.current = THREE.MathUtils.lerp(smoothed.current, target, k);
    const t = smoothed.current;
    if (Math.abs(t - lastRenderedT.current) < 0.0008) return;
    lastRenderedT.current = t;

    const exposed = subProgress(t, 0, 0.25);
    const horror = subProgress(t, 0.25, 0.55, ease.inOut);
    const lockdown = subProgress(t, 0.55, 0.8, ease.inOut);
    const matched = subProgress(t, 0.8, 1, ease.out);

    const rotY = exposed * 0.4 + horror * 1.2 - lockdown * 0.6 + matched * 0.1;
    const rotX = Math.sin(t * Math.PI * 2) * 0.05 - lockdown * 0.05;
    if (group.current) { group.current.rotation.y = rotY; group.current.rotation.x = rotX; }

    if (personaGroup.current) {
      personaGroup.current.scale.setScalar(1 - 0.55 * lockdown);
      personaGroup.current.position.y = -lockdown * 0.2;
    }

    if (ringGroup.current) {
      ringGroup.current.children.forEach((ring, i) => {
        const mesh = ring as THREE.Mesh;
        const base = 1.4 + i * 0.55;
        const targetR = base * (1 - 0.85 * lockdown) + horror * 0.15;
        mesh.scale.set(targetR, targetR, targetR);
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (mat) {
          const color = new THREE.Color();
          if (t < 0.25) color.setHex(0x8a8d99);
          else if (t < 0.55) color.setHex(0xc44b4b);
          else if (t < 0.8) color.setHex(0x4a4f5a);
          else color.setHex(0x3fc487);
          mat.color.copy(color);
          mat.opacity = 0.85 * (1 - lockdown * 0.6) + matched * 0.4;
        }
      });
    }

    if (nodeGroup.current) {
      const dummy = new THREE.Object3D();
      const count = nodeGroup.current.count;
      const mat = nodeGroup.current.material as THREE.MeshBasicMaterial;
      const color = new THREE.Color();
      if (t < 0.25) color.setHex(0x9aa0ad);
      else if (t < 0.55) color.setHex(0xe07b7b);
      else if (t < 0.8) color.setHex(0x4a4f5a);
      else color.setHex(0x3fc487);
      mat.color.copy(color);
      mat.opacity = 0.9 - lockdown * 0.85;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + state.clock.elapsedTime * 0.05;
        const layer = (i % 5) + 1;
        const baseR = 1.8 + layer * 0.35;
        const r = baseR * (1 + horror * 0.5 - lockdown * 0.9);
        const y = Math.sin(a * 3 + i) * 0.6 * (1 - lockdown * 0.95);
        dummy.position.set(Math.cos(a) * r, y, Math.sin(a) * r * 0.6);
        const s = 0.04 + (i % 3) * 0.015 + horror * 0.03 - lockdown * 0.02;
        dummy.scale.setScalar(Math.max(0.005, s));
        dummy.updateMatrix();
        nodeGroup.current.setMatrixAt(i, dummy.matrix);
      }
      nodeGroup.current.instanceMatrix.needsUpdate = true;
    }

    if (matchedLines.current) {
      const stretch = matched;
      matchedLines.current.children.forEach((line, i) => {
        const grp = line as THREE.Group;
        grp.children.forEach((child) => {
          const lineMesh = child as THREE.LineSegments;
          const mat = lineMesh.material as THREE.LineBasicMaterial;
          mat.opacity = stretch;
          mat.transparent = true;
          const positions = lineMesh.geometry.attributes.position as THREE.BufferAttribute;
          const arr = positions.array as Float32Array;
          const dir = (i / matchedLines.current!.children.length) * Math.PI * 2;
          const inner = 0.65 + stretch * 0.4;
          const outer = 1.6 + stretch * 1.6;
          arr[0] = Math.cos(dir) * inner; arr[1] = 0; arr[2] = Math.sin(dir) * inner;
          arr[3] = Math.cos(dir) * outer; arr[4] = stretch * 0.2; arr[5] = Math.sin(dir) * outer;
          arr[6] = Math.cos(dir) * inner; arr[7] = 0; arr[8] = Math.sin(dir) * inner;
          arr[9] = Math.cos(dir) * outer * 0.95; arr[10] = -stretch * 0.2; arr[11] = Math.sin(dir) * outer * 0.95;
          positions.needsUpdate = true;
        });
      });
    }
  });

  const matchedLineData = useMemo(() => {
    const lineCount = 6;
    const lines: { positions: Float32Array }[] = [];
    for (let i = 0; i < lineCount; i++) {
      lines.push({ positions: new Float32Array([0,0,0,0,0,0,0,0,0,0,0,0]) });
    }
    return lines;
  }, []);

  return (
    <group ref={group}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={0.5} />
      <group ref={personaGroup}>
        <mesh>
          <boxGeometry args={[1.6, 2.2, 0.06, 6, 8, 1]} />
          <meshBasicMaterial color={'#c8c5b8'} wireframe transparent opacity={0.55} />
        </mesh>
        <mesh>
          <boxGeometry args={[1.4, 2.0, 0.08]} />
          <meshBasicMaterial color={'#0a0c12'} transparent opacity={0.55} />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => <Layer key={i} index={i} progressRef={progressRef} />)}
      </group>
      <group ref={ringGroup}>
        {[1.4, 1.95, 2.5].map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r - 0.015, r, 96]} />
            <meshBasicMaterial color={'#8a8d99'} transparent opacity={0.7} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      <instancedMesh ref={nodeGroup} args={[undefined, undefined, 80]} frustumCulled={false}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color={'#9aa0ad'} transparent opacity={0.9} />
      </instancedMesh>
      <group ref={matchedLines}>
        {matchedLineData.map((line, i) => (
          <group key={i} rotation={[0, (i / matchedLineData.length) * Math.PI * 2, 0]}>
            <lineSegments>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[line.positions, 3]} />
              </bufferGeometry>
              <lineBasicMaterial color={'#3fc487'} transparent opacity={0} />
            </lineSegments>
          </group>
        ))}
      </group>
    </group>
  );
}

function Layer({ index, progressRef }: { index: number; progressRef: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const baseZ = 0.04 + index * 0.05;
  useFrame(() => {
    if (!ref.current) return;
    const t = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    const horror = subProgress(t, 0.25, 0.55, ease.inOut);
    const lockdown = subProgress(t, 0.55, 0.8, ease.inOut);
    const offset = (index - 2.5) * 0.18;
    ref.current.position.z = baseZ + offset + horror * 0.9 - lockdown * 0.7;
    ref.current.position.x = Math.sin(index + t * 3) * 0.05 * (1 - lockdown);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    if (mat) {
      mat.opacity = 0.55 + horror * 0.4 - lockdown * 0.95;
      const color = new THREE.Color();
      if (t < 0.55) color.setHex(0xc8c5b8);
      else if (t < 0.8) color.setHex(0x4a4f5a);
      else color.setHex(0x3fc487);
      mat.color.copy(color);
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, baseZ]}>
      <planeGeometry args={[1.45, 0.28]} />
      <meshBasicMaterial color={'#c8c5b8'} transparent opacity={0.55} side={THREE.DoubleSide} />
    </mesh>
  );
}
