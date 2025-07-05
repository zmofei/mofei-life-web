'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, } from "motion/react"
import Lan from "@/components/util/Language";
import Script from 'next/script';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mapboxgl: any
    }
}

function HomeMap({ lang, callback }: { lang: string, callback: (userInteracting: boolean) => void }) {
    const mapContainer = useRef(null);
    const [userInteracting, setUserInteracting] = useState(false);
    const [mapboxReady, setMapboxReady] = useState(false);
    useEffect(() => {
        // if (!mapContainer.current) return;
        if (!mapContainer.current || !mapboxReady) return;
        const mapboxgl = window.mapboxgl;
        mapboxgl.accessToken = 'pk.eyJ1IjoibW9mZWkiLCJhIjoiY2w1Z3Z6OWw1MDNlaDNjcXpqMjZsMG5oZCJ9.nqfToaqgxmm3jbJzu6bK6Q';
        const map = new mapboxgl.Map({
            container: mapContainer.current as HTMLElement,
            zoom: 3.5,
            maxZoom: 6,
            center: [121, 31],
            pitch: 45,
            style: 'mapbox://styles/mofei/cm41b6m6r006c01s6clcm4etw',
            projection: 'globe', // Display the map as a globe
        });

        const spinEnabled = true;
        let userInteracting = false;

        function spinGlobe() {
            const zoom = map.getZoom();

            const secondsPerRevolution = 200;
            // Above zoom level 5, do not rotate.
            const maxSpinZoom = 5;
            // Rotate at intermediate speeds between zoom levels 3 and 5.
            const slowSpinZoom = 3;


            if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
                let distancePerSecond = 360 / secondsPerRevolution;
                if (zoom > slowSpinZoom) {
                    // Slow spinning at higher zooms
                    const zoomDif =
                        (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
                    distancePerSecond *= zoomDif;
                }
                const center = map.getCenter();
                center.lng -= distancePerSecond;
                // Smoothly animate the map over one second.
                // When this animation is complete, it calls a 'moveend' event.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                map.easeTo({ center, duration: 1000, easing: (n: any) => n });
            }
        }

        spinGlobe()

        // Pause spinning on interaction
        map.on('mousedown', () => {
            userInteracting = true;
        });

        // Restart spinning the globe when interaction is complete
        map.on('mouseup', () => {
            userInteracting = false;
            spinGlobe();
        });

        // These events account for cases where the mouse has moved
        // off the map, so 'mouseup' will not be fired.
        map.on('dragend', () => {
            userInteracting = false;
            spinGlobe();
        });

        map.on('pitchend', () => {
            userInteracting = false;
            spinGlobe();
        });
        map.on('rotateend', () => {
            userInteracting = false;
            spinGlobe();
        });

        map.on('touchstart', () => {
            userInteracting = true;
        });

        map.on('touchend', () => {
            userInteracting = false;
            spinGlobe();
        });


        map.on('moveend', () => {
            spinGlobe();
        });

        return () => {
            map.remove();
        }
    }, [mapContainer, mapboxReady]);

    return (
        <>
            <Script
                src="https://api.mapbox.com/mapbox-gl-js/v3.10.0/mapbox-gl.js"
                strategy="afterInteractive"
                onLoad={() => {
                    console.log('✅ Mapbox script loaded.')
                    setMapboxReady(true)
                }}
                onError={() => {
                    console.error('❌ Mapbox failed to load.')
                }}
            />
            <div className='absolute top-0 left-0 w-full h-full' ref={mapContainer}></div>
            <div className="absolute top-0 left-0 w-full h-full flex items-end justify-center text-center z-20 pointer-events-none">
                <motion.div
                    layout
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setUserInteracting(!userInteracting)
                        if (callback) {
                            callback(userInteracting);
                        }
                    }}
                    className={`cursor-pointer pointer-events-auto rounded-2xl backdrop-blur-md transition-all duration-500 ease-out
                        ${userInteracting 
                            ? 'mb-4 px-3 py-2 bg-black/20 border border-white/10 md:mb-6 md:px-4 md:py-3' 
                            : 'mb-8 px-4 py-3 bg-black/40 border border-white/20 shadow-2xl md:mb-16 md:px-8 md:py-6'
                        }
                    `}
                >
                    <motion.div 
                        className='flex flex-col items-center gap-2 md:gap-3'
                        animate={{ 
                            scale: userInteracting ? 0.9 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            animate={{ 
                                rotate: userInteracting ? 180 : 0,
                                scale: userInteracting ? 0.8 : 1 
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className={`p-1.5 md:p-2 rounded-full transition-colors duration-300 ${
                                userInteracting ? 'bg-red-500/20' : 'bg-blue-500/20'
                            }`}
                        >
                            {userInteracting ? (
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            )}
                        </motion.div>
                        
                        <motion.div 
                            className="text-center"
                            animate={{ opacity: userInteracting ? 0.8 : 1 }}
                        >
                            <motion.p className='text-xs md:text-sm font-medium leading-tight'>
                                {userInteracting ? (
                                    <Lan lang={lang} candidate={{
                                        "zh": "退出环游",
                                        "en": "Exit Travel"
                                    }} />
                                ) : (
                                    <Lan lang={lang} candidate={{
                                        "zh": "🗺️ 环游世界",
                                        "en": "🗺️ Travel the World"
                                    }} />
                                )}
                            </motion.p>
                            
                            {!userInteracting && (
                                <motion.p 
                                    className='text-xs opacity-80 mt-1'
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 0.8, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Lan lang={lang} candidate={{
                                        "zh": "我到过的地方",
                                        "en": "Places I've Been"
                                    }} />
                                </motion.p>
                            )}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
            
            {/* Interactive overlay hint */}
            {userInteracting && (
                <motion.div 
                    className="absolute top-4 right-4 z-30 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                >
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-white/80">
                        <Lan lang={lang} candidate={{
                            "zh": "🌍 拖拽探索世界",
                            "en": "🌍 Drag to Explore"
                        }} />
                    </div>
                </motion.div>
            )}
            
            {/* Custom styles for map interactions */}
            <style jsx global>{`
                /* Subtle mapbox attribution styling */
                .mapboxgl-ctrl-attrib {
                    opacity: 0.7;
                    transition: opacity 0.3s ease;
                }
                
                .mapboxgl-ctrl-attrib:hover {
                    opacity: 1;
                }
            `}</style>
        </>
    );
}

export default HomeMap;