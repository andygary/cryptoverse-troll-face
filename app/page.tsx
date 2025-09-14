'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [scroll, setScroll] = useState(0);
  const [showLoadAnimation, setShowLoadAnimation] = useState(true);
  const [dvdPosition, setDvdPosition] = useState({ x: 100, y: 100 });
  const [dvdVelocity, setDvdVelocity] = useState({ x: 5, y: 4 });
  const [dvdColor, setDvdColor] = useState('#34d399');
  const [hitCorner, setHitCorner] = useState(false);
  const [showTrollTransform, setShowTrollTransform] = useState(false);
  const [cornerDistance, setCornerDistance] = useState(1000);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // DVD Animation
    const animateDVD = () => {
      if (!showLoadAnimation) return;
      
      setDvdPosition(prev => {
        const newX = prev.x + dvdVelocity.x;
        const newY = prev.y + dvdVelocity.y;
        
        let newVelX = dvdVelocity.x;
        let newVelY = dvdVelocity.y;
      let actualCornerHit = false;
        
        // Check boundaries and bounce
        if (newX <= 0 || newX >= window.innerWidth - 120) {
          newVelX = -newVelX;
          // Change color on bounce
          const colors = ['#34d399', '#fbbf24', '#f87171', '#60a5fa', '#e879f9'];
          setDvdColor(colors[Math.floor(Math.random() * colors.length)]);
        }
        if (newY <= 0 || newY >= window.innerHeight - 80) {
          newVelY = -newVelY;
          // Change color on bounce
          const colors = ['#34d399', '#fbbf24', '#f87171', '#60a5fa', '#e879f9'];
          setDvdColor(colors[Math.floor(Math.random() * colors.length)]);
        }
        
      // Check if near corner (within 50px)
      const nearTopLeft = newX < 50 && newY < 50;
      const nearTopRight = newX > window.innerWidth - 150 && newY < 50;
      const nearBottomLeft = newX < 50 && newY > window.innerHeight - 150;
      const nearBottomRight = newX > window.innerWidth - 150 && newY > window.innerHeight - 150;
      const isNearCorner = nearTopLeft || nearTopRight || nearBottomLeft || nearBottomRight;

      // Calculate distance to nearest corner for troll intensity
      const distanceToTopLeft = Math.sqrt(newX * newX + newY * newY);
      const distanceToTopRight = Math.sqrt((window.innerWidth - newX) * (window.innerWidth - newX) + newY * newY);
      const distanceToBottomLeft = Math.sqrt(newX * newX + (window.innerHeight - newY) * (window.innerHeight - newY));
      const distanceToBottomRight = Math.sqrt((window.innerWidth - newX) * (window.innerWidth - newX) + (window.innerHeight - newY) * (window.innerHeight - newY));
      
      const minDistance = Math.min(distanceToTopLeft, distanceToTopRight, distanceToBottomLeft, distanceToBottomRight);
      setCornerDistance(minDistance);

      // Check for exact corner collision
      const hitTopLeft = newX <= 0 && newY <= 0;
      const hitTopRight = newX >= window.innerWidth - 100 && newY <= 0;
      const hitBottomLeft = newX <= 0 && newY >= window.innerHeight - 100;
      const hitBottomRight = newX >= window.innerWidth - 100 && newY >= window.innerHeight - 100;
      
      const cornerHit = hitTopLeft || hitTopRight || hitBottomLeft || hitBottomRight;
      
      if (cornerHit) {
        actualCornerHit = true;
        setHitCorner(true);
        setShowTrollTransform(true);
        setTimeout(() => {
          setShowTrollTransform(false);
          setHitCorner(false);
        }, 3000);
      }        setDvdVelocity({ x: newVelX, y: newVelY });
        
        return {
          x: Math.max(0, Math.min(window.innerWidth - 120, newX)),
          y: Math.max(0, Math.min(window.innerHeight - 80, newY))
        };
      });
      
      animationRef.current = requestAnimationFrame(animateDVD);
    };
    
    if (showLoadAnimation) {
      animationRef.current = requestAnimationFrame(animateDVD);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showLoadAnimation, dvdVelocity]);

  return (
    <div style={{ 
      backgroundColor: '#0f0f23', 
      color: 'white', 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* DVD Screensaver Load Animation */}

      {/* TROLL FACE WITH DYNAMIC OPACITY AND SCALING */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '400px',
        height: '400px',
        marginTop: '-200px',
        marginLeft: '-200px',
        backgroundImage: 'url(/blutrollface.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '50%',
        opacity: (() => {
          // More dramatic opacity scaling with exponential curve
          const proximityFactor = Math.max(0, Math.min(1, (600 - cornerDistance) / 600));
          const exponentialOpacity = Math.pow(proximityFactor, 1.5);
          const pulseEffect = proximityFactor > 0.7 ? 1 + Math.sin(Date.now() * 0.008) * 0.3 : 1;
          return Math.max(0.02, Math.min(1, exponentialOpacity * 0.95 * pulseEffect));
        })(),
        transform: (() => {
          // More dramatic scaling with exponential curve and wobble effect
          const proximityFactor = Math.max(0, Math.min(1, (600 - cornerDistance) / 600));
          const exponentialScale = Math.pow(proximityFactor, 1.2);
          const baseScale = 0.2 + (exponentialScale * 2.3); // Scale from 20% to 250%
          const wobbleEffect = proximityFactor > 0.6 ? 1 + Math.sin(Date.now() * 0.012) * 0.15 : 1;
          return `scale(${baseScale * wobbleEffect}) rotate(${proximityFactor > 0.8 ? Math.sin(Date.now() * 0.01) * 5 : 0}deg)`;
        })(),
        transition: cornerDistance < 200 ? 'none' : 'opacity 0.3s ease-out, transform 0.3s ease-out',
        zIndex: 999999,
        border: '3px solid white',
        pointerEvents: 'none'
      }} />
      
      {/* TROLOLOLO TEXT WHEN CLOSE TO CORNER */}
      {cornerDistance < 300 && (
        <div style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: `${Math.max(60, (300 - cornerDistance) * 2)}px`,
          fontWeight: 'bold',
          color: cornerDistance < 150 ? '#ff0000' : '#00ff00',
          textShadow: '0 0 20px currentColor',
          zIndex: 999998,
          pointerEvents: 'none',
          animation: cornerDistance < 150 ? 'shake 0.1s infinite' : 'none',
          opacity: Math.max(0.5, (300 - cornerDistance) / 300),
          fontFamily: 'monospace',
          letterSpacing: '5px'
        }}>
          TROLLOLLOLLLLLOOLLIOOOO
        </div>
      )}
      
      {/* DVD Screensaver Load Animation */}
      {showLoadAnimation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000000',
          zIndex: 9999,
          pointerEvents: 'none'
        }}>
          {/* DVD Logo */}
          <div 
            style={{
              position: 'absolute',
              left: `${dvdPosition.x}px`,
              top: `${dvdPosition.y}px`,
              width: '120px',
              height: '80px',
              transition: showTrollTransform ? 'all 1s ease-out' : 'none',
              transform: showTrollTransform ? 'scale(2) rotate(360deg)' : 'scale(1)',
              opacity: showTrollTransform ? '0' : '1',
              zIndex: 10001
            }}
          >
            {!showTrollTransform ? (
              // Official DVD Logo
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: dvdColor,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 20px ${dvdColor}`,
                border: '2px solid #fff',
                padding: '10px'
              }}>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e7/DVD-Video_Logo.svg"
                  alt="DVD Logo"
                  style={{
                    width: '90px',
                    height: 'auto',
                    maxHeight: '50px',
                    filter: 'brightness(0) invert(1)', // Makes it white/black to contrast with colored background
                  }}
                />
              </div>
            ) : (
              // Troll Face Transform
              <div style={{
                width: '120px',
                height: '120px',
                animation: 'trollSpawn 1.5s ease-out forwards'
              }}>
                <Image
                  src="/blutrollface.jpeg"
                  alt="Troll Face"
                  width={120}
                  height={120}
                  style={{
                    borderRadius: '50%',
                    border: '4px solid #34d399',
                    filter: 'drop-shadow(0 0 30px #34d399)'
                  }}
                />
              </div>
            )}
          </div>

          {/* Corner Hit Explosion Effect */}
          {hitCorner && (
            <div style={{
              position: 'absolute',
              left: `${dvdPosition.x + 60}px`,
              top: `${dvdPosition.y + 40}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10000
            }}>
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '6px',
                    height: '6px',
                    backgroundColor: dvdColor,
                    borderRadius: '50%',
                    boxShadow: `0 0 10px ${dvdColor}`,
                    animation: `cornerExplosion${i % 8} 1s ease-out forwards`,
                    animationDelay: '0.2s'
                  }}
                />
              ))}
            </div>
          )}

          {/* "CORNER HIT!" Text */}
          {hitCorner && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '4rem',
              fontWeight: 'bold',
              color: '#fbbf24',
              textShadow: '0 0 20px #fbbf24',
              animation: 'cornerText 1.5s ease-out forwards',
              zIndex: 10002
            }}>
              CORNER HIT!
            </div>
          )}
        </div>
      )}
      {/* Animated Background Artifacts */}
      
      {/* Flying Saucer */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        animation: 'floatSaucer 8s ease-in-out infinite',
        transform: `translateX(${scroll * 0.2}px)`,
        zIndex: 1
      }}>
        <div style={{
          width: '60px',
          height: '25px',
          backgroundColor: '#34d399',
          borderRadius: '50px',
          position: 'relative',
          boxShadow: '0 0 20px rgba(52, 211, 153, 0.5)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '30px',
            height: '15px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)'
          }}></div>
        </div>
      </div>

      {/* Planet 1 - Original Blue with Rings */}
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        animation: 'floatPlanet 12s ease-in-out infinite',
        transform: `translateY(${scroll * -0.1}px)`,
        zIndex: 1
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
          borderRadius: '50%',
          position: 'relative',
          boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)'
        }}>
          {/* Planet rings */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120px',
            height: '40px',
            border: '2px solid rgba(52, 211, 153, 0.6)',
            borderRadius: '50%',
            animation: 'rotatePlanet 6s linear infinite'
          }}></div>
        </div>
      </div>

      {/* Planet 2 - Large Red Gas Giant */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '8%',
        animation: 'orbitPlanet 20s linear infinite',
        transform: `translateX(${scroll * 0.15}px)`,
        zIndex: 1
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle at 30% 30%, #ff6b6b, #ee5a24, #c44569)',
          borderRadius: '50%',
          position: 'relative',
          boxShadow: '0 0 50px rgba(255, 107, 107, 0.5)'
        }}>
          {/* Gas bands */}
          <div style={{
            position: 'absolute',
            top: '25%',
            left: '10%',
            right: '10%',
            height: '8px',
            background: 'rgba(238, 90, 36, 0.7)',
            borderRadius: '4px'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '60%',
            left: '15%',
            right: '15%',
            height: '6px',
            background: 'rgba(196, 69, 105, 0.8)',
            borderRadius: '3px'
          }}></div>
        </div>
      </div>

      {/* Planet 3 - Small Green Earth-like */}
      <div style={{
        position: 'absolute',
        top: '80%',
        left: '75%',
        animation: 'bouncePlanet 8s ease-in-out infinite',
        transform: `translateY(${scroll * -0.2}px)`,
        zIndex: 1
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          background: 'linear-gradient(135deg, #00b894, #00a085, #55a3ff)',
          borderRadius: '50%',
          position: 'relative',
          boxShadow: '0 0 20px rgba(0, 184, 148, 0.6)',
          animation: 'spinPlanet 15s linear infinite'
        }}>
          {/* Continents */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '25%',
            width: '15px',
            height: '12px',
            background: '#00a085',
            borderRadius: '40% 60% 60% 40%'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '25%',
            right: '20%',
            width: '12px',
            height: '10px',
            background: '#00a085',
            borderRadius: '50% 30% 50% 30%'
          }}></div>
        </div>
      </div>

      {/* Planet 4 - Purple Moon with Crater */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '60%',
        animation: 'wobblePlanet 6s ease-in-out infinite',
        transform: `translateX(${scroll * 0.08}px)`,
        zIndex: 1
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
          borderRadius: '50%',
          position: 'relative',
          boxShadow: '0 0 25px rgba(162, 155, 254, 0.4)'
        }}>
          {/* Large crater */}
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '35%',
            width: '18px',
            height: '18px',
            background: 'radial-gradient(circle, #4834d4, #686de0)',
            borderRadius: '50%',
            boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3)'
          }}></div>
          {/* Small craters */}
          <div style={{
            position: 'absolute',
            top: '60%',
            left: '20%',
            width: '8px',
            height: '8px',
            background: '#4834d4',
            borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '25%',
            width: '6px',
            height: '6px',
            background: '#4834d4',
            borderRadius: '50%'
          }}></div>
        </div>
      </div>

      {/* Planet 5 - Tiny Orange Asteroid */}
      <div style={{
        position: 'absolute',
        top: '45%',
        left: '25%',
        animation: 'chaticPlanet 4s ease-in-out infinite',
        transform: `translateY(${scroll * 0.3}px)`,
        zIndex: 1
      }}>
        <div style={{
          width: '30px',
          height: '30px',
          background: 'linear-gradient(135deg, #fdcb6e, #e17055)',
          borderRadius: '60% 40% 30% 70%',
          position: 'relative',
          boxShadow: '0 0 15px rgba(253, 203, 110, 0.5)',
          animation: 'tumblePlanet 3s linear infinite'
        }}>
          {/* Rocky texture */}
          <div style={{
            position: 'absolute',
            top: '25%',
            left: '30%',
            width: '6px',
            height: '6px',
            background: '#d63031',
            borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '60%',
            right: '25%',
            width: '4px',
            height: '4px',
            background: '#d63031',
            borderRadius: '50%'
          }}></div>
        </div>
      </div>

      {/* Planet 6 - Large Yellow Sun-like */}
      <div style={{
        position: 'absolute',
        top: '35%',
        right: '5%',
        animation: 'pulsePlanet 10s ease-in-out infinite',
        transform: `translateY(${scroll * -0.05}px)`,
        zIndex: 1
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle at 40% 40%, #ffeaa7, #fdcb6e, #e17055)',
          borderRadius: '50%',
          position: 'relative',
          boxShadow: '0 0 60px rgba(255, 234, 167, 0.8), 0 0 100px rgba(253, 203, 110, 0.4)',
          animation: 'solar 20s linear infinite'
        }}>
          {/* Solar flares */}
          <div style={{
            position: 'absolute',
            top: '-5px',
            left: '45%',
            width: '10px',
            height: '15px',
            background: 'linear-gradient(180deg, #ffeaa7, transparent)',
            borderRadius: '50% 50% 0 0',
            animation: 'flare1 3s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            right: '-5px',
            top: '40%',
            width: '15px',
            height: '10px',
            background: 'linear-gradient(90deg, #ffeaa7, transparent)',
            borderRadius: '0 50% 50% 0',
            animation: 'flare2 4s ease-in-out infinite'
          }}></div>
        </div>
      </div>

      {/* Stars - Various Sizes and Styles */}
      
      {/* Large bright star */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '75%',
        width: '8px',
        height: '8px',
        backgroundColor: '#fbbf24',
        borderRadius: '50%',
        boxShadow: '0 0 15px #fbbf24, 0 0 30px #fbbf24',
        animation: 'twinkle 2s ease-in-out infinite alternate'
      }}></div>
      
      {/* Cross-shaped star */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '80%',
        animation: 'twinkle 2.5s ease-in-out infinite alternate'
      }}>
        <div style={{
          position: 'absolute',
          width: '12px',
          height: '2px',
          backgroundColor: '#e879f9',
          boxShadow: '0 0 8px #e879f9'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '2px',
          height: '12px',
          backgroundColor: '#e879f9',
          boxShadow: '0 0 8px #e879f9',
          left: '5px',
          top: '-5px'
        }}></div>
      </div>

      {/* Medium star */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '20%',
        width: '5px',
        height: '5px',
        backgroundColor: '#34d399',
        borderRadius: '50%',
        boxShadow: '0 0 10px #34d399',
        animation: 'twinkle 3s ease-in-out infinite alternate'
      }}></div>

      {/* Small twinkle */}
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '15%',
        width: '2px',
        height: '2px',
        backgroundColor: '#f87171',
        borderRadius: '50%',
        boxShadow: '0 0 4px #f87171',
        animation: 'twinkle 1.8s ease-in-out infinite alternate'
      }}></div>

      {/* Diamond star */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '90%',
        width: '6px',
        height: '6px',
        backgroundColor: '#60a5fa',
        transform: 'rotate(45deg)',
        boxShadow: '0 0 12px #60a5fa',
        animation: 'twinkle 2.8s ease-in-out infinite alternate'
      }}></div>

      {/* Tiny stars cluster */}
      <div style={{
        position: 'absolute',
        top: '55%',
        left: '25%',
        width: '1.5px',
        height: '1.5px',
        backgroundColor: '#a78bfa',
        borderRadius: '50%',
        boxShadow: '0 0 3px #a78bfa',
        animation: 'twinkle 2.2s ease-in-out infinite alternate'
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '58%',
        left: '28%',
        width: '1px',
        height: '1px',
        backgroundColor: '#fbbf24',
        borderRadius: '50%',
        boxShadow: '0 0 2px #fbbf24',
        animation: 'twinkle 3.5s ease-in-out infinite alternate'
      }}></div>

      {/* Large pulsing star */}
      <div style={{
        position: 'absolute',
        top: '70%',
        left: '85%',
        width: '10px',
        height: '10px',
        backgroundColor: '#34d399',
        borderRadius: '50%',
        boxShadow: '0 0 20px #34d399, 0 0 40px #34d399',
        animation: 'pulse 3s ease-in-out infinite'
      }}></div>

      {/* More scattered small stars */}
      <div style={{
        position: 'absolute',
        top: '85%',
        left: '15%',
        width: '3px',
        height: '3px',
        backgroundColor: '#f472b6',
        borderRadius: '50%',
        boxShadow: '0 0 6px #f472b6',
        animation: 'twinkle 2.3s ease-in-out infinite alternate'
      }}></div>

      <div style={{
        position: 'absolute',
        top: '8%',
        left: '45%',
        width: '4px',
        height: '4px',
        backgroundColor: '#fbbf24',
        borderRadius: '50%',
        boxShadow: '0 0 8px #fbbf24',
        animation: 'twinkle 1.5s ease-in-out infinite alternate'
      }}></div>

      <div style={{
        position: 'absolute',
        top: '45%',
        left: '5%',
        width: '2.5px',
        height: '2.5px',
        backgroundColor: '#60a5fa',
        borderRadius: '50%',
        boxShadow: '0 0 5px #60a5fa',
        animation: 'twinkle 2.7s ease-in-out infinite alternate'
      }}></div>

      <div style={{
        position: 'absolute',
        top: '90%',
        left: '60%',
        width: '1.5px',
        height: '1.5px',
        backgroundColor: '#34d399',
        borderRadius: '50%',
        boxShadow: '0 0 3px #34d399',
        animation: 'twinkle 4s ease-in-out infinite alternate'
      }}></div>

      {/* Header Navigation */}
      <header style={{ 
        borderBottom: '1px solid rgba(52, 211, 153, 0.3)', 
        padding: '1rem 0',
        backgroundColor: 'rgba(15, 15, 35, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 10
      }}>
        <nav style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#34d399', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f0f23', fontWeight: 'bold' }}>
              ₿
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#34d399' }}>CryptoVerse</span>
          </div>
          
          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}>X</a>
            <a href="https://dexscreener.com" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}>DexScreener</a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}>Telegram</a>
            <a href="#shop" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}>Shop</a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center', position: 'relative', zIndex: 5 }}>
        
        {/* Image */}
        <div style={{ marginBottom: '3rem' }}>
          <Image
            src="/blutrollface.jpeg"
            alt="CryptoVerse"
            width={200}
            height={200}
            style={{ 
              borderRadius: '50%', 
              border: '4px solid #34d399',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(52, 211, 153, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            priority
          />
        </div>

        {/* Title */}
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: '900', 
          marginBottom: '1rem', 
          background: 'linear-gradient(135deg, #34d399, #10b981)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          CryptoVerse
        </h1>
        
        {/* Green line */}
        <div style={{ 
          width: '96px', 
          height: '4px', 
          background: 'linear-gradient(90deg, #34d399, #10b981)', 
          margin: '1.5rem auto',
          borderRadius: '2px',
          boxShadow: '0 0 10px rgba(52, 211, 153, 0.5)'
        }}></div>
        
        {/* Subtitle */}
        <p style={{ 
          fontSize: '1.5rem', 
          color: '#d1d5db', 
          marginBottom: '3rem', 
          maxWidth: '800px', 
          margin: '0 auto 3rem auto' 
        }}>
          The future of decentralized finance meets AI innovation
        </p>

        {/* Button */}
        <button style={{ 
          background: 'linear-gradient(135deg, #34d399, #10b981)', 
          color: '#0f0f23', 
          fontWeight: '600', 
          padding: '1rem 3rem', 
          borderRadius: '12px', 
          border: 'none', 
          fontSize: '1.125rem', 
          cursor: 'pointer',
          boxShadow: '0 0 20px rgba(52, 211, 153, 0.4)',
          transition: 'all 0.3s ease'
        }}>
          Enter the Verse
        </button>
      </main>

      <style jsx>{`
        @keyframes trollSpawn {
          0% { 
            transform: scale(0) rotate(0deg); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.5) rotate(180deg); 
            opacity: 1; 
          }
          100% { 
            transform: scale(1) rotate(360deg); 
            opacity: 1; 
          }
        }

        @keyframes trollPeek {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes trollIntensify {
          0% { 
            transform: translate(-50%, -50%) scale(1) rotate(-2deg);
            filter: brightness(1.2) saturate(1.5) hue-rotate(0deg);
          }
          100% { 
            transform: translate(-50%, -50%) scale(1.1) rotate(2deg);
            filter: brightness(1.8) saturate(2) hue-rotate(10deg);
          }
        }

        @keyframes cornerText {
          0% { 
            transform: translate(-50%, -50%) scale(0); 
            opacity: 0; 
          }
          30% { 
            transform: translate(-50%, -50%) scale(1.2); 
            opacity: 1; 
          }
          70% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 1; 
          }
          100% { 
            transform: translate(-50%, -50%) scale(0.8); 
            opacity: 0; 
          }
        }

        @keyframes cornerExplosion0 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(150px, 0) scale(0); opacity: 0; }
        }
        @keyframes cornerExplosion1 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(106px, 106px) scale(0); opacity: 0; }
        }
        @keyframes cornerExplosion2 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(0, 150px) scale(0); opacity: 0; }
        }
        @keyframes cornerExplosion3 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-106px, 106px) scale(0); opacity: 0; }
        }
        @keyframes cornerExplosion4 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-150px, 0) scale(0); opacity: 0; }
        }
        @keyframes cornerExplosion5 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-106px, -106px) scale(0); opacity: 0; }
        }
        @keyframes cornerExplosion6 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(0, -150px) scale(0); opacity: 0; }
        }
        @keyframes cornerExplosion7 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(106px, -106px) scale(0); opacity: 0; }
        }

        @keyframes floatSaucer {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(2deg); }
          50% { transform: translateY(-5px) rotate(-1deg); }
          75% { transform: translateY(-20px) rotate(1deg); }
        }
        
        @keyframes floatPlanet {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        
        @keyframes rotatePlanet {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes orbitPlanet {
          0%, 100% { transform: translateY(0px) scale(1); }
          25% { transform: translateY(-20px) scale(1.05); }
          50% { transform: translateY(-10px) scale(0.95); }
          75% { transform: translateY(-25px) scale(1.1); }
        }

        @keyframes bouncePlanet {
          0%, 100% { transform: translateY(0px); }
          25% { transform: translateY(-40px); }
          50% { transform: translateY(-10px); }
          75% { transform: translateY(-30px); }
        }

        @keyframes wobblePlanet {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          25% { transform: translateX(-8px) rotate(5deg); }
          50% { transform: translateX(0px) rotate(0deg); }
          75% { transform: translateX(8px) rotate(-5deg); }
        }

        @keyframes chaticPlanet {
          0% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(90deg); }
          50% { transform: translateY(-5px) rotate(180deg); }
          75% { transform: translateY(-20px) rotate(270deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }

        @keyframes pulsePlanet {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        @keyframes spinPlanet {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes tumblePlanet {
          from { transform: rotate(0deg) scale(1); }
          to { transform: rotate(360deg) scale(1.1); }
        }

        @keyframes solar {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }

        @keyframes flare1 {
          0%, 100% { opacity: 0.7; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.5); }
        }

        @keyframes flare2 {
          0%, 100% { opacity: 0.6; transform: scaleX(1); }
          50% { opacity: 1; transform: scaleX(1.3); }
        }
        
        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
      `}</style>

      {/* Giant Center Troll Face - Ultimate Psychological Tease */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${Math.max(0.3, Math.min(1.5, (600 - cornerDistance) / 300))})`,
        width: '500px',
        height: '500px',
        backgroundImage: 'url(/blutrollface.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '50%',
        opacity: cornerDistance > 600 ? 0.4 : Math.max(0.4, Math.min(0.9, (600 - cornerDistance) / 400)),
        transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        zIndex: 50,
        pointerEvents: 'none',
        filter: `brightness(${1 + Math.max(0, (300 - cornerDistance) / 600)}) saturate(${1 + Math.max(0, (300 - cornerDistance) / 400)})`,
        animation: cornerDistance < 200 ? 'trollIntensify 0.4s ease-in-out infinite alternate' : 'none',
        border: `3px solid rgba(52, 211, 153, ${Math.max(0.3, Math.min(1, (400 - cornerDistance) / 300))})`,
        boxShadow: `0 0 ${Math.max(10, Math.min(50, (400 - cornerDistance) / 5))}px rgba(52, 211, 153, ${Math.max(0.1, Math.min(0.8, (400 - cornerDistance) / 400))})`,
        backgroundColor: 'rgba(255, 0, 0, 0.3)'
      }} />

      {/* Simple test circle to confirm positioning */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100px',
        height: '100px',
        backgroundColor: 'yellow',
        borderRadius: '50%',
        zIndex: 100,
        border: '3px solid black'
      }} />
    </div>
  );
}
