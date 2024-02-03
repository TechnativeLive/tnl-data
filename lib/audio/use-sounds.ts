'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { defaultSounds } from '../timer/utils';

const createAudioElements = (sounds: Record<string, string>) =>
  Object.entries(sounds).map(([key, url]) => ({ key, audio: new Audio(url) }));

export function useSounds<T extends Record<string, string>>(
  sounds: T = defaultSounds as unknown as T,
  interrupt = true,
) {
  const audioElements = useRef<ReturnType<typeof createAudioElements>>();
  const [error, setError] = useState(false);

  useEffect(() => {
    audioElements.current?.forEach(({ audio }) => audio.remove());
    audioElements.current = createAudioElements(sounds);

    return () => audioElements.current?.forEach(({ audio }) => audio.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(sounds)]);

  const play = useCallback(
    (sound: keyof T) => {
      audioElements.current?.forEach(({ key, audio }) => {
        if (key === sound)
          audio
            .play()
            .then(() => setError(false))
            .catch((e) => {
              if (String(e).startsWith('NotAllowedError')) setError(true);
            });
        else if (interrupt) audio.pause();
      });
    },
    [interrupt],
  );
  const pause = useCallback(
    (sound: keyof T) => {
      audioElements.current?.forEach(({ key, audio }) => {
        if (key === sound) audio.pause();
        else if (interrupt) audio.pause();
      });
    },
    [interrupt],
  );
  const seek = useCallback(
    (sound: keyof T, time: number) => {
      audioElements.current?.forEach(({ key, audio }) => {
        if (key === sound) {
          if (typeof audio?.currentTime === 'number' && time < (audio?.duration || 0)) {
            audio.currentTime = time;
            audio.pause();
          }
          return;
        }
        if (interrupt) audio.pause();
      });
    },
    [interrupt],
  );
  const playFrom = useCallback(
    (sound: keyof T, time: number) => {
      if (sound === '') {
        console.warn('sound not defined');
        return;
      }
      audioElements.current?.forEach(({ key, audio }) => {
        if (key === sound.toString()) {
          if (typeof audio?.currentTime === 'number' && time < (audio?.duration || 0)) {
            audio.currentTime = time;
            audio.pause();
          }
          audio
            .play()
            .then(() => setError(false))
            .catch((e) => {
              if (String(e).startsWith('NotAllowedError')) setError(true);
            });
          console.log('sound:', key, 'play');
          return;
        }
        if (interrupt) audio.pause();
      });
    },
    [interrupt],
  );
  const playFromStart = useCallback((sound: keyof T) => playFrom(sound, 0), [playFrom]);

  return {
    play,
    pause,
    seek,
    playFrom,
    playFromStart,
    error,
  };
}
