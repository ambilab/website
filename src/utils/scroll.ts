export interface ScrollOptions {
  targetId: string;
  offset?: number;
  onComplete?: () => void;
}

export interface ScrollResult {
  success: boolean;
  element: HTMLElement | null;
}

export const smoothScrollTo = async ({
  targetId,
  offset = 0,
  onComplete,
}: ScrollOptions): Promise<ScrollResult> => {
  const element = document.getElementById(targetId);

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (offset) window.scrollBy(0, offset);

    return new Promise((resolve) =>
      setTimeout(() => {
        onComplete?.();
        resolve({ success: true, element });
      }, 1000)
    );
  }

  return { success: false, element: null };
};

export const scrollToTop = (smooth = true): void => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

