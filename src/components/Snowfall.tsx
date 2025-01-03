import { useEffect, useState } from 'react';

export function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = (
        <div
          key={Math.random()}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}vw`,
            fontSize: `${Math.random() * (20 - 10) + 10}px`,
            filter: `blur(${Math.random() * 3}px)`
          }}
        >
          ❄
        </div>
      );
      return snowflake;
    };

    const initialSnowflakes = Array.from({ length: 50 }, createSnowflake);
    setSnowflakes(initialSnowflakes);

    const interval = setInterval(() => {
      setSnowflakes(prev => [...prev.slice(-49), createSnowflake()]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <div className="snowfall-container">{snowflakes}</div>;
}