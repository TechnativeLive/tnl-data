import autoAnimate, { getTransitionSizes } from '@formkit/auto-animate';

export const autoAnimateAnnouncements = autoAnimateSlide('translate(400%, 0)', 'translate(-100%, 0)');
export const autoAnimateRows = autoAnimateSlide('translate(-100%, 0)', 'translate(100%, 0)');

function autoAnimateSlide(enter: string, exit: string): Parameters<typeof autoAnimate>[1] {
  return (
    el,
    action,
    oldCoords,
    newCoords,
  ) => {
    let keyframes: Keyframe[] = [];
    // supply a different set of keyframes for each action
    if (action === 'add') {
      keyframes = [
        { transform: enter, opacity: 0 },
        { transform: 'translate(0%, 0)', opacity: 1 },
      ];
    }
    // keyframes can have as many "steps" as you prefer
    // and you can use the 'offset' key to tune the timing
    if (action === 'remove') {
      keyframes = [
        { transform: 'translate(0%, 0)', opacity: 1 },
        { transform: exit, opacity: 0 },
      ];
    }
    if (action === 'remain' && oldCoords && newCoords) {
      // for items that remain, calculate the delta
      // from their old position to their new position
      const deltaX = oldCoords.left - newCoords.left;
      const deltaY = oldCoords.top - newCoords.top;
      // use the getTransitionSizes() helper function to
      // get the old and new widths of the elements
      const [widthFrom, widthTo, heightFrom, heightTo] = getTransitionSizes(
        el,
        oldCoords,
        newCoords,
      ) as [number, number, number, number];

      // set up our steps with our positioning keyframes
      const start: Keyframe = { transform: `translate(${deltaX}px, ${deltaY}px)` };
      const mid: Keyframe = {
        transform: `translate(${deltaX * -0.15}px, ${deltaY * -0.15}px)`,
        offset: 0.75,
      };
      const end: Keyframe = { transform: `translate(0, 0)` };
      // if the dimensions changed, animate them too.
      if (widthFrom !== widthTo) {
        start.width = `${widthFrom}px`;
        mid.width = `${widthFrom >= widthTo ? widthTo / 1.05 : widthTo * 1.05}px`;
        end.width = `${widthTo}px`;
      }
      if (heightFrom !== heightTo) {
        start.height = `${heightFrom}px`;
        mid.height = `${heightFrom >= heightTo ? heightTo / 1.05 : heightTo * 1.05}px`;
        end.height = `${heightTo}px`;
      }
      keyframes = [start, mid, end];
    }
    // return our KeyframeEffect() and pass
    // it the chosen keyframes.
    return new KeyframeEffect(el, keyframes, {
      duration: 600,
      easing: 'cubic-bezier(0.87, 0, 0.13, 1)',
    });
  }
}