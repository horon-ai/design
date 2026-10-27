/**
 * Size and visibility for every glass host on the page, from two observers.
 *
 * A page can hold dozens of glass surfaces, and each host that watched itself
 * with its own `ResizeObserver` or scroll listener would cost its own layout
 * read on every frame that moves it. Both observers here are module-level
 * singletons created on the first `watchHost` call and shared by every host.
 *
 * Sizes come from `offsetWidth`/`offsetHeight`: layout pixels, so an ancestor
 * scaled with `transform` does not shrink the measurement a displacement map is
 * built from. The browser reports, so nothing here runs per frame, and a size
 * equal to the last one is not reported again: a host that rebuilds its filter
 * on every report would rebuild it on every observer tick.
 */

export type HostHandlers = {
  onSize: (width: number, height: number) => void;
  onVisible: (visible: boolean) => void;
};

type Watched = HostHandlers & { width: number; height: number };

/** How far outside the viewport a host still counts as worth preparing. */
const ROOT_MARGIN = "100px";
/** `offsetWidth` and `offsetHeight` are never negative, so this is "never reported". */
const UNREPORTED = -1;

let resizeObserver: ResizeObserver | null = null;
let intersectionObserver: IntersectionObserver | null = null;

const watchedHosts = new Map<Element, Watched>();

const reportSize = (element: Element, watched: Watched): void => {
  if (!(element instanceof HTMLElement)) return;
  const { offsetWidth: width, offsetHeight: height } = element;
  if (width === watched.width && height === watched.height) return;
  watched.width = width;
  watched.height = height;
  watched.onSize(width, height);
};

const sharedResizeObserver = (): ResizeObserver => {
  resizeObserver ??= new ResizeObserver((entries) => {
    for (const entry of entries) {
      const watched = watchedHosts.get(entry.target);
      if (watched) reportSize(entry.target, watched);
    }
  });
  return resizeObserver;
};

const sharedIntersectionObserver = (): IntersectionObserver => {
  intersectionObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) watchedHosts.get(entry.target)?.onVisible(entry.isIntersecting);
    },
    { rootMargin: ROOT_MARGIN },
  );
  return intersectionObserver;
};

const dropObserversWhenIdle = (): void => {
  if (watchedHosts.size > 0) return;
  resizeObserver?.disconnect();
  resizeObserver = null;
  intersectionObserver?.disconnect();
  intersectionObserver = null;
};

/**
 * Watches one host until the returned function is called. The first size report
 * arrives with the observers in place, so a caller needs no measurement of its
 * own; visibility arrives from the intersection observer and repeats only when
 * it changes.
 */
export function watchHost(element: Element, handlers: HostHandlers): () => void {
  if (!(element instanceof HTMLElement)) return () => {};

  const watched: Watched = { ...handlers, width: UNREPORTED, height: UNREPORTED };
  watchedHosts.set(element, watched);
  sharedResizeObserver().observe(element);
  sharedIntersectionObserver().observe(element);
  reportSize(element, watched);

  let watching = true;
  return () => {
    if (!watching) return;
    watching = false;
    watchedHosts.delete(element);
    resizeObserver?.unobserve(element);
    intersectionObserver?.unobserve(element);
    dropObserversWhenIdle();
  };
}
