import { useMemo, useEffect, useCallback } from 'react';
import { Howl } from 'howler';

import { useSSR } from './use-ssr';

export function useSound(src: string, volume: number = 1) {
  const { isBrowser } = useSSR();

  const sound = useMemo<Howl | null>(() => {
    let sound: Howl | null = null;

    if (isBrowser) {
      sound = new Howl({
        html5: true,
        src: src,
      });
    }

    return sound;
  }, [src, isBrowser]);

  useEffect(() => {
    if (sound) sound.volume(typeof volume === 'number' ? volume : 1);
  }, [sound, volume]);

  const play = useCallback(
    (cb?: () => void) => {
      if (sound) {
        if (!sound.playing()) {
          sound.play();

          if (typeof cb === 'function') sound.once('end', cb);
        }
      }
    },
    [sound],
  );

  const stop = useCallback(() => {
    if (sound) sound.stop();
  }, [sound]);

  const pause = useCallback(() => {
    if (sound) sound.pause();
  }, [sound]);

  const setVolume = useCallback(
    (volume: number) => {
      if (sound) sound.volume(volume);
    },
    [sound],
  );

  const control = useMemo(
    () => ({ pause, play, setVolume, stop }),
    [play, stop, pause, setVolume],
  );

  return control;
}
