'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

type Direction = 1 | -1;

interface StepTransitionProps {
  stepKey: string;
  direction: Direction;
  children: React.ReactNode;
}

export function StepTransition({
  stepKey,
  direction,
  children,
}: StepTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLDivElement>(null);
  const outgoingRef = useRef<HTMLDivElement>(null);

  const [renderState, setRenderState] = useState<{
    outgoing: { key: string; node: React.ReactNode } | null;
    current: { key: string; node: React.ReactNode };
  }>({ outgoing: null, current: { key: stepKey, node: children } });

  useEffect(() => {
    if (stepKey === renderState.current.key) {
      // same step, content updated in place (e.g. form values changed) — no transition
      setRenderState((s) => ({
        ...s,
        current: { key: stepKey, node: children },
      }));
      return;
    }
    // real step change — kick off transition, keep old step mounted briefly
    setRenderState((s) => ({
      outgoing: s.current,
      current: { key: stepKey, node: children },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey]);

  useEffect(() => {
    if (
      !renderState.outgoing ||
      !containerRef.current ||
      !currentRef.current ||
      !outgoingRef.current
    )
      return;

    const container = containerRef.current;
    const outgoingEl = outgoingRef.current;
    const currentEl = currentRef.current;

    const oldHeight = outgoingEl.offsetHeight;
    const newHeight = currentEl.offsetHeight;

    gsap.set(container, {
      height: oldHeight,
      overflow: 'hidden',
      position: 'relative',
    });
    gsap.set(outgoingEl, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
    });
    gsap.set(currentEl, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      xPercent: direction * 100,
      opacity: 0,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(currentEl, {
          clearProps: 'position,top,left,width,xPercent,opacity',
        });
        gsap.set(container, { clearProps: 'height,overflow,position' });
        setRenderState((s) => ({ outgoing: null, current: s.current }));
      },
    });

    tl.to(
      container,
      { height: newHeight, duration: 0.45, ease: 'power3.inOut' },
      0,
    )
      .to(
        outgoingEl,
        {
          xPercent: -direction * 100,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.inOut',
        },
        0,
      )
      .to(
        currentEl,
        { xPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
        0.05,
      );
  }, [renderState.outgoing, direction]);

  return (
    <div
      ref={containerRef}
      className='relative min-h-[240px] sm:min-h-[280px] lg:min-h-[320px]'
    >
      {renderState.outgoing && (
        <div ref={outgoingRef} key={renderState.outgoing.key}>
          {renderState.outgoing.node}
        </div>
      )}
      <div ref={currentRef} key={renderState.current.key}>
        {renderState.current.node}
      </div>
    </div>
  );
}
